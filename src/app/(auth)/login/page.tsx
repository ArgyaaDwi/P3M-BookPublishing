"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/form/Input";
import Image from "next/image";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      console.log(result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to login");
      }

      console.log("Login successful:", result.data);

      // Cek role dan arahkan ke halaman sesuai dengan role
      const userRole = result.data.role;

      if (userRole === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (userRole === "DOSEN") {
        router.push("/lecturer/dashboard");
      } else if (userRole === "PENERBIT") {
        router.push("/publisher/dashboard");
      } else {
        throw new Error("Invalid role");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white overflow-hidden">
      <div className="w-full md:w-1/2 flex flex-col justify-center p-12 bg-white-50 mx-4 md:mx-12 rounded-lg border border-gray-200 shadow-lg">
        <h1 className="text-black text-4xl mb-3 self-start font-semibold text-center md:text-left">
          Selamat Datang 👋
        </h1>
        <p className="text-black text-xl mb-6 self-start font-normal text-center md:text-left">
          Buku untuk Berbagi, Akses untuk Berkembang.
        </p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form className="w-full md:w-4/4" onSubmit={handleSubmitLogin}>
          <Input
            type="text"
            placeholder="Masukkan Email Anda ex: user@example.com"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Masukkan Password Anda"
            isPassword={true}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-yellow-500 text-white p-3 mt-3 font-semibold rounded-xl w-full hover:bg-primary"
            type="submit"
          >
            {loading ? "Login" : "Loading..."}
          </button>
        </form>
        <p className="text-black text-center text-base mt-6 font-normal">
          Belum punya akun?{" "}
          <a href="/register" className="text-primary hover:underline">
            Hubungi Admin
          </a>
        </p>
      </div>
      <div className=" hidden md:flex w-1/2 justify-center items-center">
        <Image
          src="/assets/images/ilusbook.jpg"
          alt="Placeholder"
          width={600}
          height={400}
        />
      </div>
    </div>
  );
}
