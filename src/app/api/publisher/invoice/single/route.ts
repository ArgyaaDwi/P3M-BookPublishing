import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user_id) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await req.json();
    const { publication_id, cost, note } = body;

    if (!publication_id || typeof cost !== "number" || cost <= 0) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const userId = Number(session.user_id);
    const current_status_id = 1; 

    
    const newTransaction = await prisma.transaction.create({
      data: {
        user_id: userId,
        current_status_id,
        transaction_notes: note || null,
      },
    });

  
    const createdItem = await prisma.transactionItem.create({
      data: {
        transaction_id: newTransaction.id,
        publication_id,
        cost,
        quantity: 1,
        total_cost: cost,
      },
    });

    // Buat log transaksi
    await prisma.transactionLog.create({
      data: {
        transaction_id: newTransaction.id,
        user_id: userId,
        transaction_status_id: current_status_id,
        note: note || null,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Transaksi berhasil dibuat untuk satu buku",
      data: {
        transaction: newTransaction,
        item: createdItem,
      },
    });
  } catch (error: unknown) {
    console.error("Error creating single transaction:", error);
    let message = "Gagal membuat transaksi";
    if (error instanceof Error) message = error.message;
    return NextResponse.json(
      {
        error: "Gagal membuat transaksi",
        message,
      },
      { status: 500 }
    );
  }
}
