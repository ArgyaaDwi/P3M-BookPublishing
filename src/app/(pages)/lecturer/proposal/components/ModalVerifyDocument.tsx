"use client";
import React, { useState, useEffect } from "react";
import { Files, CircleAlert } from "lucide-react";
import StatusType from "@/types/statusTypes";
import ErrorValidation from "@/components/form/ErrorValidation";
import Swal from "sweetalert2";
type ModalVerifyDocumentProps = {
  proposal: {
    id: number;
    current_status_id: number;
    status: { status_name: string };
  } | null;
};

const ModalVerifyDocument: React.FC<ModalVerifyDocumentProps> = ({
  proposal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [statusList, setStatusList] = useState<StatusType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [note, setNote] = useState<string>("");
  const [supportingUrl, setSupportingUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await fetch(
          "/api/v1/lecturer/proposals/status-document"
        );
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
      setSelectedStatus(null);
      setNote("");
      setSupportingUrl("");
    }
  }, [proposal, isOpen]);

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
      const res = await fetch(
        `/api/v1/lecturer/proposals/verify-document/${proposal.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newStatusId: selectedStatus,
            note,
            supportingUrl,
          }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Berhasil verifikasi berkas.",
          confirmButtonColor: "#3085d6",
        });
        setIsOpen(false);
        window.location.reload();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal verifikasi berkas: " + result.message,
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
        <Files className="w-5 h-5" />
        Verifikasi Dokumen
      </button>
      {isOpen && proposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-4">
              Verifikasi Dokumen
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                {error && <ErrorValidation message={error} duration={3000} />}
                <label className="block  font-medium text-black pb-1">
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
                <label className="block text-sm font-medium text-black pb-1">
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

export default ModalVerifyDocument;
