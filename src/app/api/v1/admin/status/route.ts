import { NextResponse } from "next/server";
import prisma  from "@/lib/prisma";

export async function GET() {
  try {
    const status = await prisma.publicationStatus.findMany({
      select: { status_name: true, id: true },
      where: {
        id: { in: [2, 3] },
      },
    });
    console.log("Successfully fetched status:", status);
    return NextResponse.json(
      {
        status: "success",
        data: status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching status:", error);
    let errorMessage = "Failed to fetch status";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch status",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
