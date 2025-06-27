import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { sendEmail } from "@/lib/sendEmail";
import { formatDate } from "@/utils/dateFormatter";
// PUT /api/publisher/status/:id handler untuk upload file
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { coverBookUrl, note, proofUrl } = await req.json();
    console.log("Updating proposal ID:", id);
    const session = await getSession();
    if (!session || !session.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const proposal = await prisma.publication.findUnique({
      where: { id: Number(id) },
    });
    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal tidak ditemukan" },
        { status: 404 }
      );
    }
    await prisma.publication.update({
      where: { id: Number(id) },
      data: {
        current_status_id: 10,
        publication_book_cover: coverBookUrl,
        publication_authenticity_proof: proofUrl,
      },
    });
    const activity = await prisma.publicationActivity.create({
      data: {
        publication_id: Number(id),
        user_id: Number(session.user_id),
        publication_status_id: 10,
        publication_notes: note || "Cover dan Bukti Keaslian telah diupload",
      },
    });
    const updatedProposal = await prisma.publication.findUnique({
      where: { id: Number(id) },
      include: {
        status: true,
        publisher: true,
      },
    });
    const lecturer = await prisma.user.findUnique({
      where: { id: updatedProposal?.user_id },
    });

    if (lecturer?.email && updatedProposal) {
      await sendEmail({
        to: lecturer.email,
        subject: "Status Proposal Anda Telah Diperbarui",
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333; border: 1px solid #ddd;">
      <div style="padding-bottom: 20px; margin-bottom: 20px;">
        <h2 style="color: #2563eb; margin: 0;">P3M PENS</h2>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Pemberitahuan Status Penerbitan Buku</p>
      </div>
      
      <p style="margin-bottom: 20px; color:#000">Halo <strong>${
        lecturer.name
      }</strong>,</p>
      <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0; color:#000">Proposal Anda dengan judul:</p>
        <p style="font-weight: bold; margin: 0 0 15px 0; color:#000">${
          updatedProposal.publication_title
        }</p>
         <p style="margin: 0; color:#000;">Status telah diperbarui menjadi: <strong>${
           updatedProposal.status?.status_name || "Status tidak diketahui"
         }</strong> oleh ${
          updatedProposal.publisher ? ` ${updatedProposal.publisher.name}` : ""
        }</p>
      </div>
      ${
        note
          ? `
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
        <p style="margin: 0 0 5px 0; font-weight: bold; color: #92400e;">Catatan:</p>
        <p style="margin: 0; color: #92400e;">${note}</p>
      </div>
      `
          : ""
      }
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #666; font-size: 14px;">${formatDate(
          activity.createdAt
        )}</p>
        <p style="margin: 15px 0 5px 0;">Salam,</p>
        <p style="margin: 0; font-weight: bold; color: #2563eb;">Tim P3M PENS</p>
      </div>
    </div>
    `,
      });
    }
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
