"use client";
import Breadcrumb from "@/components/BreadCrumb";
import { Lecturer } from "@/types/lecturerTypes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, FileText, ChartBar } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/utils/dateFormatter";

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
            <tr>
              <th className="p-4 text-base font-medium text-gray-600 border text-left">
                No
              </th>
              <th className="p-4 text-base font-medium text-gray-600 border text-left">
                Nama Dosen
              </th>
              <th className="p-4 text-base font-medium text-gray-600 border text-left">
                Jurusan
              </th>
              <th className="p-4 text-base font-medium text-gray-600 border text-left">
                Email
              </th>
              <th className="p-4 text-base font-medium text-gray-600 border text-left">
                No. Telephone
              </th>
              <th className="p-4 text-base font-medium text-gray-600 border text-left">
                Tanggal Bergabung
              </th>
              <th className="p-4 text-base font-medium text-gray-600 border text-left">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg
                      aria-hidden="true"
                      className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-300 fill-primary"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="text-black font-medium mt-2">
                      Loading...
                    </span>
                  </div>
                </td>
              </tr>
            ) : lecturers.length > 0 ? (
              lecturers.map((lecturer, index) => (
                <tr key={lecturer.id}>
                  <td className="p-4 text-black border font-semibold">
                    {index + 1}
                  </td>
                  <td className="p-4 text-black border font-semibold">
                    {lecturer.name}
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
