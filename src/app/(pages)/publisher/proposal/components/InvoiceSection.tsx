"use client";
import { Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { formatDate } from "@/utils/dateFormatter";
import LoadingIndicator from "@/components/Loading";
import BadgeStatus from "@/components/BadgeStatus";
import { InvoiceType } from "@/types/invoiceTypes";

const InvoiceSection = ({ proposalId }: { proposalId: number }) => {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceType | null>(null);
  const [cost, setCost] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const handleToggleForm = () => {
    setShowInvoiceForm((prev) => !prev);
  };
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(
          `/api/v1/publisher/invoice/by-publication/${proposalId}`
        );
        const data = await res.json();
        if (data.status === "success" && data.data) {
          // setInvoiceData(data.data);
          const transactionId = data.data.transaction_id;
          const trxRes = await fetch(`/api/v1/publisher/invoice/${transactionId}`);
          const trxData = await trxRes.json();
          if (trxData.status === "success") {
            setInvoiceData(trxData.data);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [proposalId]);
  const handleSubmit = async () => {
    if (!cost || cost <= 0) {
      alert("Masukkan biaya yang valid");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/v1/publisher/invoice/single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publication_id: proposalId,
          cost,
          note,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Invoice berhasil dibuat!");
        setShowInvoiceForm(false);
      } else {
        alert(result.message || "Gagal membuat invoice");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan saat membuat invoice");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <LoadingIndicator />;

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-black font-semibold text-xl">Invoice Ajuan Buku</h3>
      {invoiceData ? (
        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-md space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-black">
              Invoice #{invoiceData.id}
            </h1>
            <p className="text-sm text-gray-600 mb-2">
              Dibuat pada: {formatDate(invoiceData.createdAt)}
            </p>
            <BadgeStatus
              text={invoiceData.status?.status_name || "Status Tidak Diketahui"}
              color={
                invoiceData.current_status_id === 1
                  ? "badgePendingText"
                  : invoiceData.current_status_id === 3
                  ? "badgeRevText"
                  : "badgeSuccessText"
              }
              bgColor={
                invoiceData.current_status_id === 1
                  ? "badgePending"
                  : invoiceData.current_status_id === 3
                  ? "badgeRev"
                  : "badgeSuccess"
              }
            />
            {invoiceData.transaction_notes && (
              <p className="text-gray-800 my-2">
                Catatan Transaksi: {invoiceData.transaction_notes}
              </p>
            )}
            {invoiceData.payment_proof && (
              <a
                href={
                  invoiceData.payment_proof.startsWith("http")
                    ? invoiceData.payment_proof
                    : `https://${invoiceData.payment_proof}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-s flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                Bukti Pembayaran
              </a>
            )}
          </div>

          <div>
            <h2 className="text-lg font-medium text-black mt-4 mb-2">
              Item Transaksi
            </h2>
            <div className="space-y-2">
              {invoiceData.items.map((item, index: number) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center"
                >
                  <div>
                    <p className="text-base font-semibold text-black">
                      {item.publication.publication_title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Dosen: {item.publication.lecturer.name} NIDN{" "}
                      {item.publication.lecturer.nidn}
                    </p>
                  </div>
                  <div className="text-right mt-2 sm:mt-0">
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
                </div>
              ))}
              <p className="text-lg font-semibold text-black text-right">
                Total Keseluruhan: Rp
                {invoiceData.items
                  .reduce((acc: number, item) => acc + item.total_cost, 0)
                  .toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      ) : !showInvoiceForm ? (
        <>
          <p className="text-gray-500 font-thin">
            Belum ada invoice yang terkait dengan proposal ini.
          </p>
          <button
            onClick={handleToggleForm}
            className="mt-2 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            Buat Invoice
          </button>
        </>
      ) : (
        <div className="mt-4 space-y-2">
          <h3 className="text-black text-base font-normal">Biaya</h3>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            placeholder="Biaya"
            className="p-3 border w-full bg-inputColor border-borderInput rounded-lg text-black"
          />
          <h3 className="text-black text-base font-normal">Catatan</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border bg-inputColor border-borderInput p-3 rounded-xl text-black"
            placeholder="Masukkan catatan keterangan transaksi"
            rows={4}
          ></textarea>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmit}
              className="bg-primary font-semibold px-3 py-2 rounded-lg text-white"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={handleToggleForm}
              className="bg-white border font-semibold border-red-600 px-3 py-2 rounded-lg text-red-600"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceSection;
