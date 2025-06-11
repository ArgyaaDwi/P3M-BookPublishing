import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const publisherId = parseInt(id);

  try {
    const hashed = await bcrypt.hash("123456", 10);
    await prisma.user.update({
      where: { id: publisherId },
      data: {
        password: hashed,
      },
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Gagal mereset password" },
      { status: 500 }
    );
  }
}
