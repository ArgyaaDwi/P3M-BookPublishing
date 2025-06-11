"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormatter";
import { PublicationType } from "@/types/publicationTypes";
import { getBadgeVariant } from "@/utils/statusPublicationHelper";
import { useRouter } from "next/navigation";
import { Eye, SquarePen, Trash2, Search } from "lucide-react";
import { exportToPDF } from "@/utils/exportToPDF";
import { exportToExcel } from "@/utils/exportToExcel";
import Pagination from "@/components/Pagination";
import BadgeStatus from "@/components/BadgeStatus";
import LoadingIndicator from "@/components/Loading";
import TableHeader from "@/components/TableHeader";
import ExportButton from "@/components/button/ExportButton";
import CreateButton from "@/components/button/CreateButton";
import ModalVerifyDocument from "./ModalVerifyDocument";
import Swal from "sweetalert2";
const LecturerProposals = () => {
  const [proposals, setProposals] = useState<PublicationType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [filteredProposals, setFilteredProposals] = useState<PublicationType[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  // Variabel state untuk halaman dan jumlah item per halaman
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const paginatedProposals = filteredProposals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportPDF = () => {
    const headers = [
      ["No", "Judul Ajuan", "Kode Ajuan", "Status", "Tanggal Pengajuan"],
    ];
    const body = paginatedProposals.map((proposal, index) => [
      (currentPage - 1) * itemsPerPage + index + 1,
      proposal.publication_title,
      proposal.publication_ticket || "-",
      proposal.status?.status_name,
      formatDate(proposal.createdAt),
    ]);

    exportToPDF({
      head: headers,
      body: body,
      filename: `my-proposal-all-halaman-${currentPage}`,
    });
  };

  const handleExportExcel = () => {
    const data = proposals.map((proposal, index) => ({
      No: index + 1,
      "Judul Ajuan": proposal.publication_title,
      "Kode Ajuan": proposal.publication_ticket,
      Status: proposal.status?.status_name,
      "Tanggal Pengajuan": formatDate(proposal.createdAt),
    }));
    exportToExcel(data, "my-proposal-all");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      setFilteredProposals(proposals);
      setCurrentPage(1);
    } else {
      const filtered = proposals.filter((proposal) => {
        const searchString = value.toLowerCase();
        return (
          proposal.publication_title?.toLowerCase().includes(searchString) ||
          proposal.publication_ticket?.toLowerCase().includes(searchString) ||
          proposal.status?.status_name?.toLowerCase().includes(searchString) ||
          formatDate(proposal.createdAt)?.toLowerCase().includes(searchString)
        );
      });
      setFilteredProposals(filtered);
      setCurrentPage(1);
    }
  };
  const handleDeleteProposalById = async (id: number) => {
    const resultConfirm = await Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Ajuan akan dihapus secara permanen.",
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
      const response = await fetch(`/api/v1/lecturer/proposals/${id}`, {
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
          text: "Ajuan berhasil dihapus.",
          confirmButtonColor: "#3085d6",
        });
        await fetchProposals();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal menghapus program studi: " + result.message,
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error deleting major:", error);
      await Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan!",
        text: "Terjadi kesalahan saat menghapus program studi.",
        confirmButtonColor: "#d33",
      });
    }
  };
  // const handleDeleteProposalById = async (id: number) => {
  //   if (
  //     !confirm(
  //       `Apakah kamu yakin ingin menghapus proposal dengan judul "${
  //         proposals.find((proposal) => proposal.id === id)?.publication_title
  //       }" ini?`
  //     )
  //   ) {
  //     return;
  //   }
  //   try {
  //     const response = await fetch(`/api/v1/lecturer/proposals/${id}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ id }),
  //     });

  //     const result = await response.json();
  //     if (result.status === "success") {
  //       alert("Proposal berhasil dihapus.");
  //       setProposals(proposals.filter((proposal) => proposal.id !== id));
  //       setFilteredProposals(
  //         filteredProposals.filter((proposal) => proposal.id !== id)
  //       );
  //     } else {
  //       alert("Gagal menghapus proposal: " + result.message);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting proposal:", error);
  //     alert("Terjadi kesalahan saat menghapus proposal.");
  //   }
  // };

  // useEffect(() => {
  //   const fetchProposals = async () => {
  //     try {
  //       const res = await fetch("/api/v1/lecturer/proposals?status=all");
  //       const data = await res.json();
  //       if (data.status === "success") {
  //         const proposalsData = data.data || [];
  //         setProposals(proposalsData);
  //         setFilteredProposals(proposalsData);
  //       } else {
  //         console.error("Failed to fetch proposals:", data.message);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching proposals:", error);
  //       setProposals([]);
  //       setFilteredProposals([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProposals();
  // }, []);
  const fetchProposals = async () => {
    try {
      const res = await fetch("/api/v1/lecturer/proposals?status=all");
      const data = await res.json();
      if (data.status === "success") {
        const proposalsData = data.data || [];
        setProposals(proposalsData);
        setFilteredProposals(proposalsData);
      } else {
        console.error("Failed to fetch proposals:", data.message);
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
      setProposals([]);
      setFilteredProposals([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect tetap bisa pakai fungsi tersebut:
  useEffect(() => {
    fetchProposals();
  }, []);

  if (loading) return <LoadingIndicator />;
  return (
    <div>
      <div className="flex justify-between pb-2">
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
              className="border text-primary border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary w-64"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilteredProposals(proposals);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
          <CreateButton href="/lecturer/proposal/create">
            + Buat Ajuan
          </CreateButton>
        </div>
      </div>

      <table className="w-full text-left border border-gray-300 mt-2">
        <thead>
          <TableHeader
            columns={[
              "No",
              "Judul Ajuan",
              "Status",
              "Tanggal Pengajuan",
              "Aksi",
            ]}
          />
        </thead>
        <tbody>
          {paginatedProposals.length > 0 ? (
            paginatedProposals.map((proposal, index) => (
              <tr key={proposal.id}>
                <td className="p-4 text-black border">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="p-4 text-black border font-semibold">
                  <div className="flex flex-col">
                    <span>{proposal.publication_title}</span>
                    <span className="text-gray-500 font-medium">
                      #{proposal.publication_ticket}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-black border">
                  {(() => {
                    const [bg, color] = getBadgeVariant(
                      proposal.current_status_id
                    );
                    return (
                      <BadgeStatus
                        text={
                          proposal.status?.status_name ||
                          "Status Tidak Diketahui"
                        }
                        color={color}
                        bgColor={bg}
                      />
                    );
                  })()}
                </td>
                <td className="p-4 text-black border">
                  {formatDate(proposal.createdAt)}
                </td>
                <td className="p-4 text-black border">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        router.push(`/lecturer/proposal/${proposal.id}`)
                      }
                      className="bg-blue-100 p-2 rounded-lg text-blue-500 hover:text-blue-800 transition-all duration-300 ease-in-out"
                    >
                      <Eye />
                    </button>
                    {proposal.current_status_id === 1 && (
                      <button
                        className="bg-red-100 p-2 rounded-lg text-red-500 hover:text-red-800 transition-all duration-300 ease-in-out"
                        onClick={() => handleDeleteProposalById(proposal.id)}
                      >
                        <Trash2 />
                      </button>
                    )}
                    {proposal.current_status_id === 2 && (
                      <button
                        className="bg-yellow-100 p-2 rounded-lg text-yellow-700 hover:text-yellow-900 transition-all duration-300 ease-in-out flex items-center gap-2"
                        onClick={() =>
                          router.push(
                            `/lecturer/proposal/administration-revision/${proposal.id}`
                          )
                        }
                      >
                        <SquarePen />
                        Revisi
                      </button>
                    )}
                    {proposal.current_status_id === 6 && (
                      <button
                        className="bg-yellow-100 p-2 rounded-lg text-yellow-700 hover:text-yellow-900 transition-all duration-300 ease-in-out flex items-center gap-2"
                        onClick={() =>
                          router.push(
                            `/lecturer/proposal/book-revision/${proposal.id}`
                          )
                        }
                      >
                        <SquarePen />
                        Revisi
                      </button>
                    )}
                    {proposal.current_status_id === 10 && (
                      <ModalVerifyDocument proposal={proposal} />
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr key="empty">
              <td colSpan={5} className="p-4 text-center text-gray-500">
                {searchTerm
                  ? `Tidak ada proposal yang cocok dengan kata kunci "${searchTerm}"`
                  : "Tidak ada data proposal."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalItems={filteredProposals.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(limit) => {
          setItemsPerPage(limit);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

export default LecturerProposals;
