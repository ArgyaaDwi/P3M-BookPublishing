import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { major_name, major_description } = await req.json();
  const majorID = parseInt(id);
  if (isNaN(majorID)) {
    return NextResponse.json(
      { status: "error", message: "Invalid major ID" },
      { status: 400 }
    );
  }
  try {
    const updatedMajor = await prisma.major.update({
      where: { id: majorID },
      data: {
        major_name: major_name,
        major_description: major_description || null,
      },
    });
    return NextResponse.json({
      status: "success",
      message: "Major updated successfully",
      data: updatedMajor,
    });
  } catch (error) {
    let errorMessage = "Failed to update major";
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    return NextResponse.json(
      {
        status: "error",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { status: "error", message: "ID is required" },
        { status: 400 }
      );
    }
    await prisma.major.update({
      where: { id: Number(id) },
      data: { deleted: true },
    });
    return NextResponse.json({
      status: "success",
      message: "Major deleted (soft delete) successfully",
    });
  } catch (error) {
    console.error("Error deleting major:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete major" },
      { status: 500 }
    );
  }
}
