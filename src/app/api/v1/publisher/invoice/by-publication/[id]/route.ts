import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const publicationId = Number(params.id);
  if (isNaN(publicationId)) {
    return NextResponse.json(
      { error: "Invalid publication ID" },
      { status: 400 }
    );
  }

  try {
    const item = await prisma.transactionItem.findFirst({
      where: { publication_id: publicationId },
      include: {
        transaction: true, 
      },
    });

    if (!item) {
      return NextResponse.json({
        status: "success",
        message: "No invoice found for this publication",
        data: null,
      });
    }

    return NextResponse.json({
      status: "success",
      data: {
        transaction_id: item.transaction_id,
        cost: item.cost,
        total_cost: item.total_cost,
        quantity: item.quantity,
        transaction_notes: item.transaction.transaction_notes,
        createdAt: item.transaction.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching invoice by publication:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}
