// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// // API GET Handler Untuk Menampilkan Log Pengiriman
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { transactionId: string } }
// ) {
//   try {
//     const transactionId = parseInt(params.transactionId, 10);
//     if (isNaN(transactionId)) {
//       return NextResponse.json(
//         { status: "error", message: "Invalid Transaction ID" },
//         { status: 400 }
//       );
//     }
//     const shipments = await prisma.shipment.findMany({
//       where: { transaction_id: transactionId, deleted: false },
//       select: {
//         id: true,
//       },
//     });
//     const shipmentIds = shipments.map((s) => s.id);

//     if (shipmentIds.length === 0) {
//       return NextResponse.json(
//         { status: "success", data: [] },
//         { status: 200 }
//       );
//     }
//     const activities = await prisma.shipmentLog.findMany({
//       where: {
//         shipment_id: { in: shipmentIds },
//         deleted: false,
//       },
//       select: {
//         id: true,
//         note: true,
//         status: true,
//         user: {
//           select: {
//             name: true,
//           },
//         },
//         createdAt: true,
//       },
//       orderBy: { createdAt: "asc" },
//     });

//     return NextResponse.json(
//       { status: "success", data: activities },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching shipment activities:", error);
//     return NextResponse.json(
//       { status: "error", message: "Failed to fetch activities" },
//       { status: 500 }
//     );
//   }
// }
