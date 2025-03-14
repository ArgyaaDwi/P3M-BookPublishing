import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";


// GET Handler untuk menampilkan daftar penerbit
export async function GET() {
  try {
    const publishers = await prisma.user.findMany({
      where: { role: "PENERBIT", deleted: false },
      select: {
        id: true,
        name: true,  
        email: true,
        phone_number: true,
        createdAt: true,
      },
    });
    const publishersWithStringPhone = publishers.map((publisher) => ({
      ...publisher,
      phone_number: publisher.phone_number
        ? publisher.phone_number.toString()
        : null,
    }));

    console.log("Successfully fetched publishers:", publishersWithStringPhone);
    return NextResponse.json({
      status: "success",
      data: publishersWithStringPhone,
    });
  } catch (error) {
    console.error("Error fetching publishers:", error);
    return NextResponse.json(
      { error: "Failed to fetch publishers" },
      { status: 500 }
    );
  }
}

// POST Handler untuk membuat akun penerbit
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newPublisher = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "PENERBIT",
      },
    });
    console.log("Publisher created successfully:", newPublisher);
    return NextResponse.json({
      status: "success",
      message: "Publisher created successfully",
      data: newPublisher,
    });
  } catch (error) {
    console.error("Error creating publisher:", error);
    return NextResponse.json(
      { error: "Failed to create publisher" },
      { status: 500 }
    );
  }
}
