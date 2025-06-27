"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/BreadCrumb";
import Input from "@/components/form/Input";
import ErrorValidation from "@/components/form/ErrorValidation";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
export default function UpdateMajorPage() {
  const router = useRouter();
  const params = useParams(); // { id: "3" }
  const id = params?.id;
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const breadcrumbItems = [
    { name: "Dashboard", url: "/admin/dashboard" },
    { name: "Program Studi", url: "/admin/major" },
    { name: "Edit Program Studi", url: "/admin/major/create" },
  ];
  const [form, setForm] = useState({
    major_name: "",
    major_description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchMajor = async () => {
      try {
        const res = await fetch(`/api/v1/admin/majors/${id}`);
        const result = await res.json();
        if (result.status === "success") {
          setForm({
            major_name: result.data.major_name || "",
            major_description: result.data.major_description || "",
          });
        } else {
          alert("Gagal mengambil data: " + result.message);
        }
      } catch (error) {
        console.error("Gagal ambil data major:", error);
      }
    };

    if (id) fetchMajor();
  }, [id]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.major_name) {
      setError(null);
      setTimeout(() => {
        setError("Nama Program Studi wajib diisi");
      }, 10);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/v1/admin/majors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (response.ok) {
        console.log("Major added successfully:", result.data);
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Program Studi berhasil diperbarui!",
          confirmButtonColor: "#3085d6",
        });
        router.push("/admin/major");
        // alert("Program Studi berhasil ditambahkan!");
        // router.push("/admin/major");
      } else {
        console.error("Major failed to add :", result.message);
        await Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal memperbarui program studi: " + result.error,
          confirmButtonColor: "#d33",
        });
        // alert("Gagal menambahkan program studi: " + result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      await Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan!",
        text: "Terjadi kesalahan saat mengirim data.",
        confirmButtonColor: "#d33",
      });
      // alert("Terjadi kesalahan saat mengirim data.");
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
          Form Edit Program Studi
        </h3>
        <hr className="mb-3" />
        <div className="px-4">
          {error && <ErrorValidation message={error} duration={3000} />}
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              type="text"
              placeholder="Masukkan Nama Program Studi"
              label="Nama Program Studi"
              value={form.major_name}
              onChange={handleChange}
              isRequired
              name="major_name"
            />
            <label className="text-black text-base self-start font-medium">
              Deskripsi Program Studi
            </label>
            <textarea
              name="major_description"
              value={form.major_description}
              rows={4}
              onChange={handleChange}
              placeholder="Masukkan Deskripsi Program Studi"
              className="bg-inputColor border text-black border-borderInput w-full rounded-xl p-3"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="bg-primary font-semibold px-3 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
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
