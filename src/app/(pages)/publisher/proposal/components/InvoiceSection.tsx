import { useState, useEffect } from "react";
interface InvoiceData {
  transaction_id: number;
  cost: number;
  transaction_notes?: string;
  createdAt: string;
}
const InvoiceSection = ({ proposalId }: { proposalId: number }) => {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const [cost, setCost] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const handleToggleForm = () => {
    setShowInvoiceForm((prev) => !prev);
  };
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(
          `/api/publisher/invoice/by-publication/${proposalId}`
        );
        const data = await res.json();
        if (data.status === "success" && data.data) {
          setInvoiceData(data.data);
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
      const res = await fetch("/api/publisher/invoice/single", {
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
  if (loading) return <p>Memuat data invoice...</p>;

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-black font-bold text-xl">Invoice </h3>
      {/* {!showInvoiceForm ? (
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
          <h3 className="text-black text-base self-start font-normal mb-1">
            Biaya
          </h3>
          <input
            type="number"
            placeholder="Biaya"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            className="p-3 border w-full bg-inputColor border-borderInput rounded-lg  text-black"
          />
          <h3 className="text-black text-base self-start font-normal mb-1">
            Catatan
          </h3>
          <textarea
            className="w-full border bg-inputColor border-borderInput p-3 rounded-xl text-black"
            placeholder="Masukkan catatan keterangan transaksi"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary font-semibold px-3 py-2 rounded-lg text-white"
            >
              {loading ? "Menyimpan..." : "Simpan"}
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
      )} */}
      {invoiceData ? (
        <div className="mt-2 text-black space-y-2">
          <p>Transaksi ID: #{invoiceData.transaction_id}</p>
          <p>Biaya: Rp {invoiceData.cost.toLocaleString()}</p>
          {invoiceData.transaction_notes && (
            <p>Catatan: {invoiceData.transaction_notes}</p>
          )}
          <p>Dibuat: {new Date(invoiceData.createdAt).toLocaleDateString()}</p>
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
