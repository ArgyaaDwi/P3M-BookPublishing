"use client";
import React, { useState } from "react";
import { Clipboard } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import Input from "@/components/form/Input";
import { useRouter } from "next/navigation";
import { handlePasteText } from "@/utils/handlePaste";
import ErrorValidation from "@/components/form/ErrorValidation";
import HeaderForm from "@/components/form/HeaderForm";
import Swal from "sweetalert2";
export default function AddProposalPage() {
  const [titleInput, setTitleInput] = useState("");
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitleInput(e.target.value);
  
  const breadcrumbItems = [
    { name: "Dashboard", url: "/lecturer/dashboard" },
    { name: "Ajuan", url: "/lecturer/proposal" },
    { name: "Buat Ajuan", url: "/lecturer/proposal/create" },
  ];
  const handlePaste = async () => {
    const url = await handlePasteText();
    if (url) setDocumentUrl(url);
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput) {
      setError(null);
      setTimeout(() => {
        setError("Judul buku wajib diisi");
      }, 10);
      return;
    }

    if (!documentUrl) {
      setError(null);
      setTimeout(() => {
        setError("URL dokumen wajib diisi");
      }, 10);
      return;
    }

    const data = {
      publication_title: titleInput,
      publication_document: documentUrl,
    };
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/v1/lecturer/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Proposal added successfully:", result.data);
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Proposal berhasil dibuat!",
          confirmButtonColor: "#3085d6",
        });
        router.push("/lecturer/proposal");
      } else {
        console.log("Proposal failed to add:", result.error);
        if (result?.error?.toLowerCase().includes("already exists")) {
          setError("Judul buku tersebut sudah diajukan.");
        } else {
          await Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: "Gagal membuat proposal: " + result.error,
            confirmButtonColor: "#d33",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat mengirim data.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    // <div>
    //   <Breadcrumb
    //     title="Halaman Buat Pengajuan"
    //     breadcrumbItems={breadcrumbItems}
    //   />
    //   <div className="bg-white rounded-lg mt-3 py-2">
    //     <HeaderForm title="Form Pengajuan Penerbitan Buku" />
    //     <hr className="mb-3" />
    //     <div className="px-4">
    //       <form onSubmit={handleFormSubmit}>
    //         {error && <ErrorValidation message={error} duration={3000} />}
    //         <Input
    //           type="text"
    //           placeholder="Masukkan Judul Buku yang Akan Diajukan"
    //           label="Judul Buku"
    //           value={titleInput}
    //           isRequired={true}
    //           onChange={handleTitleChange}
    //         />
    //         <div className="mb-1">
    //           <label className="block text-sm font-medium text-black pb-1">
    //             Link Draf PDF Buku <span className="text-red-500">*</span>
    //           </label>

    //           <div className="relative">
    //             <input
    //               type="url"
    //               className="w-full border border-borderInput bg-inputColor p-3 rounded-xl text-black pr-12"
    //               placeholder="Masukkan URL Draf PDF Buku"
    //               value={documentUrl}
    //               onChange={(e) => setDocumentUrl(e.target.value)}
    //               // onBlur={() => {
    //               //   if (
    //               //     documentUrl &&
    //               //     !documentUrl.startsWith("http://") &&
    //               //     !documentUrl.startsWith("https://")
    //               //   ) {
    //               //     setDocumentUrl(`https://${documentUrl}`);
    //               //   }
    //               // }}
    //               onBlur={(e) => {
    //                 const url = e.target.value.trim();
    //                 if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
    //                   setDocumentUrl(`https://${url}`);
    //                 }
    //               }}

    //             />
    //             <button
    //               type="button"
    //               className="absolute right-3 top-1/2 transform -translate-y-1/2 border border-gray-400 bg-gray-100 p-2 rounded-lg hover:bg-gray-200 hover:border-black"
    //               onClick={handlePaste}
    //             >
    //               <Clipboard className="h-5 w-5 text-black" />
    //             </button>
    //           </div>
    //         </div>
    //         <div className="flex items-center gap-2 pt-4">
    //           {/* <button className="bg-primary font-semibold px-3 py-2 rounded-lg text-white">
    //             Simpan
    //           </button> */}
    //           <button
    //             type="submit"
    //             className="bg-primary font-semibold px-3 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
    //             disabled={isSubmitting}
    //           >
    //             {isSubmitting ? "Menyimpan..." : "Simpan"}
    //           </button>
    //           <button
    //             type="button"
    //             className="bg-white border font-semibold border-red-600 px-3 py-2 rounded-lg text-red-600"
    //           >
    //             Batal
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // </div>
    <div>
  <Breadcrumb
    title="Halaman Buat Pengajuan"
    breadcrumbItems={breadcrumbItems}
  />
  
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mt-3 p-4 md:p-6 border-l-4 border-blue-500">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          Panduan Pengajuan
        </h3>
        <p className="text-gray-600 text-sm md:text-base">
          Sebelum mengajukan penerbitan buku, pastikan Anda telah membaca panduan dan syarat-syarat yang berlaku. 
          Jika ada pertanyaan, jangan ragu untuk menghubungi admin kami.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
        <a href="https://drive.google.com/drive/folders/1GcxuEuyQSivWe0JOdskk-OqkI0dEG3dz?usp=drive_link" target="_blank"
          rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm md:text-base">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          Panduan Lengkap
        </a>
        
        <a href="https://wa.me/6281226513164?text=Halo%20Admin,%20saya%20butuh%20bantuan%20terkait%20penerbitan%20buku."
          target="_blank"
          rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors duration-200 text-sm md:text-base">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          Hubungi Admin
        </a>
      </div>
    </div>
  </div>

  {/* Form Section */}
  <div className="bg-white rounded-lg mt-3 py-2 shadow-sm">
    <HeaderForm title="Form Pengajuan Penerbitan Buku" />
    <hr className="mb-3" />
    <div className="px-4">
      <form onSubmit={handleFormSubmit}>
        {error && <ErrorValidation message={error} duration={3000} />}
        <Input
          type="text"
          placeholder="Masukkan Judul Buku yang Akan Diajukan"
          label="Judul Buku"
          value={titleInput}
          isRequired={true}
          onChange={handleTitleChange}
        />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-black pb-2">
            Link Draf PDF Buku <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              type="url"
              className="w-full border border-borderInput bg-inputColor p-3 rounded-xl text-black pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Masukkan URL Draf PDF Buku"
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
              onBlur={() => {
                if (
                  documentUrl &&
                  !documentUrl.startsWith("http://") &&
                  !documentUrl.startsWith("https://")
                ) {
                  setDocumentUrl(`https://${documentUrl}`);
                }
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 border border-gray-400 bg-gray-100 p-2 rounded-lg hover:bg-gray-200 hover:border-black transition-colors"
              onClick={handlePaste}
              title="Paste dari clipboard"
            >
              <Clipboard className="h-5 w-5 text-black" />
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="submit"
            className="bg-primary font-semibold px-3 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            type="button"
            className="w-full sm:w-auto bg-white border border-red-600 font-semibold px-6 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
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
