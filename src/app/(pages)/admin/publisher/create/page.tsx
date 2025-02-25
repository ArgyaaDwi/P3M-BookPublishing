"use client";
import React, { useState } from "react";
import Breadcrumb from "@/components/BreadCrumb";
import Input from "@/components/form/Input";
import { useRouter } from "next/navigation";
export default function AddLecturerPage() {
  const router = useRouter();
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

    if (passwordInput !== confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok.");
      return;
    }

    const data = {
      name: nameInput,
      email: emailInput,
      password: passwordInput,
    };

    try {
      const response = await fetch("/api/admin/publishers", {
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
            <Input
              type="text"
              placeholder="Masukkan Nama Penerbit"
              label="Nama Penerbit"
              value={nameInput}
              onChange={handleNameChange}
            />
            <Input
              type="text"
              placeholder="Masukkan Email Penerbit"
              label="Email"
              value={emailInput}
              onChange={handleEmailChange}
            />
            <Input
              type="password"
              placeholder="Masukkan Password"
              label="Password"
              isPassword={true}
              value={passwordInput}
              onChange={handlePasswordChange}
            />
            <Input
              type="password"
              placeholder="Masukkan Konfirmasi Password"
              label="Masukkan Kembali Password"
              isPassword={true}
              value={confirmPassword}
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
