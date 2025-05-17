"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/BreadCrumb";
import Input from "@/components/form/Input";
import { useParams, useRouter } from "next/navigation";
import TextArea from "@/components/form/TextArea";

export default function UpdatePublisherPage() {
  const { id } = useParams();
  const router = useRouter();
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  useEffect(() => {
    const getPublisherById = async () => {
      try {
        const response = await fetch(`/api/v1/admin/publishers/${id}`);
        const result = await response.json();
        if (result.status === "success") {
          setNameInput(result.data.name ?? "");
          setEmailInput(result.data.email ?? "");
          setAddressInput(result.data.address ?? "");
          setPhoneInput(result.data.phone_number ?? "");
        }
      } catch (error) {
        console.error("Error fetching lecturer:", error);
      }
    };
    if (id) getPublisherById();
  }, [id]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNameInput(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmailInput(e.target.value);
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPhoneInput(e.target.value);
  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setAddressInput(e.target.value);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: nameInput,
      email: emailInput,
      address: addressInput,
      phone_number: phoneInput ? phoneInput.toString() : null,
    };
    try {
      const response = await fetch(`/api/v1/admin/publishers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("Sending update request:", data);

      const result = await response.json();
      if (result.status === "success") {
        alert("Penerbit berhasil diperbarui!");
        router.push("/admin/publisher");
      } else {
        alert("Gagal memperbarui penerbit: " + result.message);
      }
    } catch (error) {
      console.error("Error updating publisher:", error);
      alert("Terjadi kesalahan saat memperbarui data.");
    }
  };

  const breadcrumbItems = [
    { name: "Dashboard", url: "/admin/dashboard" },
    { name: "Penerbit", url: "/admin/publisher" },
    { name: "Edit Penerbit", url: `/admin/publisher/update/${id}` },
  ];

  return (
    <div>
      <Breadcrumb
        title="Halaman Edit Penerbit"
        breadcrumbItems={breadcrumbItems}
      />
      <div className="bg-white rounded-lg mt-3 py-2">
        <h3 className="text-black text-2xl font-bold px-4 pb-4 pt-2">
          Form Edit Penerbit
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
              type="number"
              placeholder="Masukkan No. Telepon"
              label="No. Telepon"
              value={phoneInput}
              onChange={handlePhoneChange}
            />
            <TextArea
              label="Alamat"
              placeholder="Masukkan Alamat"
              value={addressInput}
              onChange={handleAddressChange}
            />
            <div className="flex items-center gap-2">
              <button className="bg-primary font-semibold px-3 py-2 rounded-lg text-white">
                Simpan
              </button>
              <button
                type="button"
                className="bg-white border font-semibold border-red-600 px-3 py-2 rounded-lg text-red-600"
                onClick={() => router.push("/admin/lecturer")}
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
