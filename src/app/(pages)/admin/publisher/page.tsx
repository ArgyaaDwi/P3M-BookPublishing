"use client";
import { Eye, Pencil, Trash2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Publisher } from "@/types/publisherTypes";
import { formatDate } from "@/utils/dateFormatter";
import { exportToExcel } from "@/utils/exportToExcel";
import { exportToPDF } from "@/utils/exportToPDF";
import Pagination from "@/components/Pagination";
import LoadingIndicator from "@/components/Loading";
import Breadcrumb from "@/components/BreadCrumb";
import TableHeader from "@/components/TableHeader";
import ExportButton from "@/components/button/ExportButton";
import CreateButton from "@/components/button/CreateButton";
import Swal from "sweetalert2";
const breadcrumbItems = [
  {
    name: "Dashboard",
    url: "/admin/dashboard",
  },
  {
    name: "Penerbit",
    url: "/admin/publisher",
  },
];

export default function PublisherPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [filteredPublishers, setFilteredPublishers] = useState<Publisher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // Variabel state untuk halaman dan jumlah item per halaman
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const paginatedPublishers = filteredPublishers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportPDF = () => {
    const headers = [
      ["No", "Nama Penerbit", "Email", "No. Telepon", "Tanggal Terdaftar"],
    ];
    const body = paginatedPublishers.map((publisher, index) => [
      (currentPage - 1) * itemsPerPage + index + 1,
      publisher.name,
      publisher.email,
      publisher.phone_number || "-",
      formatDate(publisher.createdAt),
    ]);

    exportToPDF({
      head: headers,
      body: body,
      filename: `penerbit-halaman-${currentPage}`,
    });
  };

  const handleExportExcel = () => {
    const data = publishers.map((publisher, index) => ({
      No: index + 1,
      "Nama Penerbit": publisher.name,
      Email: publisher.email,
      "No. Telepon": publisher.phone_number || "-",
      "Tanggal Terdaftar": formatDate(publisher.createdAt),
    }));
    exportToExcel(data, "semua-penerbit");
  };

  const getPublishers = async () => {
    try {
      const response = await fetch("/api/v1/admin/publishers");
      const result = await response.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        return result.data;
      } else {
        console.error(
          "Failed to fetch publishers:",
          result.error || "Unknown error"
        );
        return [];
      }
    } catch (error) {
      console.error("Error fetching publishers:", error);
      return [];
    }
  };

  useEffect(() => {
    getPublishers().then((publisher) => {
      setPublishers(publisher);
      setFilteredPublishers(publisher);
      setIsLoading(false);
    });
  }, []);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPublishers(publishers);
      setCurrentPage(1);
      return;
    }
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = publishers.filter((publisher) => {
      const formattedDate = publisher.createdAt.toString();
      return (
        (publisher.name &&
          publisher.name.toLowerCase().includes(searchTermLower)) ||
        (publisher.email &&
          publisher.email.toLowerCase().includes(searchTermLower)) ||
        (publisher.phone_number &&
          publisher.phone_number.toLowerCase().includes(searchTermLower)) ||
        (publisher.createdAt &&
          formatDate(publisher.createdAt)
            .toLowerCase()
            .includes(searchTermLower)) ||
        (publisher.createdAt &&
          formattedDate.toLowerCase().includes(searchTermLower)) ||
        (publisher.id && publisher.id.toString().includes(searchTermLower))
      );
    });
    setFilteredPublishers(filtered);
    setCurrentPage(1);
  }, [searchTerm, publishers]);
  const handleDeletePublisherById = async (id: number) => {
    const resultConfirm = await Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Penerbit akan dihapus secara permanen.",
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
      const response = await fetch(`/api/v1/admin/publishers/${id}`, {
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
          text: "Penerbit berhasil dihapus.",
          confirmButtonColor: "#3085d6",
        });
        const updatedPublishers = await getPublishers();
        setPublishers(updatedPublishers);
        setFilteredPublishers(updatedPublishers);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal menghapus penerbit: " + result.message,
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error deleting publisher:", error);
      await Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan!",
        text: "Terjadi kesalahan saat menghapus program studi.",
        confirmButtonColor: "#d33",
      });
    }
  };
  // const handleDeletePublisherById = async (id: number) => {
  //   if (!confirm("Apakah kamu yakin ingin menghapus penerbit ini?")) {
  //     return;
  //   }
  //   try {
  //     const response = await fetch(`/api/v1/admin/publishers/${id}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ id }),
  //     });

  //     const result = await response.json();
  //     if (result.status === "success") {
  //       alert("Penerbit berhasil dihapus.");
  //       const updatedPublishers = await getPublishers();
  //       setPublishers(updatedPublishers);
  //     } else {
  //       alert("Gagal menghapus penerbit: " + result.message);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting publisher:", error);
  //     alert("Terjadi kesalahan saat menghapus penerbit.");
  //   }
  // };
  return (
    <div>
      <Breadcrumb title="Halaman Penerbit" breadcrumbItems={breadcrumbItems} />
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
            <CreateButton href="/admin/publisher/create">
              + Tambah Penerbit
            </CreateButton>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300 ">
          <thead>
            <TableHeader
              columns={[
                "No",
                "Nama Penerbit",
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
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  <LoadingIndicator />
                </td>
              </tr>
            ) : paginatedPublishers.length > 0 ? (
              paginatedPublishers.map((publisher, index) => (
                <tr key={publisher.id}>
                  <td className="p-4 text-black border font-semibold">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-4 text-black border font-semibold">
                    {publisher.name}
                  </td>
                  <td className="p-4 text-black border">{publisher.email}</td>
                  <td className="p-4 text-black border">
                    {publisher.phone_number ? `${publisher.phone_number}` : "-"}
                  </td>
                  <td className="p-4 text-gray-700 border">
                    {formatDate(publisher.createdAt)}
                  </td>
                  <td className="p-4 text-black border">
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-blue-100 p-2 rounded-lg text-blue-500 hover:text-blue-800"
                        onClick={() =>
                          router.push(`/admin/publisher/${publisher.id}`)
                        }
                      >
                        <Eye />
                      </button>
                      <button
                        className="bg-yellow-100 p-2 rounded-lg text-yellow-500 hover:text-yellow-800"
                        onClick={() =>
                          router.push(`/admin/publisher/update/${publisher.id}`)
                        }
                      >
                        <Pencil />
                      </button>
                      <button
                        className="bg-red-100 p-2 rounded-lg text-red-500 hover:text-red-800"
                        onClick={() => handleDeletePublisherById(publisher.id)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr key="empty">
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  {searchTerm
                    ? `Tidak ada penerbit yang cocok dengan kata kunci "${searchTerm}"`
                    : "Tidak ada data penerbit."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalItems={filteredPublishers.length}
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
