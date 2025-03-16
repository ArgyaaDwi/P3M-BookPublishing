"use client";
import Breadcrumb from "@/components/BreadCrumb";
import { Eye, Pencil, Trash2, FileText, ChartBar } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Publisher } from "@/types/publisherTypes";
import LoadingIndicator from "@/components/Loading";
import Link from "next/link";
import { formatDate } from "@/utils/dateFormatter";
import TableHeader from "@/components/TableHeader";
export default function PublisherPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
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
  const getPublishers = async () => {
    try {
      const response = await fetch("/api/admin/publishers");
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
      setIsLoading(false);
    });
  });
  const handleDeletePublisherById = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus penerbit ini?")) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/publishers/${id}`, {
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
            <button className="bg-white border border-gray-500 text-gray-500 px-3 py-2 font-semibold rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Export PDF
            </button>
            <button className="bg-white border border-green-500 text-green-500 px-3 py-2 font-semibold rounded-lg hover:bg-green-500 hover:text-white transition-all duration-300 flex items-center gap-2">
              <ChartBar className="w-5 h-5" />
              Export Excel
            </button>
          </div>
          <Link href="/admin/publisher/create">
            <button className="bg-secondary text-black px-3 py-2 font-semibold rounded-lg hover:text-white hover:bg-primary transition-all duration-300">
              + Tambah Penerbit
            </button>
          </Link>
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
            ) : publishers.length > 0 ? (
              publishers.map((publisher, index) => (
                <tr key={publisher.id}>
                  <td className="p-4 text-black border font-semibold">
                    {index + 1}
                  </td>
                  <td className="p-4 text-black border font-semibold">
                    {publisher.name}
                  </td>
                  <td className="p-4 text-black border font-semibold">
                    {publisher.email}
                  </td>
                  <td className="p-4 text-black border font-semibold">
                    {publisher.phone_number
                      ? `0${publisher.phone_number}`
                      : "-"}
                  </td>
                  <td className="p-4 text-black border font-semibold">
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
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Tidak ada data penerbit
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
