"use client";
import Breadcrumb from "@/components/BreadCrumb";
import { Eye, Pencil, Trash2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Publisher } from "@/types/publisherTypes";
import LoadingIndicator from "@/components/Loading";
import { formatDate } from "@/utils/dateFormatter";
import TableHeader from "@/components/TableHeader";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExportButton from "@/components/button/ExportButton";
import CreateButton from "@/components/button/CreateButton";
export default function PublisherPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [filteredPublishers, setFilteredPublishers] = useState<Publisher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
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
  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        ["No", "Nama Penerbit", "Email", "No. Telepon", "Tanggal Terdaftar"],
      ],
      body: filteredPublishers.map((publisher, index) => [
        index + 1,
        publisher.name,
        publisher.email,
        publisher.phone_number || "-",
        formatDate(publisher.createdAt),
      ]),
    });

    doc.save("data-penerbit.pdf");
  };
  const handleExportExcel = () => {
    console.log("Export Excel");
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

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPublishers(publishers);
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
  }, [searchTerm, publishers]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const handleDeletePublisherById = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus penerbit ini?")) {
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
        alert("Penerbit berhasil dihapus.");
        const updatedPublishers = await getPublishers();
        setPublishers(updatedPublishers);
      } else {
        alert("Gagal menghapus penerbit: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting publisher:", error);
      alert("Terjadi kesalahan saat menghapus penerbit.");
    }
  };
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
            ) : filteredPublishers.length > 0 ? (
              filteredPublishers.map((publisher, index) => (
                <tr key={publisher.id}>
                  <td className="p-4 text-black border font-semibold">
                    {index + 1}
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
      </div>
    </div>
  );
}
