import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT /api/v1/publisher/proposals/upload-final/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const publicationId = parseInt(id);
  if (isNaN(publicationId)) {
    return NextResponse.json(
      { status: "error", message: "ID tidak valid" },
      { status: 400 }
    );
  }
  try {
    const { finalBookUrl } = await req.json();
    if (!finalBookUrl || typeof finalBookUrl !== "string") {
      return NextResponse.json(
        { status: "error", message: "URL final buku wajib diisi" },
        { status: 400 }
      );
    }
    const updated = await prisma.publication.update({
      where: { id: publicationId },
      data: {
        publication_final_book: finalBookUrl,
      },
    });
    return NextResponse.json({
      status: "success",
      message: "Final book berhasil disimpan",
      data: updated,
    });
  } catch (error) {
    console.error("Error saving final book:", error);
    return NextResponse.json(
      { status: "error", message: "Gagal menyimpan final book" },
      { status: 500 }
    );
  }
}
