import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

// PUT /api/publisher/status/:id handler untuk upload file
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { coverBookUrl, note, proofUrl } = await req.json();
    console.log("Updating proposal ID:", id);
    const session = await getSession();
    if (!session || !session.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const proposal = await prisma.publication.findUnique({
      where: { id: Number(id) },
    });
    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal tidak ditemukan" },
        { status: 404 }
      );
    }
    await Promise.all([
      prisma.publication.update({
        where: { id: Number(id) },
        data: {
          current_status_id: 10,
          publication_book_cover: coverBookUrl,
          publication_authenticity_proof: proofUrl,
        },
      }),
      prisma.publicationActivity.create({
        data: {
          publication_id: Number(id),
          user_id: Number(session.user_id),
          publication_status_id: 10,
          publication_notes: note,
        },
      }),
    ]);
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
