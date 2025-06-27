"use client";
import React, { useState, useEffect } from "react";
import { Files, Clipboard } from "lucide-react";
import { handlePasteText } from "@/utils/handlePaste";
import ErrorValidation from "@/components/form/ErrorValidation";
import Swal from "sweetalert2";
type ModalInputFinalDocProps = {
  proposal: {
    id: number;
    current_status_id: number;
    status: { status_name: string };
  } | null;
};

const ModalInputFinalDoc: React.FC<ModalInputFinalDocProps> = ({
  proposal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalBookUrl, setFinalBookUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (proposal) {
      setFinalBookUrl("");
    }
  }, [proposal, isOpen]);
  const handlePasteCover = async () => {
    const url = await handlePasteText();
    if (url) setFinalBookUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!finalBookUrl) {
      setError(null);
      setTimeout(() => {
        setError("File final buku wajib diisi");
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
        `/api/v1/publisher/proposals/upload-final/${proposal.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            finalBookUrl,
          }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Berhasil mengupload berkas final!",
          confirmButtonColor: "#3085d6",
        });
        setIsOpen(false);
        window.location.reload();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal mengupload berkas final: " + result.message,
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
        className="bg-sky-100 p-2 rounded-lg text-sky-600 hover:text-sky-800 flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Files className="w-5 h-5" />
        Pemberkasan Dokumen Final
      </button>
      {isOpen && proposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-4">
              Input Dokumen Final Ajuan Buku
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                {error && <ErrorValidation message={error} duration={3000} />}
                <label className="block font-medium text-black pb-1">
                  Link URL Final Buku <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    className="w-full border border-gray-400 p-3 rounded-xl text-black pr-12"
                    placeholder="Masukkan URL Link Final"
                    value={finalBookUrl}
                    onChange={(e) => setFinalBookUrl(e.target.value)}
                    onBlur={() => {
                      if (
                        finalBookUrl &&
                        !finalBookUrl.startsWith("http://") &&
                        !finalBookUrl.startsWith("https://")
                      ) {
                        setFinalBookUrl(`https://${finalBookUrl}`);
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
                </div>
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

export default ModalInputFinalDoc;
