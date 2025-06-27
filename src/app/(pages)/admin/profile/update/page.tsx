"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/BreadCrumb";
import Input from "@/components/form/Input";
import ErrorValidation from "@/components/form/ErrorValidation";
import Swal from "sweetalert2";
export default function ProfilePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const breadcrumbItems = [
    { name: "Dashboard", url: "/admin/dashboard" },
    { name: "Profil", url: "/admin/profile" },
    { name: "Edit Profil", url: "/admin/lecturer/add" },
  ];
  const user = useUser();
  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        phone_number: user.phone_number,
        address: user.address,
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name) {
      setError(null);
      setTimeout(() => {
        setError("Nama wajib diisi");
      }, 10);
      return;
    }
    if (!form.phone_number) {
      setError(null);
      setTimeout(() => {
        setError("Nomor Telepon wajib diisi");
      }, 10);
      return;
    }
    if (!form.address) {
      setError(null);
      setTimeout(() => {
        setError("Alamat wajib diisi");
      }, 10);
      return;
    }
    setIsSubmitting(true);
    // const res = await fetch("/api/v1/profile/update", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(form),
    // });
    // await fetch("/api/v1/profile/refresh-session", {
    //   method: "POST",
    // });
    // window.location.href = "/admin/profile";
    // if (res.ok) {
    //   Swal.fire("Berhasil!", "Profil berhasil diperbarui!", "success").then(
    //     () => {
    //       setTimeout(() => {
    //         router.push("/admin/profile");
    //       }, 2500); // delay 1.5 detik
    //     }
    //   );
    // } else {
    //   alert("Gagal memperbarui profil.");
    // }
    try {
      const res = await fetch("/api/v1/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      await fetch("/api/v1/profile/refresh-session", {
        method: "POST",
      });
      if (res.ok) {
        Swal.fire("Berhasil!", "Profil berhasil diperbarui!", "success").then(() => {
          router.push("/admin/profile");
          window.location.reload();
        });
      } else {
        alert("Gagal memperbarui profil.");
      }
      } catch (error) {
        console.error("Terjadi kesalahan saat memperbarui profil:", error);
        alert("Terjadi kesalahan. Silakan coba lagi nanti.");
      } finally {
        setIsSubmitting(false);
      }
  };
  return (
    <div>
      <Breadcrumb
        title="Halaman Edit Profil"
        breadcrumbItems={breadcrumbItems}
      />
      <div className="bg-white rounded-lg mt-3 py-2">
        <h3 className="text-black text-2xl font-bold px-4 pb-4 pt-2">
          Edit Profil
        </h3>
        <hr className="mb-3" />
        <div className="px-4">
          {error && <ErrorValidation message={error} duration={3000} />}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Masukkan Nama"
                label="Nama"
                value={form.name}
                onChange={handleChange}
                isRequired
                name="name"
              />
              <Input
                type="text"
                placeholder="Masukkan Nomor Telepon"
                label="Nomor Telepon"
                value={form.phone_number}
                onChange={handleChange}
                name="phone_number"
                isRequired
              />
            </div>
            <label className="text-black text-base self-start font-medium">
              Alamat <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={form.address ?? ""}
              rows={4}
              onChange={handleChange}
              className="bg-inputColor border text-black border-borderInput w-full rounded-xl p-3"
            />
            <div className="flex items-center gap-2">
              {/* <button className="bg-primary font-semibold px-3 py-2 rounded-lg text-white">
                Simpan
              </button> */}
              <button
                  type="submit"
                  className="bg-primary font-semibold px-3 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
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
