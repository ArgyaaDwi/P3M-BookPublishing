import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const latestLecturers = await prisma.user.findMany({
    where: {
      role: "DOSEN",
      deleted: false,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      phone_number: true,
      createdAt: true,
    },
  });
  return NextResponse.json(latestLecturers);
}
