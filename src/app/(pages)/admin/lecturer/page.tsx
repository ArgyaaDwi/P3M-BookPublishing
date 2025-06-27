"use client";
import { Lecturer } from "@/types/lecturerTypes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, Search } from "lucide-react";
import { formatDate } from "@/utils/dateFormatter";
import { exportToPDF } from "@/utils/exportToPDF";
import { exportToExcel } from "@/utils/exportToExcel";
import Breadcrumb from "@/components/BreadCrumb";
import LoadingIndicator from "@/components/Loading";
import TableHeader from "@/components/TableHeader";
import ExportButton from "@/components/button/ExportButton";
import CreateButton from "@/components/button/CreateButton";
import Pagination from "@/components/Pagination";
import Swal from "sweetalert2";
const breadcrumbItems = [
  { name: "Dashboard", url: "/admin/dashboard" },
  { name: "Dosen", url: "/admin/lecturer" },
];

export default function LecturerPage() {
  const router = useRouter();
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredLecturers, setFilteredLecturers] = useState<Lecturer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // Variabel state untuk halaman dan jumlah item per halaman
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const paginatedLecturers = filteredLecturers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportPDF = () => {
    const headers = [
      [
        "No",
        "Nama Dosen",
        "Jurusan",
        "Email",
        "No. Telepon",
        "Tanggal Terdaftar",
      ],
    ];

    const body = paginatedLecturers.map((lecturer, index) => [
      (currentPage - 1) * itemsPerPage + index + 1,
      lecturer.name,
      lecturer.major?.major_name || "-",
      lecturer.email,
      lecturer.phone_number ? `0${lecturer.phone_number}` : "-",
      formatDate(lecturer.createdAt),
    ]);

    exportToPDF({
      head: headers,
      body: body,
      filename: `dosen-halaman-${currentPage}`,
    });
  };

  const handleExportExcel = () => {
    const data = lecturers.map((lecturer, index) => ({
      No: index + 1,
      "Nama Dosen": lecturer.name,
      Jurusan: lecturer.major?.major_name || "-",
      Email: lecturer.email,
      "No. Telepon": lecturer.phone_number ? `0${lecturer.phone_number}` : "-",
      "Tanggal Terdaftar": formatDate(lecturer.createdAt),
    }));
    exportToExcel(data, "semua-dosen");
  };

  const getLecturers = async () => {
    try {
      const response = await fetch("/api/v1/admin/lecturers");
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
      setFilteredLecturers(lecturers);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLecturers(lecturers);
      setCurrentPage(1);
      return;
    }
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = lecturers.filter((lecturer) => {
      const formattedDate = lecturer.createdAt.toString();
      return (
        (lecturer.name &&
          lecturer.name.toLowerCase().includes(searchTermLower)) ||
        (lecturer.email &&
          lecturer.email.toLowerCase().includes(searchTermLower)) ||
        (lecturer.phone_number &&
          lecturer.phone_number.toLowerCase().includes(searchTermLower)) ||
        (lecturer.nidn &&
          lecturer.nidn.toLowerCase().includes(searchTermLower)) ||
        (lecturer.createdAt &&
          formatDate(lecturer.createdAt)
            .toLowerCase()
            .includes(searchTermLower)) ||
        (lecturer.createdAt &&
          formattedDate.toLowerCase().includes(searchTermLower)) ||
        (lecturer.id && lecturer.id.toString().includes(searchTermLower))
      );
    });
    setFilteredLecturers(filtered);
    setCurrentPage(1);
  }, [searchTerm, lecturers]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const handleDeleteLecturerById = async (id: number) => {
    const resultConfirm = await Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Dosen akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (!resultConfirm.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/admin/lecturers/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (result.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Dosen berhasil dihapus.",
          confirmButtonColor: "#3085d6",
        });
        const updatedLecturers = await getLecturers();
        setLecturers(updatedLecturers);
        setFilteredLecturers(updatedLecturers);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal menghapus dosen: " + result.message,
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error deleting lecturer:", error);
      await Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan!",
        text: "Terjadi kesalahan saat menghapus program studi.",
        confirmButtonColor: "#d33",
      });
    }
  };
  // const handleDeleteLecturerById = async (id: number) => {
  //   if (!confirm("Apakah kamu yakin ingin menghapus dosen ini?")) {
  //     return;
  //   }
  //   try {
  //     const response = await fetch(`/api/v1/admin/lecturers/${id}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ id }),
  //     });

  //     const result = await response.json();
  //     if (result.status === "success") {
  //       alert("Dosen berhasil dihapus.");
  //     } else {
  //       alert("Gagal menghapus dosen: " + result.message);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting lecturer:", error);
  //     alert("Terjadi kesalahan saat menghapus dosen.");
  //   }
  // };
  return (
    <div>
      <Breadcrumb title="Halaman Dosen" breadcrumbItems={breadcrumbItems} />
      <div className="bg-white rounded-lg mt-3 overflow-hidden px-4 pb-4">
        <div className="flex justify-between py-3">
          <div className="flex gap-2">
            <ExportButton type="pdf" onClick={handleExportPDF} />
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
            <CreateButton href="/admin/lecturer/create">
              + Tambah Dosen
            </CreateButton>
          </div>
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
            ) : paginatedLecturers.length > 0 ? (
              paginatedLecturers.map((lecturer, index) => (
                <tr key={lecturer.id}>
                  <td className="p-4 text-black border font-semibold">
                    {index + 1}
                  </td>
                  <td className="p-4 text-black border font-semibold">
                    <div className="flex flex-col">
                      <span>{lecturer.name}</span>
                      <span className="text-gray-500 font-medium">
                        {lecturer.nidn ? `#${lecturer.nidn}` : ""}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-black border">
                    {lecturer.major?.major_name || "-"}
                  </td>
                  <td className="p-4 text-black border ">{lecturer.email}</td>
                  <td className="p-4 text-black border">
                    {lecturer.phone_number ? `0${lecturer.phone_number}` : "-"}
                  </td>
                  <td className="p-4 text-black border">
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
              <tr key="empty">
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  {searchTerm
                    ? `Tidak ada dosen yang cocok dengan kata kunci "${searchTerm}"`
                    : "Tidak ada data dosen."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalItems={filteredLecturers.length}
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
