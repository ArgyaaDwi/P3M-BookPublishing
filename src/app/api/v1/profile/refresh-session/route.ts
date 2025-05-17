import { NextResponse } from "next/server";
import { getSession, createSession } from "@/lib/session";
import prisma from "@/lib/prisma";
export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = await prisma.user.findUnique({
    where: { id: Number(session.user_id) },
  });

  if (!userId) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  await createSession(userId);
  return NextResponse.json({ message: "Session updated" });
}
