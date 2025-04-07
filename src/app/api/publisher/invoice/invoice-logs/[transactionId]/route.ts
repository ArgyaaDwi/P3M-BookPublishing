import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 

export async function GET(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const transactionId = parseInt(params.transactionId, 10);
    if (isNaN(transactionId)) {
      return NextResponse.json(
        { status: "error", message: "Invalid Publication ID" },
        { status: 400 }
      );
    }

    const logs = await prisma.transactionLog.findMany({
      where: { transaction_id: transactionId, deleted: false },
      select: {
        id: true,
        transaction_status_id: true,
        note: true,
        createdAt: true,
        user: {
          select: {
            name: true, 
          },
        },
        status: {
          select: {
            status_name: true, 
          },
        },
      },
      orderBy: { createdAt: "asc" }, 
    });

    return NextResponse.json(
      { status: "success", data: logs },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching publication activities:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
