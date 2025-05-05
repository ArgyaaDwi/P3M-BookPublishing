import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const majors = await prisma.major.findMany({
      select: { id: true, major_name: true },
    });
    console.log("Successfully fetched majors:", majors);
    return NextResponse.json(
      {
        status: "success",
        data: majors,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching majors:", error);
    return NextResponse.json(
      { error: "Failed to fetch majors" },
      { status: 500 }
    );
  }
}
