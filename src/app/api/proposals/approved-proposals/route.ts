import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const approvedBooks = await prisma.publication.findMany({
      select: { status: true, id: true, publication_title: true },
      where: {
        current_status_id: 7,
      },
    });
    console.log("Successfully fetched approved books:", approvedBooks);
    return NextResponse.json(
      {
        status: "success",
        data: approvedBooks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching approved books:", error);
    let errorMessage = "Failed to fetch approved books";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch approved books",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
