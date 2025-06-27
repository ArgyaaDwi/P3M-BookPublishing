"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Search } from "lucide-react";
import { formatDate } from "@/utils/dateFormatter";
import { PublicationType } from "@/types/publicationTypes";
import { exportToPDF } from "@/utils/exportToPDF";
import { exportToExcel } from "@/utils/exportToExcel";
import { getBadgeVariant } from "@/utils/statusPublicationHelper";
import BadgeStatus from "@/components/BadgeStatus";
import LoadingIndicator from "@/components/Loading";
import ModalPublisher from "./ModalAssignPublisher";
import TableHeader from "@/components/TableHeader";
import ExportButton from "@/components/button/ExportButton";
import Pagination from "@/components/Pagination";

const ApprovedProposalAdmin = () => {
  const router = useRouter();
  const [proposals, setProposals] = useState<PublicationType[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<PublicationType[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const paginatedProposals = filteredProposals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleExportPDF = () => {
    const headers = [
      [
        "No",
        "Judul Ajuan",
        "Dosen Pemohon",
        "Tanggal Pengajuan",
        "Penerbit",
        "Status",
        "Status Transaksi",
      ],
    ];

    const body = paginatedProposals.map((proposal, index) => [
      (currentPage - 1) * itemsPerPage + index + 1,
      proposal.publication_title,
      proposal.lecturer?.name,
      formatDate(proposal.createdAt),
      proposal.publisher?.name || "-",
      proposal.status?.status_name,
      proposal.status_transaction?.status_name || "Belum Ada Transaksi",
    ]);

    exportToPDF({
      head: headers,
      body: body,
      filename: `approved-proposal-halaman-${currentPage}`,
    });
  };

  const handleExportExcel = () => {
    const data = proposals.map((proposal, index) => ({
      No: index + 1,
      "Judul Ajuan": proposal.publication_title,
      "Dosen Pemohon": proposal.lecturer?.name,
      "Tanggal Pengajuan": formatDate(proposal.createdAt),
      Penerbit: proposal.publisher?.name || "-",
      Status: proposal.status?.status_name,
      "Status Transaksi":
        proposal.status_transaction?.status_name || "Belum Ada Transaksi",
    }));
    exportToExcel(data, "approved-proposal");
  };
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProposals(proposals);
      setCurrentPage(1);
      return;
    }
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = proposals.filter((proposal) => {
      const formattedDate = proposal.createdAt.toString();
      return (
        (proposal.publication_title &&
          proposal.publication_title.toLowerCase().includes(searchTermLower)) ||
        (proposal.lecturer?.name &&
          proposal.lecturer?.name.toLowerCase().includes(searchTermLower)) ||
        (proposal.status?.status_name &&
          proposal.status?.status_name
            .toLowerCase()
            .includes(searchTermLower)) ||
        (proposal.createdAt &&
          formatDate(proposal.createdAt)
            .toLowerCase()
            .includes(searchTermLower)) ||
        (proposal.createdAt &&
          formattedDate.toLowerCase().includes(searchTermLower)) ||
        (proposal.id && proposal.id.toString().includes(searchTermLower))
      );
    });
    setFilteredProposals(filtered);
    setCurrentPage(1);
  }, [searchTerm, proposals]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/v1/admin/proposals?status=approved");
        const data = await res.json();
        console.log("Proposals:", data);
        setProposals(data.data || []);
        setFilteredProposals(data.data || []);
      } catch (error) {
        console.error("Error fetching proposals:", error);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return <LoadingIndicator />;
  }
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
        </div>
      </div>
      <table className="w-full text-left border border-gray-300 mt-2">
        <thead>
          <TableHeader
            columns={[
              "No",
              "Judul Ajuan",
              "Dosen Pemohon",
              "Penerbit",
              "Tanggal Pengajuan",
              "Status",
              "Status Transaksi",
              "Aksi",
            ]}
          />
        </thead>
        <tbody>
          {paginatedProposals.length > 0 ? (
            paginatedProposals.map((proposal, index) => (
              <tr key={proposal.id}>
                <td className="p-4 text-black border">{index + 1}</td>
                <td className="p-4 text-black border font-semibold">
                    {proposal.publication_title}
                </td>
                <td className="p-4 text-black border">
                  {proposal.lecturer?.name ?? "Dosen Tidak Diketahui"}
                </td>
                <td className="p-4 text-black border">
                  {formatDate(proposal.createdAt)}
                </td>
                <td className="p-4 text-black border">
                  {proposal.publisher?.name ?? "-"}
                </td>
                <td className="p-4 text-black border font-semibold">
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
                <td className="p-4 text-gray-800 border">
                  {proposal.status_transaction?.status_name ? (
                    <BadgeStatus
                      text={proposal.status_transaction.status_name}
                      color={
                        proposal.current_transaction_status_id === 1
                          ? "badgePendingText"
                          : proposal.current_transaction_status_id === 3 ||
                            proposal.current_transaction_status_id === 4
                          ? "badgeRevText"
                          : "badgeSuccessText"
                      }
                      bgColor={
                        proposal.current_transaction_status_id === 1
                          ? "badgePending"
                          : proposal.current_transaction_status_id === 3 ||
                            proposal.current_transaction_status_id === 4
                          ? "badgeRev"
                          : "badgeSuccess"
                      }
                    />
                  ) : (
                    <span className="italic text-gray-500">
                      Belum Ada Transaksi
                    </span>
                  )}

                  {/* {proposal.status_transaction?.status_name ||
                    "Belum Ada Transaksi"} */}
                </td>
                <td className="p-4 text-black border">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/proposal/${proposal.id}`)
                      }
                      className="bg-blue-100 p-2 rounded-lg text-blue-500 hover:text-blue-800"
                    >
                      <Eye />
                    </button>
                    <ModalPublisher proposal={proposal} />
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

export default ApprovedProposalAdmin;
