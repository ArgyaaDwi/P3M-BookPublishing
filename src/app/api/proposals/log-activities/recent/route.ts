import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || !session.user_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = Number(session.user_id);
  const activities = await prisma.publicationActivity.findMany({
    where: { user_id: user },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      publication_notes: true,
      createdAt: true,
      publication: {
        select: {
          publication_title: true,
        },
      },
    },
  });

  return NextResponse.json(activities);
}
