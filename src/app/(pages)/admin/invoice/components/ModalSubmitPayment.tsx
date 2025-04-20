"use client";
import React, { useState } from "react";
import { Clipboard } from "lucide-react";
import { handlePasteText } from "@/utils/handlePaste";

type PaymentModalProps = {
  invoice: {
    id: number;
    current_status_id: number;
    status: { status_name: string };
  } | null;
};

const SubmitPaymentModal: React.FC<PaymentModalProps> = ({ invoice }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState<string>("");
  const [paymentProof, setPaymentProof] = useState<string>("");
  const handlePaste = async () => {
    const url = await handlePasteText();
    if (url) setPaymentProof(url);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;
    try {
      const res = await fetch(
        `/api/admin/invoices/submit-payment/${invoice.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newStatusId: 3,
            note,
            paymentProof,
          }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        alert("Status berhasil diperbarui!");
        setIsOpen(false);
        window.location.reload();
      } else {
        alert(`Gagal update: ${result.error || "Terjadi kesalahan"}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div>
      <button
        className="bg-teal-400 p-2 rounded-lg text-white hover:bg-teal-600 hover:text-white transition-all duration-300  flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        Upload Bukti
      </button>

      {isOpen && invoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-4">
              Upload Bukti Pembayaran
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <p className="block font-medium text-black pb-1">
                  Status Sekarang:{" "}
                  <span className="font-semibold">
                    {invoice.status.status_name}
                  </span>
                </p>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="paymentProof"
                  className="block font-medium text-black pb-1"
                >
                  Bukti Pembayaran:{" "}
                </label>
                <div className="relative">
                  <input
                    id="paymentProof"
                    type="url"
                    className="w-full border border-gray-400 p-3 rounded-xl text-black pr-12"
                    placeholder="Masukkan URL Pendukung"
                    value={paymentProof}
                    onChange={(e) => setPaymentProof(e.target.value)}
                    onBlur={() => {
                      if (
                        paymentProof &&
                        !paymentProof.startsWith("http://") &&
                        !paymentProof.startsWith("https://")
                      ) {
                        setPaymentProof(`https://${paymentProof}`);
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
              </div>
              <div className="mb-1">
                <label className="block font-medium text-black pb-1">
                  Catatan:
                </label>
                <textarea
                  className="w-full border border-gray-400 p-3 rounded-xl text-black"
                  placeholder="Masukkan Catatan Keterangan yang Diinginkan"
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="bg-primary font-semibold px-3 py-2 rounded-lg text-white"
                >
                  Simpan
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

export default SubmitPaymentModal;
