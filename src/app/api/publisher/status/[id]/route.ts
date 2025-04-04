import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

// PUT /api/publisher/status/:id handler untuk memperbarui status dari suatu proposal
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { newStatusId, note, supportingUrl } = await req.json();
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
    await prisma.publication.update({
      where: { id: Number(id) },
      data: { current_status_id: Number(newStatusId) },
    });
    // Catat aktivitas untuk keperluan log
    await prisma.publicationActivity.create({
      data: {
        publication_id: Number(id),
        user_id: Number(session.user_id),
        publication_status_id: Number(newStatusId),
        publication_notes: note,
        supporting_url: supportingUrl,
      },
    });
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
