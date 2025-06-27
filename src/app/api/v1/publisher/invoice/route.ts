import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

// GET /api/publisher/proposals handler untuk menampilkan daftar invoice dari penerbit yang sedang login
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    console.log("Fetching invoice with status:", status);
    const session = await getSession();
    if (!session || !session.user_id) {
      console.log("Session tidak valid");
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }
    const publisherId = Number(session.user_id);
    console.log("Publisher ID:", publisherId);
    let invoices;
    if (status === "success") {
      invoices = await prisma.transaction.findMany({
        where: {
          user_id: publisherId,
          current_status_id: 2,
          deleted: false,
        },
        include: {
          user: true,
          status: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (status === "waiting") {
      invoices = await prisma.transaction.findMany({
        where: {
          user_id: publisherId,
          current_status_id: 3,
          deleted: false,
        },
        include: {
          user: true,
          status: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (status === "pending") {
      invoices = await prisma.transaction.findMany({
        where: {
          user_id: publisherId,
          current_status_id: 1,
          deleted: false,
        },
        include: {
          user: true,
          status: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      invoices = await prisma.transaction.findMany({
        where: {
          user_id: publisherId,
          deleted: false,
        },
        include: {
          status: true,
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    const serializzedInvoices = invoices.map((invoice) => ({
      ...invoice,
      user: {
        name: invoice.user?.name || null,
      },
    }));
    console.log("Invoices:", serializzedInvoices);
    return NextResponse.json({
      status: "success",
      message: "Invoices fetched successfully",
      data: serializzedInvoices,
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Error fetching invoices" },
      { status: 500 }
    );
  }
}
