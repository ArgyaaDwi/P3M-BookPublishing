import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Sesuaikan dengan lokasi prisma instance

export async function GET(
  request: NextRequest,
  { params }: { params: { publicationId: string } }
) {
  try {
    const publicationId = parseInt(params.publicationId, 10);
    if (isNaN(publicationId)) {
      return NextResponse.json(
        { status: "error", message: "Invalid Publication ID" },
        { status: 400 }
      );
    }

    const activities = await prisma.publicationActivity.findMany({
      where: { publication_id: publicationId, deleted: false },
      select: {
        id: true,
        publication_status_id: true,
        publication_notes: true,
        supporting_url: true,
        createdAt: true,
        user: {
          select: {
            name: true, 
          },
        },
        status: {
          select: {
            status_name: true, 
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(
      { status: "success", data: activities },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching publication activities:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
