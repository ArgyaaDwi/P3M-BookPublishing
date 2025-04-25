import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json(
        { status: "error", message: "Invalid Proposal ID" },
        { status: 400 }
      );
    }
    const proposal = await prisma.publication.findUnique({
      where: { id: parsedId },
      select: {
        id: true,
        publication_ticket: true,
        publication_title: true,
        lecturer: { select: { name: true, nidn: true } },
        publisher: { select: { name: true } },
        status: { select: { status_name: true } },
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
    console.log("Successfully fetched proposal:", proposal);
    return NextResponse.json({ status: "success", data: proposal });
  } catch (error) {
    console.error("Error fetching publisher:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch publisher" },
      { status: 500 }
    );
  }
}

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
