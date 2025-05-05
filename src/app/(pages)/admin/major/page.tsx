"use client";
import Breadcrumb from "@/components/BreadCrumb";
import { Major } from "@/types/interfaces";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, FileText, ChartBar } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/utils/dateFormatter";
import LoadingIndicator from "@/components/Loading";
import TableHeader from "@/components/TableHeader";
export default function MajorPage() {
  const router = useRouter();
  const [majors, setMajors] = useState<Major[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const breadcrumbItems = [
    { name: "Dashboard", url: "/admin/dashboard" },
    { name: "Program Studi", url: "/admin/major" },
  ];

  const getMajors = async () => {
    try {
      const response = await fetch("/api/admin/majors");
      const result = await response.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        return result.data;
      } else {
        console.error(
          "Failed to fetch Majors:",
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
    getMajors().then((majors) => {
      setMajors(majors);
      setIsLoading(false);
    });
  }, []);
  const handleDeleteMajorById = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus program studi ini?")) {
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
              + Tambah Prodi
            </button>
          </Link>
        </div>
        <table className="w-full border-collapse border border-gray-300 rounded-lg">
          <thead>
            <TableHeader
              columns={["No", "Nama Program Studi", "Created At", "Aksi"]}
            />
          </thead>
          <tbody>
            {isLoading ? (
              <tr key="loading">
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  <LoadingIndicator />
                </td>
              </tr>
            ) : majors.length > 0 ? (
              majors.map((major, index) => (
                <tr key={major.id}>
                  <td className="p-4 text-black border font-semibold">
                    {index + 1}
                  </td>
                  <td className="p-4 text-black border font-semibold">
                    <div className="flex flex-col">
                      <span>{major.major_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-black border">
                    {formatDate(major.createdAt)}
                  </td>
                  <td className="p-4 text-black border">
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-yellow-100 p-2 rounded-lg text-yellow-500 hover:text-yellow-800"
                        onClick={() =>
                          router.push(`/admin/lecturer/update/${major.id}`)
                        }
                      >
                        <Pencil />
                      </button>
                      <button
                        className="bg-red-100 p-2 rounded-lg text-red-500 hover:text-red-800"
                        onClick={() => handleDeleteMajorById(major.id)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr key="empty">
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Tidak ada data Program Studi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
