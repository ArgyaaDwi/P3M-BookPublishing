"use client";
import { Major } from "@/types/interfaces";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Search } from "lucide-react";
import { formatDate } from "@/utils/dateFormatter";
import Breadcrumb from "@/components/BreadCrumb";
import { exportToExcel } from "@/utils/exportToExcel";
import { exportToPDF } from "@/utils/exportToPDF";
import LoadingIndicator from "@/components/Loading";
import TableHeader from "@/components/TableHeader";
import ExportButton from "@/components/button/ExportButton";
import CreateButton from "@/components/button/CreateButton";
import Pagination from "@/components/Pagination";

const breadcrumbItems = [
  { name: "Dashboard", url: "/admin/dashboard" },
  { name: "Program Studi", url: "/admin/major" },
];

export default function MajorPage() {
  const router = useRouter();
  const [majors, setMajors] = useState<Major[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredMajors, setFilteredMajors] = useState<Major[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // Variabel state untuk halaman dan jumlah item per halaman
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const paginatedMajors = filteredMajors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleExportPDF = () => {
    const headers = [["No", "Nama Program Studi", "Created At"]];
    const body = paginatedMajors.map((major, index) => [
      (currentPage - 1) * itemsPerPage + index + 1,
      major.major_name,
      formatDate(major.createdAt),
    ]);

    exportToPDF({
      head: headers,
      body: body,
      filename: `prodi-halaman-${currentPage}`,
    });
  };

  const handleExportExcel = () => {
    const data = majors.map((major, index) => ({
      No: index + 1,
      "Nama Program Studi": major.major_name,
      "Tanggal Dibuat": formatDate(major.createdAt),
    }));
    exportToExcel(data, "semua-prodi");
  };
  const getMajors = async () => {
    try {
      const response = await fetch("/api/v1/admin/majors");
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
      setFilteredMajors(majors);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMajors(majors);
      setCurrentPage(1);
      return;
    }
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = majors.filter((major) => {
      const formattedDate = major.createdAt.toString();
      return (
        (major.major_name &&
          major.major_name.toLowerCase().includes(searchTermLower)) ||
        (major.createdAt &&
          formatDate(major.createdAt)
            .toLowerCase()
            .includes(searchTermLower)) ||
        (major.createdAt &&
          formattedDate.toLowerCase().includes(searchTermLower)) ||
        (major.id && major.id.toString().includes(searchTermLower))
      );
    });
    setFilteredMajors(filtered);
    setCurrentPage(1);
  }, [searchTerm, majors]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteMajorById = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus program studi ini?")) {
      return;
    }
    try {
      const response = await fetch(`/api/v1/admin/majors/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Program studi berhasil dihapus.");
        const updatedMajors = await getMajors();
        setMajors(updatedMajors);
        setFilteredMajors(updatedMajors);
      } else {
        alert("Gagal menghapus program studi: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting major:", error);
      alert("Terjadi kesalahan saat menghapus program studi.");
    }
  };

  return (
    <div>
      <Breadcrumb title="Program Studi" breadcrumbItems={breadcrumbItems} />
      <div className="bg-white rounded-lg mt-3 overflow-hidden px-4 pb-4">
        <div className="flex justify-between py-3">
          <div className="flex gap-2">
            <ExportButton onClick={handleExportPDF} />
            <ExportButton type="excel" onClick={handleExportExcel} />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari di semua kolom..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="border text-primary  border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
            <CreateButton href="/admin/major/create">
              + Tambah Prodi
            </CreateButton>
          </div>
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
            ) : paginatedMajors.length > 0 ? (
              paginatedMajors.map((major, index) => (
                <tr key={major.id}>
                  <td className="p-4 text-black border font-semibold">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-4 text-black border font-semibold">
                    {major.major_name}
                  </td>
                  <td className="p-4 text-gray-700 border">
                    {formatDate(major.createdAt)}
                  </td>
                  <td className="p-4 text-black border">
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-yellow-100 p-2 rounded-lg text-yellow-500 hover:text-yellow-800"
                        onClick={() =>
                          router.push(`/admin/major/update/${major.id}`)
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
                  {searchTerm
                    ? `Tidak ada program studi yang cocok dengan kata kunci "${searchTerm}"`
                    : "Tidak ada data Program Studi"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalItems={filteredMajors.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(limit) => {
            setItemsPerPage(limit);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
}
