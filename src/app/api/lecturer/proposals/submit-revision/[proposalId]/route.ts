import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

// API Put Handler Untuk Dosen Melakukan Revisi Admin Proposal
export async function PUT(
  req: Request,
  { params }: { params: { proposalId: string } }
) {
  try {
    const proposalId = params.proposalId;
    const { notes, documentUrl } = await req.json();
    console.log("Submit revision for proposal ID:", proposalId);
    const session = await getSession();
    if (!session || !session.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const proposal = await prisma.publication.findUnique({
      where: { id: Number(proposalId) },
    });
    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal tidak ditemukan" },
        { status: 404 }
      );
    }
    await Promise.all([
      prisma.publication.update({
        where: { id: Number(proposalId) },
        data: {
          current_status_id: 4,
          publication_document: documentUrl,
        },
      }),
      prisma.publicationActivity.create({
        data: {
          publication_id: Number(proposalId),
          user_id: Number(session.user_id),
          publication_status_id: 4,
          publication_notes: notes,
          publication_document_url: documentUrl,
        },
      }),
    ]);
    return NextResponse.json({
      status: "success",
      message: "Revision submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting revision:", error);
    return NextResponse.json(
      { error: "Failed to submit revision" },
      { status: 500 }
    );
  }
}
