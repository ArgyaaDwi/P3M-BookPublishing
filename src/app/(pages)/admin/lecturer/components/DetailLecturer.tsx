"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Pencil, Lock } from "lucide-react";
import { Lecturer } from "@/types/lecturerTypes";
import { formatDate } from "@/utils/dateFormatter";
import Image from "next/image";
import Swal from "sweetalert2";
export default function DetailLecturer() {
  const router = useRouter();
  const { id } = useParams();
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);

  useEffect(() => {
    const getLecturerById = async () => {
      try {
        const response = await fetch(`/api/v1/admin/lecturers/${id}`);
        const result = await response.json();
        if (result.status === "success") {
          setLecturer(result.data);
        } else {
          console.error("Failed to fetch lecturer detail:", result.error);
        }
      } catch (error) {
        console.error("Error fetching lecturer detail:", error);
      }
    };
    getLecturerById();
  }, [id]);

  if (!lecturer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-6">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 flex flex-col lg:flex-row items-start gap-8">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="relative">
                <Image
                  src="/assets/images/user_img.png"
                  alt="User Avatar"
                  width={168}
                  height={168}
                  className="rounded-xl object-cover shadow-lg border-4 border-white  p-3"
                />
              </div>
            </div>
            <div className="mt-6 space-y-3 w-full min-w-[200px]">
              <button
                className="group w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-3"
                onClick={() =>
                  router.push(`/admin/lecturer/update/${lecturer.id}`)
                }
              >
                <Pencil className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Edit Data
              </button>

              {/* <button className="group w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-md flex items-center justify-center gap-3">
                <Lock className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Ganti Password
              </button> */}
              <button
                onClick={async () => {
                  const result = await Swal.fire({
                    title: "Yakin ganti password?",
                    text: "Password dosen akan diganti menjadi '123456'",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Ya",
                    cancelButtonText: "Batal",
                  });

                  if (result.isConfirmed) {
                    try {
                      const res = await fetch(
                        `/api/v1/admin/lecturers/${lecturer.id}/reset-password`,
                        {
                          method: "POST",
                        }
                      );
                      const data = await res.json();
                      if (data.status === "success") {
                        Swal.fire(
                          "Berhasil!",
                          "Password telah direset",
                          "success"
                        );
                      } else {
                        Swal.fire(
                          "Gagal",
                          data.message || "Terjadi kesalahan.",
                          "error"
                        );
                      }
                    } catch (error) {
                      console.error(error);
                      Swal.fire(
                        "Error",
                        "Tidak dapat terhubung ke server",
                        "error"
                      );
                    }
                  }
                }}
                className="group w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-md flex items-center justify-center gap-3"
              >
                <Lock className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Ganti Password
              </button>
            </div>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                <h2 className="text-2xl font-bold text-primary">
                  Informasi Dosen
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left */}
              <div className="space-y-4">
                <div className="group">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Nama Lengkap
                  </label>
                  <p className="text-lg font-semibold text-gray-800 mt-1 group-hover:text-blue-600 transition-colors duration-200">
                    {lecturer.name}
                  </p>
                </div>

                <div className="group">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    NIDN
                  </label>
                  <p className="text-lg text-gray-800 mt-1 group-hover:text-blue-600 transition-colors duration-200">
                    {lecturer.nidn}
                  </p>
                </div>
                <div className="group">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <p className="text-lg text-gray-800 mt-1 group-hover:text-blue-600 transition-colors duration-200">
                    {lecturer.email}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="space-y-4">
                <div className="group">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    No. Telepon
                  </label>
                  <p className="text-lg text-gray-800 mt-1 group-hover:text-blue-600 transition-colors duration-200">
                    {lecturer.phone_number ? (
                      `${lecturer.phone_number}`
                    ) : (
                      <span className="text-gray-400 italic">Belum diisi</span>
                    )}
                  </p>
                </div>
                <div className="group">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Jurusan
                  </label>
                  <p className="text-lg text-gray-800 mt-1 group-hover:text-blue-600 transition-colors duration-200">
                    {lecturer.major?.major_name || "-"}
                  </p>
                </div>

                <div className="group">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Alamat
                  </label>
                  <p className="text-lg text-gray-800 mt-1 group-hover:text-blue-600 transition-colors duration-200">
                    {lecturer.address ? (
                      lecturer.address
                    ) : (
                      <span className="text-gray-400 italic">Belum diisi</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Bergabung Sejak
                  </label>
                  <p className="text-lg font-semibold text-gray-800">
                    {formatDate(lecturer.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
