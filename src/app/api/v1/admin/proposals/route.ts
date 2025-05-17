import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    console.log("Fetching proposals with status:", status);
    let proposals;
    if (status === "revision") {
      proposals = await prisma.publication.findMany({
        where: { current_status_id: 2 },
        include: { lecturer: true, status: true, publisher: true },
      });
    } else if (status === "approved") {
      proposals = await prisma.publication.findMany({
        where: { current_status_id: 3 },
        include: { lecturer: true, status: true, publisher: true },
      });
    } else if (status === "verify") {
      proposals = await prisma.publication.findMany({
        where: {
          current_status_id: {
            in: [1, 4, 5],
          },
        },
        include: { lecturer: true, status: true, publisher: true },
        orderBy: { createdAt: "asc" },
      });
    } else {
      proposals = await prisma.publication.findMany({
        include: { lecturer: true, status: true, publisher: true },
        orderBy: { createdAt: "desc" },
      });
      console.log("Fetched proposals:", proposals);
    }
    const serializedProposals = proposals.map((proposal) => ({
      ...proposal,
      lecturer: {
        ...proposal.lecturer,
        phone_number: proposal.lecturer.phone_number?.toString() ?? null,
      },
      publisher: proposal.publisher
        ? {
            ...proposal.publisher,
            phone_number: proposal.publisher.phone_number?.toString() ?? null,
          }
        : null,
    }));

    return NextResponse.json({ status: "success", data: serializedProposals });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    let errorMessage = "Failed to fetch proposals";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch proposals",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
