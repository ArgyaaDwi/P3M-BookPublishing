import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET Handler untuk menampilkan daftar dosen
export async function GET() {
  try {
    const lecturers = await prisma.user.findMany({
      where: { role: "DOSEN", deleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        nidn: true,
        phone_number: true,
        major: { select: { major_name: true } },
        createdAt: true,
      },
    });
    const lecturersWithStringPhone = lecturers.map((lecturer) => ({
      ...lecturer,
      phone_number: lecturer.phone_number
        ? lecturer.phone_number.toString()
        : null,
    }));

    console.log("Successfully fetched lecturers:", lecturersWithStringPhone);
    return NextResponse.json({
      status: "success",
      data: lecturersWithStringPhone,
    });
  } catch (error) {
    console.error("Error fetching lecturers:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch lecturers" },
      { status: 500 }
    );
  }
}

// POST Handler untuk membuat akun dosen
export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      password,
      major,
      role = "DOSEN",
      nidn,
    } = await req.json();
    if (!name || !email || !password || !major) {
      return NextResponse.json(
        { status: "error", message: "All fields are required" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newLecturer = await prisma.user.create({
      data: {
        name,
        email,
        nidn,
        password: hashedPassword,
        major: major ? { connect: { major_name: major } } : undefined,
        role,
      },
    });
    console.log("Lecturer created successfully:", newLecturer);
    return NextResponse.json({
      status: "success",
      message: "Lecturer created successfully",
      data: newLecturer,
    });
  } catch (error) {
    console.error("Error creating lecturer:", error);
    return NextResponse.json(
      { error: "Failed to create lecturer" },
      { status: 500 }
    );
  }
}
