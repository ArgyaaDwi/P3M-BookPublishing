"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/BreadCrumb";
import Input from "@/components/form/Input";
import Select from "@/components/form/Select";
import { useRouter } from "next/navigation";
import ErrorValidation from "@/components/form/ErrorValidation";
export default function AddLecturerPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [nidnInput, setNIDNInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [majors, setMajors] = useState([]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNameInput(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmailInput(e.target.value);
  const handleNIDNChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNIDNInput(e.target.value);
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
    setError(null);

    if (!nameInput) {
      setError(null);
      setTimeout(() => {
        setError("Nama dosen wajib diisi");
      }, 10);
      return;
    }
    if (!emailInput) {
      setError(null);
      setTimeout(() => {
        setError("Email dosen wajib diisi");
      }, 10);
      return;
    }
    if (!selectedOption) {
      setError(null);
      setTimeout(() => {
        setError("Jurusan dosen wajib diisi");
      }, 10);
      return;
    }
    if (!nidnInput) {
      setError(null);
      setTimeout(() => {
        setError("NIDN dosen wajib diisi");
      }, 10);
      return;
    }

    if (!passwordInput) {
      setError(null);
      setTimeout(() => {
        setError("Password dosen wajib diisi");
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
        setError("Password dosen wajib diisi");
      }, 10);
      return;
    }
    const data = {
      name: nameInput,
      email: emailInput,
      nidn: nidnInput,
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
        router.push("/admin/lecturer");
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
            {error && <ErrorValidation message={error} duration={3000} />}
            <Input
              type="text"
              placeholder="Masukkan Nama Dosen"
              label="Nama Dosen"
              value={nameInput}
              onChange={handleNameChange}
              isRequired
            />
            <Input
              type="text"
              placeholder="Masukkan Email Dosen"
              label="Email"
              value={emailInput}
              onChange={handleEmailChange}
              isRequired
            />
            <div className="flex gap-4">
              <Select
                label="Jurusan"
                options={majors}
                value={selectedOption}
                onChange={handleSelectChange}
                isRequired
              />
              <Input
                type="number"
                placeholder="Masukkan NIDN Dosen"
                label="NIDN Dosen"
                value={nidnInput}
                onChange={handleNIDNChange}
                isRequired
              />
            </div>
            <Input
              type="password"
              placeholder="Masukkan Password"
              label="Password"
              isPassword={true}
              value={passwordInput}
              onChange={handlePasswordChange}
              isRequired
            />
            <Input
              type="password"
              placeholder="Masukkan Konfirmasi Password"
              label="Masukkan Kembali Password"
              isPassword={true}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              isRequired
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
