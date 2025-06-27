import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uuid } from "uuidv4";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    console.log("Fetching proposals with status:", status);
    const session = await getSession();
    if (!session || !session.user_id) {
      console.log("Session tidak valid");
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }
    const userId = Number(session.user_id);
    console.log("User ID:", userId);
    let proposals;
    if (status === "revision") {
      proposals = await prisma.publication.findMany({
        where: {
          user_id: userId,
          current_status_id: { in: [2, 6] },
          deleted: false,
        },
        include: {
          lecturer: true,
          status: true,
          publisher: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (status === "approved") {
      proposals = await prisma.publication.findMany({
        where: {
          user_id: userId,
          current_status_id: { in: [3, 7] },
          deleted: false,
        },
        include: {
          lecturer: true,
          status: true,
          publisher: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      proposals = await prisma.publication.findMany({
        where: {
          user_id: userId,
          deleted: false,
        },
        include: {
          lecturer: true,
          status: true,
          publisher: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    const serializzedProposals = proposals.map((proposal) => ({
      ...proposal,
      lecturer: proposal.lecturer.name,
      publisher: proposal.publisher?.name || null,
    }));
    return NextResponse.json({
      status: "success",
      message: "Proposals fetched successfully",
      data: serializzedProposals,
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    console.log("Menerima request POST ke /api/lecturer/proposals");
    const session = await getSession();
    console.log("Session Data:", session);
    if (!session || !session.user_id) {
      console.log("Session tidak valid");
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }
    const { publication_title, publication_document } = await req.json();

    if (!publication_title) {
      return NextResponse.json(
        { error: "Publication title is required" },
        { status: 400 }
      );
    }
    if (!publication_document) {
      return NextResponse.json(
        { error: "Document URL is required" },
        { status: 400 }
      );
    }
    const existingProposal = await prisma.publication.findFirst({
      where: {
        publication_title: publication_title,
      },
    });

    if (existingProposal) {
      return NextResponse.json(
        { error: "Proposal with this title already exists" },
        { status: 409 } 
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
        publication_document: publication_document,
        current_status_id: current_status_id,
      },
    });
    await prisma.publicationActivity.create({
      data: {
        publication_id: newProposal.id,
        user_id: userId,
        publication_status_id: current_status_id,
        publication_notes: "Proposal created",
        publication_document_url: publication_document,
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
