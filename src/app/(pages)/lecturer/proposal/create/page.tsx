"use client";
import React, { useState } from "react";
import { Clipboard } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import Input from "@/components/form/Input";
import { useRouter } from "next/navigation";
import { handlePasteText } from "@/utils/handlePaste";
import ErrorValidation from "@/components/form/ErrorValidation";
import HeaderForm from "@/components/form/HeaderForm";
export default function AddProposalPage() {
  const [titleInput, setTitleInput] = useState("");
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
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

    try {
      const response = await fetch("/api/lecturer/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Proposal added successfully:", result.data);
        alert("Proposal berhasil ditambahkan!");
        router.push("/lecturer/proposal");
      } else {
        console.error("Proposal failed to add:", result.message);
        alert("Gagal menambahkan proposal: " + result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat mengirim data.");
    }
  };
  return (
    <div>
      <Breadcrumb
        title="Halaman Buat Pengajuan"
        breadcrumbItems={breadcrumbItems}
      />
      <div className="bg-white rounded-lg mt-3 py-2">
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
            <div className="mb-1">
              <label className="block text-sm font-medium text-black pb-1">
                Link Draf PDF Buku <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  type="url"
                  className="w-full border border-borderInput bg-inputColor p-3 rounded-xl text-black pr-12"
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 border border-gray-400 bg-gray-100 p-2 rounded-lg hover:bg-gray-200 hover:border-black"
                  onClick={handlePaste}
                >
                  <Clipboard className="h-5 w-5 text-black" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <button className="bg-primary font-semibold px-3 py-2 rounded-lg text-white">
                Simpan
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
