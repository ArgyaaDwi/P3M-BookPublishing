"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/form/Input";
import Image from "next/image";
import ErrorValidation from "@/components/form/ErrorValidation";
import Link from "next/link";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      console.log(result);

      if (!response.ok) {
        // Tampilkan pesan error dari server jika ada
        const serverError = result?.error || result?.message || "Gagal login";
        console.error("❌ Server error:", serverError);
        setError(serverError);
        return;
        // throw new Error(result.error || "Failed to login");
      }

      console.log("Login successful:", result.data);
      const userRole = result.data.role;

      console.log("Redirecting to:", userRole);

      if (userRole === "ADMIN") {
        // alert("Redirecting to /admin/dashboard");
        router.push("/admin/dashboard");
        // window.location.href = "/admin/dashboard";
        // router.push("/admin/dashboard");
      } else if (userRole === "DOSEN") {
        router.push("/lecturer/dashboard");
      } else if (userRole === "PENERBIT") {
        router.push("/publisher/dashboard");
      } else {
        throw new Error("Invalid role");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white overflow-hidden">
      <div className="w-full md:w-1/2 flex flex-col justify-center p-12 bg-white-50 mx-4 md:mx-12 rounded-lg border border-gray-200 shadow-lg">
        <Link
          href="/publication"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Landing Page
        </Link>
        <h1 className="text-black text-4xl mb-3 self-start font-semibold text-center md:text-left">
          Selamat Datang 👋
        </h1>
        <p className="text-black text-xl mb-6 self-start font-normal text-center md:text-left">
          Buku untuk Berbagi, Akses untuk Berkembang.
        </p>
        {error && <ErrorValidation message={error} duration={3000} />}
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
            className="bg-yellow-500 text-white p-3 mt-3 font-semibold rounded-xl w-full hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <p className="text-black text-center text-base mt-6 font-normal">
          Belum punya akun?{" "}
          <a
            href="https://wa.me/6281226513164?text=Halo%20Admin,%20saya%20butuh%20bantuan%20terkait%20pendaftaran."
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Hubungi Admin
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
