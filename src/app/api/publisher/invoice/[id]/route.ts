import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || !session.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user_id);
    const id = Number(params.id);

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        user_id: userId,
        deleted: false,
      },
      include: {
        status: true,
        user: {
          select: { name: true, email: true },
        },
        items: {
          include: {
            publication: {
              select: {
                publication_title: true,
                user_id: true,
                publication_book_cover: true,
                publication_authenticity_proof: true,
                current_status_id: true,
                lecturer: {
                  select: {
                    name: true,
                    nidn: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
      message: "Invoice detail fetched successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error fetching invoice detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice detail" },
      { status: 500 }
    );
  }
}
