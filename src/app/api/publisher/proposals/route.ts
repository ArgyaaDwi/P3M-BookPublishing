import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

// GET /api/publisher/proposals handler untuk menampilkan daftar proposal dari penerbit yang sedang login
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
    const publisherId = Number(session.user_id);
    console.log("Publisher ID:", publisherId);
    let proposals;
    if (status === "revision") {
      proposals = await prisma.publication.findMany({
        where: {
          publisher_id: publisherId,
          current_status_id: 6,
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
          publisher_id: publisherId,
          current_status_id: 7,
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
    } else if (status === "verify") {
      proposals = await prisma.publication.findMany({
        where: {
          publisher_id: publisherId,
          current_status_id: {
            in: [5, 9]
          },
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
          publisher_id: publisherId,
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
      lecturer: {
        name: proposal.lecturer?.name || null,
      },
      publisher: proposal.publisher?.name || null,
    }));
    console.log("Proposals:", serializzedProposals);
    return NextResponse.json({
      status: "success",
      message: "Proposals fetched successfully",
      data: serializzedProposals,
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json(
      { error: "Error fetching proposals" },
      { status: 500 }
    );
  }
}
