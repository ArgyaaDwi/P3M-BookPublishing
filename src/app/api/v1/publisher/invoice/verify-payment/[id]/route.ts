import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { newStatusId, note } = await req.json();
    console.log("Updating Invoice ID:", id);
    const session = await getSession();
    if (!session || !session.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(id) },
      include: {
        items: {
          select: {
            publication_id: true,
          },
        },
      },
    });
    if (!transaction) {
      return NextResponse.json(
        { error: "Invoice tidak ditemukan" },
        { status: 404 }
      );
    }
    const publicationIds = transaction.items.map((item) => item.publication_id);
    await Promise.all([
      prisma.transaction.update({
        where: { id: Number(id) },
        data: { current_status_id: Number(newStatusId) },
      }),
      prisma.publication.updateMany({
        where: {
          id: {
            in: publicationIds,
          },
        },
        data: { current_transaction_status_id: Number(newStatusId) },
      }),
      // Catat aktivitas untuk keperluan log
      prisma.transactionLog.create({
        data: {
          transaction_id: Number(id),
          user_id: Number(session.user_id),
          transaction_status_id: Number(newStatusId),
          note: note,
        },
      }),
    ]);

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
