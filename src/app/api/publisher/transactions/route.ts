import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ItemInput } from "@/types/itemInput";
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user_id) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Ambil raw body buat cek kalau kosong
    const rawBody = await req.text();
    console.log("Raw Body:", rawBody);

    if (!rawBody) {
      return NextResponse.json(
        { error: "Empty request body" },
        { status: 400 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(rawBody);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    const { items, transaction_notes } = parsed;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    for (const item of items) {
      if (
        !item.publication_id ||
        typeof item.cost !== "number" ||
        item.cost <= 0 ||
        typeof item.quantity !== "number" ||
        item.quantity <= 0
      ) {
        return NextResponse.json(
          { error: "Invalid item data" },
          { status: 400 }
        );
      }
    }

    const userId = Number(session.user_id);
    const current_status_id = 1;

    const newTransaction = await prisma.transaction.create({
      data: {
        user_id: userId,
        current_status_id,
        transaction_notes: transaction_notes || null,
      },
    });

    // const itemData = items.map((item: ItemInput) => ({
    //   transaction_id: newTransaction.id,
    //   publication_id: item.publication_id,
    //   cost: item.cost,
    //   quantity: item.quantity,
    //   total_cost: item.cost * item.quantity,
    // }));

    // await prisma.transactionItem.createMany({
    //   data: itemData,
    // });
    // await prisma.transactionLog.create({
    //   data: {
    //     transaction_id: newTransaction.id,
    //     user_id: userId,
    //     transaction_status_id: current_status_id,
    //     note: transaction_notes || null,
    //   },
    // });
    const itemData = items.map((item: ItemInput) => ({
      transaction_id: newTransaction.id,
      publication_id: item.publication_id,
      cost: item.cost,
      quantity: item.quantity,
      total_cost: item.cost * item.quantity,
    }));


    const publicationIds = items.map((item) => item.publication_id);
    await Promise.all([
      prisma.transactionItem.createMany({ data: itemData }),
      prisma.publication.updateMany({
        where: { id: { in: publicationIds } },
        data: { is_invoice: true },
      }),
      prisma.transactionLog.create({
        data: {
          transaction_id: newTransaction.id,
          user_id: userId,
          transaction_status_id: current_status_id,
          note: transaction_notes || null,
        },
      }),
    ]);

    return NextResponse.json({
      status: "success",
      message: "Transaction created with items",
      data: {
        transaction: newTransaction,
        items: itemData,
      },
    });
  } catch (error: unknown) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    console.error("Error creating transaction:", errorMessage);
    return NextResponse.json(
      {
        error: "Failed to create transaction",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
