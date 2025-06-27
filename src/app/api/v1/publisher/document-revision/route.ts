import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { IncomingForm } from "formidable";
import type { IncomingMessage } from "http";
import { Readable } from "stream";
import { getSession } from "@/lib/session";

function readableStreamToAsyncIterable(
  stream: ReadableStream<Uint8Array>
): AsyncIterable<Uint8Array> {
  const reader = stream.getReader();
  return {
    async *[Symbol.asyncIterator]() {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) yield value;
        }
      } finally {
        reader.releaseLock();
      }
    },
  };
}

function convertNextRequestToNodeRequest(req: NextRequest): IncomingMessage {
  const asyncIterable = readableStreamToAsyncIterable(
    req.body as ReadableStream<Uint8Array>
  );
  const bodyStream = Readable.from(asyncIterable);

  Object.assign(bodyStream, {
    headers: Object.fromEntries(req.headers),
    method: req.method,
    url: req.nextUrl.pathname,
  });

  return bodyStream as IncomingMessage;
}

interface UploadFields {
  itemId?: string;
  is_cover_revision?: string;
  is_proof_revision?: string;
  revision_note?: string;
}

interface UploadFiles {
  cover?: { filepath: string }[];
  proof?: { filepath: string }[];
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const uploadTmpDir = path.join(process.cwd(), "public/uploads/tmp");
    const coverDir = path.join(process.cwd(), "public/uploads/cover");
    const proofDir = path.join(process.cwd(), "public/uploads/proof");
    const session = await getSession();

    if (!session || !session.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    [uploadTmpDir, coverDir, proofDir].forEach((dir) => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
      multiples: false,
    });

    form.on("fileBegin", (formName, file) => {
      file.filepath = path.join(
        uploadTmpDir,
        file.originalFilename || Date.now().toString()
      );
    });

    const nodeReq = convertNextRequestToNodeRequest(req);

    const data = await new Promise<{
      fields: UploadFields;
      files: UploadFiles;
    }>((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const { itemId, is_cover_revision, is_proof_revision, revision_note } =
      data.fields;
    const cover = data.files.cover?.[0];
    const proof = data.files.proof?.[0];

    if (!itemId) {
      return NextResponse.json(
        { status: "error", message: "Item ID wajib diisi." },
        { status: 400 }
      );
    }

    const transactionItem = await prisma.transactionItem.findUnique({
      where: { id: parseInt(itemId) },
    });

    if (!transactionItem) {
      return NextResponse.json(
        { status: "error", message: "Item tidak ditemukan." },
        { status: 404 }
      );
    }

    const publicationId = transactionItem.publication_id;
    const updateData: Partial<{
      publication_book_cover: string;
      publication_authenticity_proof: string;
    }> = {};

    if (cover) {
      const coverFilename = path.basename(cover.filepath);
      const finalPath = path.join(coverDir, coverFilename);
      fs.renameSync(cover.filepath, finalPath);
      updateData.publication_book_cover = `/uploads/cover/${coverFilename}`;
    }

    if (proof) {
      const proofFilename = path.basename(proof.filepath);
      const finalPath = path.join(proofDir, proofFilename);
      fs.renameSync(proof.filepath, finalPath);
      updateData.publication_authenticity_proof = `/uploads/proof/${proofFilename}`;
    }

    await prisma.publication.update({
      where: { id: publicationId },
      data: updateData,
    });

    const revisiApa = [];
    if (is_cover_revision === "true") revisiApa.push("cover");
    if (is_proof_revision === "true") revisiApa.push("bukti keaslian");

    const catatan = `Revisi dokumen (${revisiApa.join(" dan ")}): ${
      revision_note || "-"
    }`;

    await prisma.publicationActivity.create({
      data: {
        publication_id: publicationId,
        user_id: Number(session.user_id),
        publication_status_id: 10,
        publication_notes: catatan,
        supporting_url: "",
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Revisi berhasil diunggah.",
    });
  } catch (error) {
    console.error("Revision upload error:", error);
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan saat upload revisi." },
      { status: 500 }
    );
  }
}
