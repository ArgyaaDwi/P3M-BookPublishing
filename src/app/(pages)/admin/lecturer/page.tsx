"use client";
import Breadcrumb from "@/components/BreadCrumb";
import { Lecturer } from "@/types/lecturerTypes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, FileText, ChartBar } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/utils/dateFormatter";
import LoadingIndicator from "@/components/Loading";
import TableHeader from "@/components/TableHeader";
export default function LecturerPage() {
  const router = useRouter();
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const breadcrumbItems = [
    { name: "Dashboard", url: "/admin/dashboard" },
    { name: "Dosen", url: "/admin/lecturer" },
  ];

  const getLecturers = async () => {
    try {
      const response = await fetch("/api/admin/lecturers");
      const result = await response.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        return result.data;
      } else {
        console.error(
          "Failed to fetch lecturers:",
          result.error || "Unknown error"
        );
        return [];
      }
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      return [];
    }
  };

  useEffect(() => {
    getLecturers().then((lecturers) => {
      setLecturers(lecturers);
      setIsLoading(false);
    });
  }, []);
  const handleDeleteLecturerById = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus dosen ini?")) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/lecturers/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Dosen berhasil dihapus.");
      } else {
        alert("Gagal menghapus dosen: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting lecturer:", error);
      alert("Terjadi kesalahan saat menghapus dosen.");
    }
  };
  return (
    <div>
      <Breadcrumb title="Halaman Dosen" breadcrumbItems={breadcrumbItems} />
      <div className="bg-white rounded-lg mt-3 overflow-hidden px-4 pb-4">
        <div className="flex justify-between py-3">
          <div className="flex gap-2">
            <button className="bg-white border border-gray-500 text-gray-500 px-3 py-2 font-semibold rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Export PDF
            </button>
            <button className="bg-white border border-green-500 text-green-500 px-3 py-2 font-semibold rounded-lg hover:bg-green-500 hover:text-white transition-all duration-300 flex items-center gap-2">
              <ChartBar className="w-5 h-5" />
              Export Excel
            </button>
          </div>
          <Link href="/admin/lecturer/create">
            <button className="bg-secondary text-black px-3 py-2 font-semibold rounded-lg hover:text-white hover:bg-primary transition-all duration-300">
              + Tambah Dosen
            </button>
          </Link>
        </div>
        <table className="w-full border-collapse border border-gray-300 rounded-lg">
          <thead>
            <TableHeader
              columns={[
                "No",
                "Nama Dosen",
                "Jurusan",
                "Email",
                "No. Telepon",
                "Tanggal Terdaftar",
                "Aksi",
              ]}
            />
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  <LoadingIndicator />
                </td>
              </tr>
            ) : lecturers.length > 0 ? (
              lecturers.map((lecturer, index) => (
                <tr key={lecturer.id}>
                  <td className="p-4 text-black border font-semibold">
                    {index + 1}
                  </td>
                  {/* <td className="p-4 text-black border font-semibold">
                    {lecturer.name}
                  </td> */}
                  <td className="p-4 text-black border font-semibold">
                    <div className="flex flex-col">
                      <span>{lecturer.name}</span>
                      <span className="text-gray-500 font-medium">
                        {lecturer.nidn ? `#${lecturer.nidn}` : ""}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-black border font-semibold">
                    {lecturer.major?.major_name || "-"}
                  </td>
                  <td className="p-4 text-black border font-semibold">
                    {lecturer.email}
                  </td>
                  <td className="p-4 text-black border font-semibold">
                    {lecturer.phone_number ? `0${lecturer.phone_number}` : "-"}
                  </td>
                  <td className="p-4 text-black border font-semibold">
                    {formatDate(lecturer.createdAt)}
                  </td>
                  <td className="p-4 text-black border">
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-blue-100 p-2 rounded-lg text-blue-500 hover:text-blue-800"
                        onClick={() =>
                          router.push(`/admin/lecturer/${lecturer.id}`)
                        }
                      >
                        <Eye />
                      </button>
                      <button
                        className="bg-yellow-100 p-2 rounded-lg text-yellow-500 hover:text-yellow-800"
                        onClick={() =>
                          router.push(`/admin/lecturer/update/${lecturer.id}`)
                        }
                      >
                        <Pencil />
                      </button>

                      <button
                        className="bg-red-100 p-2 rounded-lg text-red-500 hover:text-red-800"
                        onClick={() => handleDeleteLecturerById(lecturer.id)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  Tidak ada data dosen
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
