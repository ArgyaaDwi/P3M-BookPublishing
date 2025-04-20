"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/BreadCrumb";
import { useRouter } from "next/navigation";
import Select from "@/components/form/Select";
interface ApprovedBooks {
  id: number;
  publication_title: string;
}
export default function AddInvoicePage() {
  const router = useRouter();
  const [bookOptions, setBookOptions] = useState([]);
  const [books, setBooks] = useState([{ bookId: "", cost: "" }]);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const addBook = () => {
    setBooks([...books, { bookId: "", cost: "" }]);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/proposals/approved-proposals");
        const result = await res.json();
        if (result.status === "success") {
          setBookOptions(result.data);
          console.log("Data buku:", result.data);
        } else {
          console.error("Gagal ambil data buku:", result.message);
        }
      } catch (error) {
        console.error("Error fetch buku:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const items = books
      .filter((book) => book.bookId && book.cost)
      .map((book) => ({
        publication_id: parseInt(book.bookId),
        cost: parseInt(book.cost),
        quantity: 1,
      }));
    if (items.length === 0) {
      alert("Silakan isi minimal 1 buku dan biaya.");
      return;
    }
    const data = {
      items,
      transaction_notes: notes,
    };
    try {
      const response = await fetch("/api/publisher/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      let result;
      try {
        result = await response.json();
      } catch (err) {
        console.error("Gagal parsing JSON:", err);
        alert("Gagal membaca respon dari server.");
        return;
      }

      if (response.ok) {
        console.log("Transaksi berhasil:", result.data);
        console.log("DATA YANG DIKIRIM:", JSON.stringify(data, null, 2));
        alert("Transaksi berhasil dibuat!");
        router.push("/publisher/invoice");
      } else {
        console.error("Gagal:", result?.message);
        alert(
          "Gagal membuat transaksi: " + (result?.message ?? "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat mengirim data.");
    }
  };

  const breadcrumbItems = [
    { name: "Dashboard", url: "/publisher/dashboard" },
    { name: "Invoice", url: "/publisher/invoice" },
    { name: "Buat Invoice", url: "/publisher/invoice/create" },
  ];

  return (
    <div>
      <Breadcrumb
        title="Halaman Buat Invoice"
        breadcrumbItems={breadcrumbItems}
      />
      <div className="bg-white rounded-lg mt-3 py-2">
        <h3 className="text-black text-2xl font-semibold px-4 pb-4 pt-2">
          Form Tambah Transaksi
        </h3>
        <hr className="mb-3" />
        <div className="px-4">
          {books.map((book, index) => (
            <div key={index} className="mb-4 border p-2 rounded-lg">
              <h3 className="font-semibold mb-2 text-black">
                Buku ke-{index + 1}
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-full flex flex-col">
                  <Select
                    label="Pilih Buku"
                    placeholder=".:: Pilih Buku ::."
                    value={book.bookId}
                    onChange={(value) => {
                      const updated = [...books];
                      updated[index].bookId = value;
                      setBooks(updated);
                    }}
                    options={bookOptions.map((b: ApprovedBooks) => ({
                      value: b.id.toString(),
                      label: b.publication_title,
                    }))}
                  />
                  <div className="flex flex-col">
                    <label className="text-base text-black mb-1">
                      Biaya Penerbitan Buku
                    </label>
                    <input
                      type="number"
                      placeholder="Masukkan biaya"
                      value={book.cost}
                      onChange={(e) => {
                        const updated = [...books];
                        updated[index].cost = e.target.value;
                        setBooks(updated);
                      }}
                      className="p-3 border bg-inputColor border-borderInput rounded-lg text-black w-full max-w-[200px]"
                    />
                  </div>
                </div>

                {books.length > 1 && (
                  <button
                    onClick={() => {
                      const updated = books.filter((_, i) => i !== index);
                      setBooks(updated);
                    }}
                    className="text-red-500 hover:text-red-700 font-bold text-xl"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={addBook}
            className="bg-blue-400 text-white px-4 py-2 rounded-lg"
          >
            Tambah Buku
          </button>

          <div className="mt-4 font-bold text-black">
            Total: Rp{" "}
            {books
              .reduce((total, b) => total + Number(b.cost || 0), 0)
              .toLocaleString("id-ID")}
          </div>
        </div>
        <div className="px-4">
          <form onSubmit={handleFormSubmit}>
            <div className="mb-1 mt-2">
              <h3 className="text-black text-base self-start font-normal mb-1">
                Catatan Transaksi
              </h3>
              <textarea
                className="w-full border bg-inputColor border-borderInput p-3 rounded-xl text-black"
                placeholder="Masukkan catatan keterangan transaksi"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-primary font-semibold px-3 py-2 rounded-lg text-white">
                {loading ? "Simpan" : "Menyimpan..."}
              </button>
              <button
                type="button"
                className="bg-white border font-semibold border-red-600 px-3 py-2 rounded-lg text-red-600"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
