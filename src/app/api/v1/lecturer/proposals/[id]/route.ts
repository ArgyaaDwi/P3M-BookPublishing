import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// get Handler untuk mengambil proposal berdasarkan ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { status: "error", message: "Invalid Proposal ID" },
        { status: 400 }
      );
    }
    const proposal = await prisma.publication.findUnique({
      where: { id },
      select: {
        id: true,
        publication_ticket: true,
        publication_title: true,
        publication_book_cover: true,
        publication_authenticity_proof: true,
        publication_document: true,
        current_status_id: true,
        publication_final_book: true,
        lecturer: { select: { name: true, nidn: true } },
        publisher: { select: { name: true } },
        status: { select: { status_name: true } },
        status_transaction: { select: { status_name: true } },
        createdAt: true,
        items: {
          select: {
            id: true,
            transaction: {
              select: {
                id: true,
                current_status_id: true,
                status: {
                  select: { status_name: true },
                },
                updatedAt: true,
              },
            },
          },
        },
      },
    });
    if (!proposal) {
      return NextResponse.json(
        { status: "error", message: "Proposal not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: "success", data: proposal });
  } catch (error) {
    console.error("Error fetching publisher:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch publisher" },
      { status: 500 }
    );
  }
}

// DELETE Handler untuk menghapus proposal (soft delete)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { status: "error", message: "ID is required" },
        { status: 400 }
      );
    }
    await prisma.publication.update({
      where: { id: Number(id) },
      data: { deleted: true },
    });
    return NextResponse.json({
      status: "success",
      message: "proposal deleted (soft delete) successfully",
    });
  } catch (error) {
    console.error("Error deleting proposal:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete proposal" },
      { status: 500 }
    );
  }
}
