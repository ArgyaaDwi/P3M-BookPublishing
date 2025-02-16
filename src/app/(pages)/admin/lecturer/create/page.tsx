"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/BreadCrumb";
import Input from "@/components/form/Input";
import Select from "@/components/form/Select";

export default function AddLecturerPage() {
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [majors, setMajors] = useState([]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNameInput(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmailInput(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPasswordInput(e.target.value);
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setConfirmPassword(e.target.value);
  const handleSelectChange = (value: string) => setSelectedOption(value);

  const getMajors = async () => {
    try {
      const response = await fetch("/api/admin/majors");
      const result = await response.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        return result.data.map((major: { major_name: string }) => ({
          value: major.major_name,
          label: major.major_name,
        }));
      } else {
        console.error(
          "Failed to fetch majors:",
          result.error || "Unknown error"
        );
        return [];
      }
    } catch (error) {
      console.error("Error fetching majors:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchMajors = async () => {
      const data = await getMajors();
      setMajors(data);
    };
    fetchMajors();
  }, []);

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
      major: selectedOption,
    };

    try {
      const response = await fetch("/api/admin/lecturers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Lecturer added successfully:", result.data);
        alert("Dosen berhasil ditambahkan!");
      } else {
        console.error("Failed to add lecturer:", result.message);
        alert("Gagal menambahkan dosen: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat mengirim data.");
    }
  };

  const breadcrumbItems = [
    { name: "Dashboard", url: "/admin/dashboard" },
    { name: "Dosen", url: "/admin/lecturer" },
    { name: "Tambah Dosen", url: "/admin/lecturer/add" },
  ];

  return (
    <div>
      <Breadcrumb
        title="Halaman Tambah Dosen"
        breadcrumbItems={breadcrumbItems}
      />
      <div className="bg-white rounded-lg mt-3 py-2">
        <h3 className="text-black text-2xl font-bold px-4 pb-4 pt-2">
          Form Tambah Dosen
        </h3>
        <hr className="mb-3" />
        <div className="px-4">
          <form onSubmit={handleFormSubmit}>
            <Input
              type="text"
              placeholder="Masukkan Nama Dosen"
              label="Nama Dosen"
              value={nameInput}
              onChange={handleNameChange}
            />
            <Input
              type="text"
              placeholder="Masukkan Email Dosen"
              label="Email"
              value={emailInput}
              onChange={handleEmailChange}
            />
            <Select
              label="Pilih Jurusan"
              options={majors}
              value={selectedOption}
              onChange={handleSelectChange}
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
