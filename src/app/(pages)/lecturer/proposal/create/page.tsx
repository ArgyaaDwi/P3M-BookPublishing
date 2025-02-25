"use client";
import React, { useState } from "react";
import Breadcrumb from "@/components/BreadCrumb";
import Input from "@/components/form/Input";
import { Trash2 } from "lucide-react";
export default function AddLecturerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNameInput(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmailInput(e.target.value);

  const breadcrumbItems = [
    { name: "Dashboard", url: "/lecturer/dashboard" },
    { name: "Ajuan", url: "/lecturer/proposal" },
    { name: "Buat Ajuan Proposal", url: "/lecturer/proposal/create" },
  ];
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };
  const handleDiscard = () => {
    setSelectedFile(null);
  };
  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".pdf")) {
      return "/assets/icons/pdf.png";
    } else if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) {
      return "/assets/icons/word.png";
    }
    return "/assets/icons/document.png";
  };
  return (
    <div>
      <Breadcrumb
        title="Halaman Buat Pengajuan"
        breadcrumbItems={breadcrumbItems}
      />
      <div className="bg-white rounded-lg mt-3 py-2">
        <h3 className="text-black text-2xl font-bold px-4 pb-4 pt-2">
          Form Pengajuan Penerbitan Buku
        </h3>
        <hr className="mb-3" />
        <div className="px-4">
          <form>
            <Input
              type="text"
              placeholder="Masukkan Nama Dosen Pengusul"
              label="Nama Pengusul"
              value={nameInput}
              onChange={handleNameChange}
            />
            <Input
              type="text"
              placeholder="Masukkan Judul Buku yang Akan Diajukan"
              label="Judul Buku"
              value={emailInput}
              onChange={handleEmailChange}
            />
            <h3 className="text-black text-base self-start font-normal mb-1">
              Draf PDF Buku
            </h3>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-inputColor hover:bg-sky-50 ${
                  selectedFile ? "hidden" : ""
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={"2"}
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF (max. 5mb)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {selectedFile && (
                <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg bg-inputColor p-4">
                  <img
                    src={getFileIcon(selectedFile.name)}
                    alt="File Icon"
                    className="w-12 h-12 mb-2"
                  />
                  <p className="text-sm text-gray-800">{selectedFile.name}</p>
                  <button
                    className="mt-2 flex items-center px-3 py-1 text-red-500 bg-white border border-red-500 rounded-md hover:bg-red-600 hover:text-white transition-colors duration-300 text"
                    onClick={handleDiscard}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Discard
                  </button>
                </div>
              )}
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
