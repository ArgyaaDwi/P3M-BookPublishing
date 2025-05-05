import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { transaction_id, trackingNumber, costShipment, note, shippingDate } =
      body;
    if (
      !transaction_id ||
      !trackingNumber ||
      !costShipment ||
      !note ||
      !shippingDate
    ) {
      return NextResponse.json({ error: "Incomplete data" }, { status: 400 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transaction_id },
      include: { shipment: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    if (transaction.shipment) {
      return NextResponse.json(
        { error: "Shipment already exists for this transaction" },
        { status: 400 }
      );
    }
    const userId = Number(session.user_id);

    const shipment = await prisma.shipment.create({
      data: {
        transaction_id: transaction_id,
        user_id: userId,
        tracking_number: trackingNumber,
        shipping_cost: costShipment,
        shipping_note: note,
        shipped_at: new Date(shippingDate),
        status: "SHIPPED",
      },
    });
    await prisma.shipmentLog.create({
      data: {
        shipment_id: shipment.id,
        user_id: userId,
        status: "SHIPPED",
        note: "Shipment created",
      },
    });

    await prisma.transaction.update({
      where: { id: transaction_id },
      data: { is_shipped: true },
    });

    return NextResponse.json({
      status: "success",
      message: "Shipment created",
      data: shipment,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create shipment" },
      { status: 500 }
    );
  }
}
