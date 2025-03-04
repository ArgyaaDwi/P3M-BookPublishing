import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";
const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const publicationId = Number(id);
  if (isNaN(publicationId)) {
    return NextResponse.json(
      { error: "Invalid publication ID" },
      { status: 400 }
    );
  }
  try {
    console.log("Menerima request POST ke /api/admin/proposals");
    const session = await getSession();
    console.log("Session Data:", session);
    if (!session || !session.user_id) {
      console.log("Session tidak valid");
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }
    const userId = Number(session.user_id);
    console.log("User ID:", userId);
    const { publication_status_id, publication_notes, supporting_url } =
      await req.json();
    if (!publication_status_id) {
      return NextResponse.json(
        { error: "Status ID is required" },
        { status: 400 }
      );
    }
    const updateStatusProposal = await prisma.publication.update({
      where: { id: publicationId },
      data: {
        current_status_id: publication_status_id,
      },
    });
    await prisma.publicationActivity.create({
      data: {
        publication_id: publicationId,
        user_id: userId,
        publication_status_id,
        publication_notes: publication_notes || "",
        supporting_url: supporting_url || null,
      },
    });
    console.log("Status proposal berhasil diperbarui", updateStatusProposal);
    return NextResponse.json({
      status: "success",
      data: updateStatusProposal,
      message: "Status proposal berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating status proposal:", error);
    return NextResponse.json(
      { error: "Failed to update status proposal" },
      { status: 500 }
    );
  }
}
