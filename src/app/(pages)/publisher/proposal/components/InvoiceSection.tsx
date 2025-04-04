import { useState } from "react";

const InvoiceSection = () => {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const handleToggleForm = () => {
    setShowInvoiceForm((prev) => !prev);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-black font-bold text-xl">Invoice </h3>
      {!showInvoiceForm ? (
        <>
          <p className="text-gray-500 font-thin">
            Belum ada invoice yang terkait dengan proposal ini.
          </p>
          <button
            onClick={handleToggleForm}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Buat Invoice
          </button>
        </>
      ) : (
        <div className="mt-4 space-y-2">
          <label className="text-black text-base font-bold block">
            Nomor Invoice:
            <input
              type="url"
              className="w-full mt-1 border border-gray-400 p-3 rounded-xl text-black pr-12"
              placeholder="Masukkan URL Pendukung"
            />
          </label>
          <label className="block">
            Total:
            <input
              type="number"
              className="mt-1 block w-full border rounded px-2 py-1"
              placeholder="100000"
            />
          </label>
          <div className="flex gap-2 mt-2">
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Simpan
            </button>
            <button
              onClick={handleToggleForm}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
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
