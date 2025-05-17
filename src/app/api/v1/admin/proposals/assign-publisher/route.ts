import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user_id) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }
    const userId = Number(session.user_id);
    const { proposalId, publisherId, note, supportingUrl } = await req.json();
    if (!proposalId || !publisherId) {
      return NextResponse.json(
        { status: "error", message: "proposalId dan publisherId wajib diisi" },
        { status: 400 }
      );
    }
    const updatedProposal = await prisma.publication.update({
      where: { id: proposalId },
      data: {
        publisher_id: publisherId,
        current_status_id: 5,
      },
    });
    await prisma.publicationActivity.create({
      data: {
        publication_id: proposalId,
        user_id: userId,
        publication_status_id: 5,
        publication_notes: note || null,
        supporting_url: supportingUrl || null,
      },
    });
    return NextResponse.json({
      status: "success",
      message: "Berhasil Assign Proposal",
      data: updatedProposal,
    });
  } catch (error) {
    console.error("Error updating proposal:", error);
    return NextResponse.json(
      { status: "error", message: "Gagal Assign Proposal" },
      { status: 500 }
    );
  }
}
