"use client";
import React from "react";
import { useState } from "react";
import { InvoiceType } from "@/types/invoiceTypes";
import { formatDate } from "@/utils/dateFormatter";
import BadgeStatus from "@/components/BadgeStatus";
import { Eye } from "lucide-react";
const DetailInvoiceSection = ({ invoice }: { invoice: InvoiceType }) => {
  const [fileCover, setFileCover] = useState<File | null>(null);
  const [fileProof, setFileProof] = useState<File | null>(null);
  const handleFileChange = (
    itemId: number,
    fileType: "cover" | "proof",
    file: File | null
  ) => {
    if (fileType === "cover") {
      setFileCover(file);
    } else if (fileType === "proof") {
      setFileProof(file);
    }
  };

  const handleSubmitUpload = async (itemId: number) => {
    console.log("Upload untuk itemId:", itemId);

    if (!fileCover && !fileProof) {
      alert("Harap unggah file cover atau bukti keaslian terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("itemId", itemId.toString());
    if (fileCover) formData.append("cover", fileCover);
    if (fileProof) formData.append("proof", fileProof);

    try {
      const res = await fetch("/api/publisher/upload-documents", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.status === "success") {
        alert("File berhasil diunggah!");
      } else {
        alert("Gagal mengunggah file: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat upload.");
    }
  };
  const handleSubmitRevision = async (itemId: number) => {
    console.log("Revisi untuk itemId:", itemId);

    // Pastikan salah satu file diupload (cover atau proof)
    if (!fileCover && !fileProof) {
      alert("Harap unggah file cover atau bukti keaslian untuk direvisi.");
      return;
    }

    const formData = new FormData();
    formData.append("itemId", itemId.toString());

    // Cek apakah cover perlu direvisi
    if (fileCover) {
      formData.append("cover", fileCover);
      formData.append("is_cover_revision", "true"); // Menandakan bahwa cover diperbarui
    }

    // Cek apakah proof perlu direvisi
    if (fileProof) {
      formData.append("proof", fileProof);
      formData.append("is_proof_revision", "true"); // Menandakan bahwa proof diperbarui
    }

    // Tambahkan catatan revisi, jika ada
    const revisionNote =
      "Catatan revisi: Perbaikan berdasarkan saran reviewer.";
    formData.append("revision_note", revisionNote); // Optional, bisa dikosongkan jika tidak ada

    try {
      const res = await fetch("/api/publisher/document-revision", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.status === "success") {
        alert("Revisi berhasil diajukan!");
        // Lakukan refresh data atau tindakan lainnya setelah berhasil
      } else {
        alert("Gagal mengajukan revisi: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengajukan revisi.");
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold text-black">
          Invoice #{invoice.transaction_ticket}
        </h1>
        <p className="mb-2 text-sm text-gray-600">
          Dibuat pada: {formatDate(invoice.createdAt)}
        </p>
        <BadgeStatus
          text={invoice.status?.status_name || "Status Tidak Diketahui"}
          color={
            invoice.current_status_id === 1
              ? "badgePendingText"
              : invoice.current_status_id === 3 ||
                invoice.current_status_id === 4
              ? "badgeRevText"
              : "badgeSuccessText"
          }
          bgColor={
            invoice.current_status_id === 1
              ? "badgePending"
              : invoice.current_status_id === 3 ||
                invoice.current_status_id === 4
              ? "badgeRev"
              : "badgeSuccess"
          }
        />
        {invoice.transaction_notes && (
          <p className="my-2 text-gray-800">
            Catatan Transaksi: {invoice.transaction_notes}
          </p>
        )}
      </div>

      {invoice.payment_proof && (
        <a
          href={
            invoice.payment_proof.startsWith("http")
              ? invoice.payment_proof
              : `https://${invoice.payment_proof}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-s flex items-center gap-1"
        >
          <Eye className="w-4 h-4" />
          Bukti Pembayaran
        </a>
      )}
      <div>
        <h2 className="text-lg font-medium text-black mt-4 mb-2">
          Item Transaksi:
        </h2>
        <div className="space-y-2">
          {invoice.items.map((item, index: number) => (
            <div
              key={index}
              className="p-4 border rounded-xl bg-white shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center"
            >
              {/* kiri */}
              <div className="flex-[2] min-w-[220px]">
                <p className="text-base font-semibold text-black">
                  {item.publication.publication_title}
                </p>
                <p className="text-sm text-gray-500">
                  Dosen Penulis: {item.publication.lecturer.name} - NIDN.{" "}
                  {item.publication.lecturer.nidn}
                </p>
              </div>
              {/* kanan */}
              <div className="flex-[2] flex flex-col gap-2">
                {/* biaya */}
                <div className="flex gap-6 flex-wrap sm:flex-nowrap">
                  <p className="text-sm text-gray-600">
                    Biaya: Rp{item.cost.toLocaleString("id-ID")}
                  </p>
                  <p className="text-sm text-gray-600">
                    Jumlah: {item.quantity}
                  </p>
                  <p className="text-sm font-semibold text-black">
                    Total: Rp{item.total_cost.toLocaleString("id-ID")}
                  </p>
                </div>
                {/* dokumen */}
                {invoice.current_status_id === 2 && (
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* cover */}
                    {item.publication.publication_book_cover ? (
                      <div className="flex-1">
                        <label className="text-gray-800 block text-sm font-medium mb-1">
                          Cover Buku (Sudah Di-upload)
                        </label>
                        <a
                          href={item.publication.publication_book_cover}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-sm flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Cover Buku
                        </a>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <label className="text-gray-800 block text-sm font-medium mb-1">
                          Upload Cover Buku
                        </label>
                        <input
                          type="file"
                          onChange={(e) =>
                            handleFileChange(
                              item.id,
                              "cover",
                              e.target.files?.[0] || null
                            )
                          }
                          className="block w-full text-sm text-gray-700
        file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0
        file:bg-indigo-50 file:text-indigo-700
        hover:file:bg-indigo-100"
                        />
                      </div>
                    )}
                    {/* proof */}
                    {item.publication.publication_authenticity_proof ? (
                      <div className="flex-1">
                        <label className="text-gray-800 block text-sm font-medium mb-1">
                          Bukti Keaslian (Sudah Di-upload)
                        </label>
                        <a
                          href={item.publication.publication_authenticity_proof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-sm flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Bukti Keaslian
                        </a>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <label className="text-gray-800 block text-sm font-medium mb-1">
                          Upload Bukti Keaslian
                        </label>
                        <input
                          type="file"
                          onChange={(e) =>
                            handleFileChange(
                              item.id,
                              "proof",
                              e.target.files?.[0] || null
                            )
                          }
                          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                    )}
                  </div>
                )}
                {invoice.current_status_id === 2 &&
                  (!item.publication.publication_book_cover ||
                    !item.publication.publication_authenticity_proof) && (
                    <div className="mt-1">
                      <button
                        onClick={() => handleSubmitUpload(item.id)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
                      >
                        Simpan
                      </button>
                    </div>
                  )}
                {item.publication.current_status_id === 11 && (
                  <>
                    <p className="text-sm text-red-500 font-medium">
                      Dokumen perlu direvisi. Silakan unggah ulang.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 mt-2">
                      {/* Always show upload input even if file exists */}
                      <div className="flex-1">
                        <label className="text-gray-800 block text-sm font-medium mb-1">
                          Cover Buku (Upload Ulang jika Ada)
                        </label>
                        <input
                          type="file"
                          onChange={(e) =>
                            handleFileChange(
                              item.id,
                              "cover",
                              e.target.files?.[0] || null
                            )
                          }
                          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-gray-800 block text-sm font-medium mb-1">
                          Bukti Keaslian (Upload Ulang jika Ada)
                        </label>
                        <input
                          type="file"
                          onChange={(e) =>
                            handleFileChange(
                              item.id,
                              "proof",
                              e.target.files?.[0] || null
                            )
                          }
                          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={() => handleSubmitRevision(item.id)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
                      >
                        Simpan Revisi
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          <p className="text-lg font-semibold text-black text-right">
            Total Keseluruhan: Rp
            {invoice.items
              .reduce((acc: number, item) => acc + item.total_cost, 0)
              .toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailInvoiceSection;
