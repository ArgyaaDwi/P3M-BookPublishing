"use client";
import React, { useState, useEffect } from "react";
import { Files, Clipboard, CircleAlert } from "lucide-react";
import { handlePasteText } from "@/utils/handlePaste";
import ErrorValidation from "@/components/form/ErrorValidation";
import Swal from "sweetalert2";
import UploadCoverCloudinaryOptional from "./UploadCoverCloudinaryOptional";
type ModalRevisionDocumentProps = {
  proposal: {
    id: number;
    current_status_id: number;
    status: { status_name: string };
    publication_book_cover: string | null;
    publication_authenticity_proof: string | null;
  } | null;
};

const ModalRevisionDocument: React.FC<ModalRevisionDocumentProps> = ({
  proposal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverBookUrl, setCoverBookUrl] = useState<string>("");
  const [proofUrl, setProofUrl] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // useEffect(() => {
  //   if (proposal) {
  //     setCoverBookUrl(proposal.publication_book_cover || "");
  //     setProofUrl(proposal.publication_authenticity_proof || "");
  //     setNote("");
  //   }
  // }, [proposal]);
  useEffect(() => {
    if (proposal) {
      setCoverBookUrl((prev) =>
        prev ? prev : proposal.publication_book_cover || ""
      );
      setProofUrl((prev) =>
        prev ? prev : proposal.publication_authenticity_proof || ""
      );
      setNote("");
    }
  }, [proposal]);

  // const handlePasteCover = async () => {
  //   const url = await handlePasteText();
  //   if (url) setCoverBookUrl(url);
  // };
  const handlePasteProof = async () => {
    const url = await handlePasteText();
    if (url) setProofUrl(url);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!coverBookUrl) {
      setError(null);
      setTimeout(() => {
        setError("Cover buku wajib diisi");
      }, 10);
      return;
    }
    if (!proofUrl) {
      setError(null);
      setTimeout(() => {
        setError("Bukti keaslian buku wajib diisi");
      }, 10);
      return;
    }
    if (!proposal) {
      setError(null);
      setTimeout(() => {
        setError("Proposal tidak ditemukan");
      }, 10);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/v1/publisher/proposals/upload-files/${proposal.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            note,
            coverBookUrl,
            proofUrl,
          }),
        }
      );

      const result = await res.json();
      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Berhasil revisi berkas!",
          confirmButtonColor: "#3085d6",
        });
        console.log("Final Cover to Submit:", coverBookUrl);
        setIsOpen(false);
        window.location.reload();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal revisi berkas: " + result.message,
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <button
        className="bg-yellow-100 p-2 rounded-lg text-yellow-600 hover:text-yellow-800 flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Files className="w-5 h-5" />
        Revisi Dokumen
      </button>
      {isOpen && proposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8"> */}
          <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-4">
              Revisi Dokumen
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                {error && <ErrorValidation message={error} duration={3000} />}
                {/* <label className="block font-medium text-black pb-1">
                  Link URL Cover Buku <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    className="w-full border border-gray-400 p-3 rounded-xl text-black pr-12"
                    placeholder="Masukkan URL Link Cover Buku"
                    value={coverBookUrl}
                    onChange={(e) => setCoverBookUrl(e.target.value)}
                    onBlur={() => {
                      if (
                        coverBookUrl &&
                        !coverBookUrl.startsWith("http://") &&
                        !coverBookUrl.startsWith("https://")
                      ) {
                        setCoverBookUrl(`https://${coverBookUrl}`);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 border border-gray-400 bg-gray-100 p-2 rounded-lg hover:bg-gray-200 hover:border-black"
                    onClick={handlePasteCover}
                  >
                    <Clipboard className="h-5 w-5 text-black" />
                  </button>
                </div> */}
                {coverBookUrl && (
                  <div className="mb-3">
                    <label className="block font-medium text-black pb-1">
                      Cover Buku Sebelumnya
                    </label>
                    <div className="w-[150px] h-auto rounded-lg overflow-hidden border mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverBookUrl}
                        alt="Cover Lama"
                        className="w-full object-cover"
                      />
                    </div>
                    <UploadCoverCloudinaryOptional
                      onUpload={(url) => {
                        console.log("coverBookUrl", url);
                        setCoverBookUrl(url);
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="block font-medium text-black pb-1">
                  Link URL Bukti Keaslian{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    className="w-full border border-gray-400 p-3 rounded-xl text-black pr-12"
                    placeholder="Masukkan URL Link Bukti Keaslian Buku"
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    onBlur={() => {
                      if (
                        proofUrl &&
                        !proofUrl.startsWith("http://") &&
                        !proofUrl.startsWith("https://")
                      ) {
                        setProofUrl(`https://${proofUrl}`);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 border border-gray-400 bg-gray-100 p-2 rounded-lg hover:bg-gray-200 hover:border-black"
                    onClick={handlePasteProof}
                  >
                    <Clipboard className="h-5 w-5 text-black" />
                  </button>
                </div>
              </div>
              <div className="mb-5">
                <label className="block font-medium text-black pb-1">
                  Catatan
                </label>
                <textarea
                  className="w-full border border-gray-400 p-3 rounded-xl text-black"
                  placeholder="Masukkan Catatan Keterangan yang Diinginkan"
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
                <label className="block text-sm font-normal text-gray-600 pb-1">
                  <CircleAlert className="inline pr-1" />
                  Isi Bila Diperlukan (Opsional)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="bg-primary font-semibold px-3 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>

                <button
                  type="button"
                  className="bg-white border font-semibold border-red-600 px-3 py-2 rounded-lg text-red-600"
                  onClick={() => setIsOpen(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalRevisionDocument;
