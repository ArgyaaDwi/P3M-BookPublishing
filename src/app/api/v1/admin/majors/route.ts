import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const majors = await prisma.major.findMany({
      select: { id: true, major_name: true, createdAt: true },
      where: { deleted: false },
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

export async function POST(req: Request) {
  try {
    const { major_name, major_description } = await req.json();
    if (!major_name) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const existingMajor = await prisma.major.findUnique({
      where: {
        major_name,
      },
    });
    if (existingMajor) {
      return NextResponse.json(
        { error: "Major already exists" },
        { status: 400 }
      );
    }
    const newMajor = await prisma.major.create({
      data: {
        major_name: major_name,
        major_description: major_description || null,
      },
    });
    console.log("Major created successfully:", newMajor);
    return NextResponse.json(
      {
        status: "success",
        message: "Major created successfully",
        data: newMajor,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating major:", error);
    return NextResponse.json(
      { error: "Failed to create major" },
      { status: 500 }
    );
  }
}
