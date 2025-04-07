import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    console.log("Fetching invoice with status:", status);

    let invoices;
    if (status === "success") {
      invoices = await prisma.transaction.findMany({
        where: {
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
    } else {
      invoices = await prisma.transaction.findMany({
        where: {
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
