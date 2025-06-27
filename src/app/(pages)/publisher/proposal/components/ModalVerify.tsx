"use client";
import React, { useState, useEffect } from "react";
import { Pencil, CircleAlert, Clipboard } from "lucide-react";
import StatusType from "@/types/statusTypes";
import { handlePasteText } from "@/utils/handlePaste";
import ErrorValidation from "@/components/form/ErrorValidation";
import Swal from "sweetalert2";
type ModalStatusProps = {
  proposal: {
    id: number;
    current_status_id: number;
    status: { status_name: string };
    publication_document: string;
  } | null;
};

const ModalVerifyStatus: React.FC<ModalStatusProps> = ({ proposal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusList, setStatusList] = useState<StatusType[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [note, setNote] = useState<string>("");
  const [supportingUrl, setSupportingUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await fetch("/api/v1/publisher/status");
        const result = await response.json();
        if (result.status === "success" && Array.isArray(result.data)) {
          setStatusList(result.data);
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };
    getStatus();
  }, []);

  useEffect(() => {
    if (proposal) {
      setCurrentStatus(
        proposal.status?.status_name || "Status Tidak Diketahui"
      );
      setSelectedStatus(null);
      setNote("");
      setSupportingUrl("");
    }
  }, [proposal, isOpen]);
  const handlePaste = async () => {
    const url = await handlePasteText();
    if (url) setSupportingUrl(url);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedStatus) {
      setError(null);
      setTimeout(() => {
        setError("Status verifikasi wajib dipilih");
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
      const res = await fetch(`/api/v1/publisher/status/${proposal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newStatusId: selectedStatus,
          note,
          supportingUrl,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Status ajuan penerbitan berhasil diperbarui.",
          confirmButtonColor: "#3085d6",
        });
        setIsOpen(false);
        window.location.reload();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal memperbarui: " + result.message,
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
        className="bg-yellow-100 p-2 rounded-lg text-yellow-700 hover:text-yellow-800 flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Pencil className="w-5 h-5" />
        Verifikasi{" "}
      </button>

      {isOpen && proposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8"> */}
          <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-4">
              Verifikasi Ajuan Penerbitan
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                {error && <ErrorValidation message={error} duration={3000} />}

                <label className="block font-medium text-black pb-1">
                  Status Sekarang
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-400 p-3 rounded-xl text-black text-center"
                  value={currentStatus}
                  disabled
                />
              </div>
               <div className="mb-3">
                <label className="block font-medium text-black pb-1">
                  URL Draf Buku
                </label>
                {proposal.publication_document ? (
                  <div className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg"> 
                      <a href={proposal.publication_document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline break-all text-sm transition-colors duration-200 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="truncate">{proposal.publication_document}</span>
                      </a>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Belum ada dokumen</p>
                )}
              </div>
              <div className="mb-3">
                <label className="block font-medium text-black pb-1">
                  Verifikasi <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-2">
                  {statusList.map((status) => (
                    <label
                      key={status.id}
                      className={`flex items-center justify-between border p-3
                        rounded-xl cursor-pointer transition-all duration-200
                        ${
                          selectedStatus === status.id
                            ? "bg-blue-100 border-blue-500 shadow-sm"
                            : "bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="status"
                          value={status.id}
                          checked={selectedStatus === status.id}
                          onChange={() => setSelectedStatus(status.id)}
                          className="form-radio text-blue-600"
                        />
                        <span className="text-black">{status.status_name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-1">
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
              <div className="mb-5">
                <label className="block font-medium text-black pb-1">
                  Link URL Pendukung
                </label>
                <div className="relative">
                  <input
                    type="url"
                    className="w-full border border-gray-400 p-3 rounded-xl text-black pr-12"
                    placeholder="Masukkan URL Pendukung"
                    value={supportingUrl}
                    onChange={(e) => setSupportingUrl(e.target.value)}
                    onBlur={() => {
                      if (
                        supportingUrl &&
                        !supportingUrl.startsWith("http://") &&
                        !supportingUrl.startsWith("https://")
                      ) {
                        setSupportingUrl(`https://${supportingUrl}`);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 border border-gray-400 bg-gray-100 p-2 rounded-lg hover:bg-gray-200 hover:border-black"
                    onClick={handlePaste}
                  >
                    <Clipboard className="h-5 w-5 text-black" />
                  </button>
                </div>
                <label className="pt-1 block text-sm font-normal text-gray-600 pb-1">
                  <CircleAlert className="inline pr-1" />
                  Isi Bila Diperlukan (Opsional)
                </label>
              </div>
              <div className="flex items-center gap-2">
                {/* <button
                  type="submit"
                  className="bg-primary font-semibold px-3 py-2 rounded-lg text-white"
                >
                  Simpan
                </button> */}
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

export default ModalVerifyStatus;
