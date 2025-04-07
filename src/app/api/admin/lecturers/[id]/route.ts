import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET Handler untuk mengambil dosen berdasarkan ID
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json(
        { status: "error", message: "Invalid lecturer ID" },
        { status: 400 }
      );
    }
    const lecturer = await prisma.user.findUnique({
      where: { id: parsedId },
      select: {
        id: true,
        name: true,
        email: true,
        nidn: true,
        phone_number: true,
        address: true,
        major: { select: { major_name: true } },
        createdAt: true,
      },
    });

    if (!lecturer) {
      return NextResponse.json(
        { status: "error", message: "Lecturer not found" },
        { status: 404 }
      );
    }

    const lecturerWithStringPhone = {
      ...lecturer,
      phone_number: lecturer.phone_number?.toString() ?? null,
    };

    return NextResponse.json({
      status: "success",
      data: lecturerWithStringPhone,
    });
  } catch (error) {
    console.error("Error fetching lecturer:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch lecturer" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { name, email, major, address, phone_number } = await req.json();
  const lecturerId = parseInt(id);
  if (isNaN(lecturerId)) {
    return NextResponse.json(
      { status: "error", message: "Invalid publisher ID" },
      { status: 400 }
    );
  }

  let phoneNumberBigInt: bigint | null = null;
  if (phone_number) {
    if (!isNaN(Number(phone_number))) {
      try {
        phoneNumberBigInt = BigInt(phone_number);
      } catch {
        return NextResponse.json(
          { status: "error", message: "Invalid phone number format " },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { status: "error", message: "Phone number must be numeric" },
        { status: 400 }
      );
    }
  }

  try {
    const updatedLecturer = await prisma.user.update({
      where: { id: lecturerId },
      data: {
        name,
        email,
        major: major ? { connect: { major_name: major } } : undefined,
        address,
        phone_number: phoneNumberBigInt,
      },
    });
    return NextResponse.json({
      status: "success",
      message: "lecturer updated successfully",
      data: {
        ...updatedLecturer,
        phone_number: updatedLecturer.phone_number
          ? updatedLecturer.phone_number.toString()
          : null,
      },
    });
  } catch (error) {
    let errorMessage = "Failed to update lecturer";
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
// DELETE Handler untuk menghapus dosen (soft delete)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { status: "error", message: "ID is required" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: Number(id) },
      data: { deleted: true },
    });

    return NextResponse.json({
      status: "success",
      message: "User deleted (soft delete) successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
