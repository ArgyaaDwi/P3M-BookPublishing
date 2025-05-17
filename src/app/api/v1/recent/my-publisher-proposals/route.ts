import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session || !session.user_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user_id);
  const latestProposals = await prisma.publication.findMany({
    where: {
      publisher_id: userId,
      deleted: false,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      publication_title: true,
      publication_ticket: true,
      status: { select: { status_name: true } },
      lecturer: { select: { name: true, nidn: true } },
      createdAt: true,
      current_status_id: true,
    },
  });
  return NextResponse.json(latestProposals);
}
