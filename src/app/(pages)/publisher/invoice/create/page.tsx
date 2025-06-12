"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/BreadCrumb";
import Select from "@/components/form/Select";
import { CircleAlert } from "lucide-react";
import LoadingIndicator from "@/components/Loading";
import Swal from "sweetalert2";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addBook = () => {
    setBooks([...books, { bookId: "", cost: "" }]);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/v1/proposals/approved-proposals");
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
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/v1/publisher/transactions", {
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
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Transaksi berhasil dibuat!",
          confirmButtonColor: "#3085d6",
        });
        router.push("/publisher/invoice");
      } else {
        console.error("Gagal:", result?.message);
        await Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal buat transaksi: " + result.message,
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat mengirim data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbItems = [
    { name: "Dashboard", url: "/publisher/dashboard" },
    { name: "Invoice", url: "/publisher/invoice" },
    { name: "Buat Invoice", url: "/publisher/invoice/create" },
  ];
  if (loading) {
    return <LoadingIndicator />;
  }
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
              <label className="block text-sm font-normal text-gray-600 pb-1">
                <CircleAlert className="inline pr-1" />
                Isi Bila Diperlukan (Opsional)
              </label>
            </div>
            <div className="flex items-center gap-2">
              {/* <button className="bg-primary font-semibold px-3 py-2 rounded-lg text-white">
                {loading ? "Simpan" : "Menyimpan..."}
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
// "use client";
// import React, { useState, useEffect } from "react";
// import Breadcrumb from "@/components/BreadCrumb";
// import { useRouter } from "next/navigation";
// import Select from "@/components/form/Select";
// import { CircleAlert } from "lucide-react";

// interface ApprovedBooks {
//   id: number;
//   publication_title: string;
// }

// interface BookItem {
//   bookId: string;
//   cost: string;
// }

// export default function AddInvoicePage() {
//   const router = useRouter();
//   const [bookOptions, setBookOptions] = useState<ApprovedBooks[]>([]);
//   const [books, setBooks] = useState<BookItem[]>([{ bookId: "", cost: "" }]);
//   const [notes, setNotes] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const addBook = () => {
//     setBooks([...books, { bookId: "", cost: "" }]);
//   };

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch("/api/v1/proposals/approved-proposals");
//         const result = await res.json();
//         if (result.status === "success") {
//           setBookOptions(result.data);
//           console.log("Data buku:", result.data);
//         } else {
//           console.error("Gagal ambil data buku:", result.message);
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetch buku:", error);
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, []);

//   const handleFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const items = books
//       .filter((book) => book.bookId && book.cost)
//       .map((book) => ({
//         publication_id: parseInt(book.bookId),
//         cost: parseInt(book.cost),
//         quantity: 1,
//       }));

//     if (items.length === 0) {
//       alert("Silakan isi minimal 1 buku dan biaya.");
//       setIsSubmitting(false);
//       return;
//     }

//     const data = {
//       items,
//       transaction_notes: notes,
//     };

//     try {
//       const response = await fetch("/api/v1/publisher/transactions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       let result;
//       try {
//         result = await response.json();
//       } catch (err) {
//         console.error("Gagal parsing JSON:", err);
//         alert("Gagal membaca respon dari server.");
//         setIsSubmitting(false);
//         return;
//       }

//       if (response.ok) {
//         console.log("Transaksi berhasil:", result.data);
//         alert("Transaksi berhasil dibuat!");
//         router.push("/publisher/invoice");
//       } else {
//         console.error("Gagal:", result?.message);
//         alert(
//           "Gagal membuat transaksi: " + (result?.message ?? "Unknown error")
//         );
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("Terjadi kesalahan saat mengirim data.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const calculateItemTotal = (cost: string) => {
//     return parseInt(cost) || 0;
//   };

//   const getSelectedBookTitle = (bookId: string) => {
//     const selectedBook = bookOptions.find(
//       (book) => book.id.toString() === bookId
//     );
//     return selectedBook?.publication_title || "";
//   };

//   const breadcrumbItems = [
//     { name: "Dashboard", url: "/publisher/dashboard" },
//     { name: "Invoice", url: "/publisher/invoice" },
//     { name: "Buat Invoice", url: "/publisher/invoice/create" },
//   ];

//   const calculateTotal = () => {
//     return books.reduce((total, book) => {
//       return total + calculateItemTotal(book.cost);
//     }, 0);
//   };

//   return (
//     <div>
//       <Breadcrumb
//         title="Halaman Buat Invoice"
//         breadcrumbItems={breadcrumbItems}
//       />
//       <div className="bg-white rounded-lg mt-3 py-2 shadow-md">
//         <div className="flex justify-between items-center px-4 pb-2 pt-2">
//           <h3 className="text-black text-2xl font-semibold">
//             Form Tambah Transaksi
//           </h3>
//           <button
//             onClick={addBook}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-2"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//               />
//             </svg>
//             Tambah Buku
//           </button>
//         </div>
//         <hr className="mb-3" />

//         <div className="px-4">
//           {loading ? (
//             <div className="py-10 text-center">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//               <p className="mt-2 text-gray-600">Memuat data buku...</p>
//             </div>
//           ) : (
//             <div className="mb-4">
//               <div className="rounded-lg overflow-hidden border border-gray-200">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         No
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Buku
//                       </th>

//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Biaya Per Buku
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Total
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {books.map((book, index) => (
//                       <tr
//                         key={index}
//                         className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                       >
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                           {index + 1}
//                         </td>
//                         <td className="px-4 py-3 relative z-10">

//                             <Select
//                               label="List Buku"
//                               placeholder=".:: Pilih Buku ::."
//                               value={book.bookId}
//                               onChange={(value) => {
//                                 const updated = [...books];
//                                 updated[index].bookId = value;
//                                 setBooks(updated);
//                               }}
//                               options={bookOptions.map((b: ApprovedBooks) => ({
//                                 value: b.id.toString(),
//                                 label: b.publication_title,
//                               }))}
//                             />

//                           {book.bookId && (
//                             <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
//                               {getSelectedBookTitle(book.bookId)}
//                             </p>
//                           )}
//                         </td>

//                         <td className="px-4 py-3">
//                           <div className="flex items-center">
//                             <span className="text-gray-500 mr-1">Rp</span>
//                             <input
//                               type="number"
//                               placeholder="Biaya"
//                               value={book.cost}
//                               onChange={(e) => {
//                                 const updated = [...books];
//                                 updated[index].cost = e.target.value;
//                                 setBooks(updated);
//                               }}
//                               className="p-2 border bg-inputColor border-borderInput rounded-lg text-black w-36"
//                             />
//                           </div>
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
//                           {calculateItemTotal(book.cost) > 0 ? (
//                             <span className="font-semibold text-black">
//                               Rp{" "}
//                               {calculateItemTotal(book.cost).toLocaleString(
//                                 "id-ID"
//                               )}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400">-</span>
//                           )}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
//                           <button
//                             onClick={() => {
//                               if (books.length > 1) {
//                                 const updated = books.filter(
//                                   (_, i) => i !== index
//                                 );
//                                 setBooks(updated);
//                               }
//                             }}
//                             className={`text-white p-1 rounded-full ${
//                               books.length > 1
//                                 ? "bg-red-500 hover:bg-red-600"
//                                 : "bg-gray-300 cursor-not-allowed"
//                             }`}
//                             disabled={books.length <= 1}
//                           >
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               className="h-4 w-4"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                               stroke="currentColor"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M6 18L18 6M6 6l12 12"
//                               />
//                             </svg>
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot className="bg-gray-50">
//                     <tr>
//                       <td
//                         colSpan={4}
//                         className="px-4 py-3 text-right font-semibold text-gray-700"
//                       >
//                         Total:
//                       </td>
//                       <td
//                         colSpan={2}
//                         className="px-4 py-3 font-bold text-black"
//                       >
//                         Rp {calculateTotal().toLocaleString("id-ID")}
//                       </td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//         <div className="px-4 mt-6">
//           <form onSubmit={handleFormSubmit}>
//             <div className="mb-4">
//               <h3 className="text-black text-base font-medium mb-2">
//                 Catatan Transaksi
//               </h3>
//               <textarea
//                 className="w-full border bg-inputColor border-borderInput p-3 rounded-lg text-black"
//                 placeholder="Masukkan catatan keterangan transaksi"
//                 rows={4}
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//               ></textarea>
//               <label className="block text-sm font-normal text-gray-600 pb-1">
//                 <CircleAlert className="inline pr-1" />
//                 Isi Bila Diperlukan (Opsional)
//               </label>
//             </div>

//             <div className="flex items-center gap-3 mt-6 mb-4">
//               <button
//                 type="submit"
//                 disabled={
//                   isSubmitting ||
//                   loading ||
//                   books.every((book) => !book.bookId || !book.cost)
//                 }
//                 className={`px-5 py-2 rounded-lg text-white font-medium flex items-center ${
//                   isSubmitting ||
//                   loading ||
//                   books.every((book) => !book.bookId || !book.cost)
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-primary hover:bg-primary/90"
//                 }`}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <svg
//                       className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Menyimpan...
//                   </>
//                 ) : (
//                   <>
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5 mr-2"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M5 13l4 4L19 7"
//                       />
//                     </svg>
//                     Simpan Invoice
//                   </>
//                 )}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => router.push("/publisher/invoice")}
//                 className="bg-white border font-medium border-red-600 px-5 py-2 rounded-lg text-red-600 hover:bg-red-50"
//               >
//                 Batal
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
