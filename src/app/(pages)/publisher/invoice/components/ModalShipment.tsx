"use client";
import React, { useState, useEffect } from "react";
import { Clipboard, Truck } from "lucide-react";
import { handlePasteText } from "@/utils/handlePaste";
import ErrorValidation from "@/components/form/ErrorValidation";
type ModalShipmentProps = {
  invoice: {
    id: number;
    current_status_id: number;
    status: { status_name: string };
  } | null;
};

const ModalShipment: React.FC<ModalShipmentProps> = ({ invoice }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [costShipment, setCostShipment] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [shippingDate, setShippingDate] = useState<string>("");
  const formatCurrency = (value: number) => {
    return value.toLocaleString("id-ID");
  };
  useEffect(() => {
    if (invoice) {
      setTrackingNumber("");
      setCostShipment(0);
      setNote("");
    }
  }, [invoice, isOpen]);
  const handlePasteTrackingNumber = async () => {
    const url = await handlePasteText();
    if (url) setTrackingNumber(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!invoice) {
      setError(null);
      setTimeout(() => {
        setError("Invoice tidak ditemukan");
      }, 10);
      return;
    }
    if (!trackingNumber) {
      setError(null);
      setTimeout(() => {
        setError("Nomor resi wajib diisi");
      }, 10);
      return;
    }
    if (!costShipment) {
      setError(null);
      setTimeout(() => {
        setError("Biaya pengiriman wajib diisi");
      }, 10);
      return;
    }
    if (!note) {
      setError(null);
      setTimeout(() => {
        setError("Catatan wajib diisi");
      }, 10);
      return;
    }
    if (!invoice) {
      setError(null);
      setTimeout(() => {
        setError("Proposal tidak ditemukan");
      }, 10);
      return;
    }
    try {
      const res = await fetch(`/api/publisher/shipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: invoice.id,
          trackingNumber,
          costShipment,
          shippingDate,
          note,
        }),
      });

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
        className="bg-sky-100 p-2 rounded-lg text-sky-600 hover:text-sky-800 flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Truck className="w-5 h-5" />
        Set Pengiriman
      </button>
      {isOpen && invoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-4">
              Submit Pengiriman
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                {error && <ErrorValidation message={error} duration={3000} />}
                <label className="block font-medium text-black pb-1">
                  Nomor Resi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border bg-inputColor border-borderInput p-3 rounded-xl text-black pr-12"
                    placeholder="Masukkan Nomor Resi"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 border border-gray-400 bg-gray-100 p-2 rounded-lg hover:bg-gray-200 hover:border-black"
                    onClick={handlePasteTrackingNumber}
                  >
                    <Clipboard className="h-5 w-5 text-black" />
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <label className="block font-medium text-black pb-1">
                  Biaya Pengiriman <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full border bg-inputColor border-borderInput p-3 rounded-xl text-black pr-12"
                  placeholder="Masukkan Biaya Pengiriman"
                  value={costShipment === 0 ? "" : costShipment}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setCostShipment(value === "" ? 0 : Number(value));
                  }}
                />
                <div className="mt-4 font-bold text-black">
                  Rp. {formatCurrency(costShipment)}
                </div>
              </div>
              <div className="mb-5">
                <label className="block font-medium text-black pb-1">
                  Tanggal Pengiriman <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="w-full bg-inputColor border border-borderInput p-3 rounded-xl text-black"
                  value={shippingDate}
                  onChange={(e) => setShippingDate(e.target.value)}
                />
              </div>

              <div className="mb-5">
                <label className="block font-medium text-black pb-1">
                  Catatan Pengiriman <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full bg-inputColor border border-borderInput p-3 rounded-xl text-black"
                  placeholder="Masukkan Catatan Keterangan Contoh: Pengiriman dilakukan melalui JNE"
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

export default ModalShipment;
