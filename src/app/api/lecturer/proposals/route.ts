import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { uuid } from "uuidv4";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    console.log("Menerima request POST ke /api/lecturer/proposals");
    const session = await getSession();
    console.log("Session Data:", session);
    if (!session || !session.user_id) {
      console.log("Session tidak valid");
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }
    const requestBody = await req.json();
    console.log("Request Body:", requestBody);
    const { publication_title } = requestBody;
    if (!publication_title) {
      return NextResponse.json(
        { error: "Publication title is required" },
        { status: 400 }
      );
    }
    const userId = Number(session.user_id);
    console.log("User ID:", userId);
    const publication_ticket = uuid();
    const current_status_id = 1;
    const newProposal = await prisma.publication.create({
      data: {
        user_id: userId,
        publication_ticket: publication_ticket,
        publication_title: publication_title,
        publication_document: "coba tes dulu",
        current_status_id: current_status_id,
      },
    });
    await prisma.publicationActivity.create({
      data: {
        publication_id: newProposal.id,
        user_id: userId,
        publication_status_id: current_status_id,
        publication_notes: "Proposal created",
      },
    });
    console.log("Proposal created successfully:", newProposal);
    return NextResponse.json({
      status: "success",
      message: "Proposal created successfully",
      data: newProposal,
    });
  } catch (error) {
    console.error("Error creating proposal:", error);
    return NextResponse.json(
      { error: "Failed to create proposal" },
      { status: 500 }
    );
  }
}
