"use client";
import React, { useState } from "react";
import Breadcrumb from "@/components/BreadCrumb";
import Input from "@/components/form/Input";
import { useRouter } from "next/navigation";
import ErrorValidation from "@/components/form/ErrorValidation";
export default function AddLecturerPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNameInput(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmailInput(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPasswordInput(e.target.value);
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setConfirmPassword(e.target.value);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nameInput) {
      setError(null);
      setTimeout(() => {
        setError("Nama penerbit wajib diisi");
      }, 10);
      return;
    }
    if (!emailInput) {
      setError(null);
      setTimeout(() => {
        setError("Email penerbit wajib diisi");
      }, 10);
      return;
    }
    if (!passwordInput) {
      setError(null);
      setTimeout(() => {
        setError("Password penerbit wajib diisi");
      }, 10);
      return;
    }
    if (!confirmPassword) {
      setError(null);
      setTimeout(() => {
        setError("Konfirmasi password wajib diisi");
      }, 10);
      return;
    }
    if (passwordInput !== confirmPassword) {
      setError(null);
      setTimeout(() => {
        setError("Konfirmasi password tidak sesuai");
      }, 10);
      return;
    }
    const data = {
      name: nameInput,
      email: emailInput,
      password: passwordInput,
    };

    try {
      const response = await fetch("/api/v1/admin/publishers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Publisher added successfully:", result.data);
        alert("Penerbit berhasil ditambahkan!");
        router.push("/admin/publisher");
      } else {
        console.error("Publisher failed to add lecturer:", result.message);
        alert("Gagal menambahkan penerbit: " + result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat mengirim data.");
    }
  };

  const breadcrumbItems = [
    { name: "Dashboard", url: "/admin/dashboard" },
    { name: "Penerbit", url: "/admin/publisher" },
    { name: "Tambah Penerbit", url: "/admin/publisher/add" },
  ];

  return (
    <div>
      <Breadcrumb
        title="Halaman Tambah Penerbit"
        breadcrumbItems={breadcrumbItems}
      />
      <div className="bg-white rounded-lg mt-3 py-2">
        <h3 className="text-black text-2xl font-bold px-4 pb-4 pt-2">
          Form Tambah Penerbit
        </h3>
        <hr className="mb-3" />
        <div className="px-4">
          <form onSubmit={handleFormSubmit}>
            {error && <ErrorValidation message={error} duration={3000} />}
            <Input
              type="text"
              placeholder="Masukkan Nama Penerbit"
              label="Nama Penerbit"
              isRequired
              value={nameInput}
              onChange={handleNameChange}
            />
            <Input
              type="text"
              placeholder="Masukkan Email Penerbit"
              label="Email"
              isRequired
              value={emailInput}
              onChange={handleEmailChange}
            />
            <Input
              type="password"
              placeholder="Masukkan Password"
              label="Password"
              isPassword={true}
              isRequired
              value={passwordInput}
              onChange={handlePasswordChange}
            />
            <Input
              type="password"
              placeholder="Masukkan Konfirmasi Password"
              label="Masukkan Kembali Password"
              isPassword={true}
              value={confirmPassword}
              isRequired
              onChange={handleConfirmPasswordChange}
            />
            <div className="flex items-center gap-2">
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
