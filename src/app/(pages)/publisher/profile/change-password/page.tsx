"use client";
import { useState } from "react";
import Breadcrumb from "@/components/BreadCrumb";
import Input from "@/components/form/Input";
import ErrorValidation from "@/components/form/ErrorValidation";
import { useRouter } from "next/navigation";
export default function ChangePasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const breadcrumbItems = [
    { name: "Dashboard", url: "/publisher/dashboard" },
    { name: "Profil", url: "/publisher/profile" },
    { name: "Ubah Password", url: "/admin/lecturer/add" },
  ];
  const [form, setForm] = useState({
    password_lama: "",
    password_baru: "",
    konfirmasi_password_baru: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!form.password_lama) {
      setError("Password lama wajib diisi");
      setLoading(false);
      return;
    }
    if (!form.password_baru) {
      setError("Password baru wajib diisi");
      setLoading(false);
      return;
    }
    if (!form.konfirmasi_password_baru) {
      setError("Konfirmasi password baru wajib diisi");
      setLoading(false);
      return;
    }
    if (form.password_baru !== form.konfirmasi_password_baru) {
      setError("Password baru dan konfirmasi password baru tidak sama");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/v1/profile/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      alert("Password berhasil diubah");
      setForm({
        password_lama: "",
        password_baru: "",
        konfirmasi_password_baru: "",
      });
    } else {
      alert(data.error || "Gagal mengganti password");
    }
  };

  return (
    <div>
      <Breadcrumb
        title="Halaman Ubah Password"
        breadcrumbItems={breadcrumbItems}
      />
      <div className="bg-white rounded-lg mt-3 py-2">
        <h3 className="text-black text-2xl font-bold px-4 pb-4 pt-2">
          Ubah Password
        </h3>
        <hr className="mb-3" />
        <div className="px-4">
          {error && <ErrorValidation message={error} />}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Masukkan Password Lama"
              label="Password Lama"
              value={form.password_lama}
              onChange={handleChange}
              isRequired
              name="password_lama"
              isPassword
            />
            <Input
              type="password"
              placeholder="Masukkan Password Baru"
              label="Password Baru"
              value={form.password_baru}
              onChange={handleChange}
              isRequired
              name="password_baru"
              isPassword
            />
            <Input
              type="password"
              placeholder="Masukkan Konfirmasi Password Baru"
              label="Konfirmasi Password Baru"
              value={form.konfirmasi_password_baru}
              onChange={handleChange}
              isRequired
              name="konfirmasi_password_baru"
              isPassword
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="bg-primary font-semibold px-3 py-2 rounded-lg text-white"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              <button
                onClick={()=>router.back()}
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
