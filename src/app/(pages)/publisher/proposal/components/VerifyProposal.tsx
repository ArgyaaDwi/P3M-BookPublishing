"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/dateFormatter";
import BadgeStatus from "@/components/BadgeStatus";
import { Eye, Search } from "lucide-react";
import { PublicationType } from "@/types/publicationTypes";
import LoadingIndicator from "@/components/Loading";
import ModalVerifyStatus from "./ModalVerify";
import TableHeader from "@/components/TableHeader";
import ExportButton from "@/components/button/ExportButton";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getBadgeVariant } from "@/utils/statusPublicationHelper";
const VerifyProposalPublisher = () => {
  const router = useRouter();
  const [proposals, setProposals] = useState<PublicationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProposals, setFilteredProposals] = useState<PublicationType[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const handleExportPDF = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [
        ["No", "Judul Ajuan", "Dosen Pemohon", "Tanggal Pengajuan", "Status"],
      ],
      body: filteredProposals.map((proposal, index) => [
        index + 1,
        proposal.publication_title,
        proposal.lecturer?.name,
        formatDate(proposal.createdAt),
        proposal.status?.status_name,
      ]),
    });

    doc.save("data-verifiy-proposal.pdf");
  };
  const handleExportExcel = () => {
    console.log("Export Excel");
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProposals(proposals);
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
  }, [searchTerm, proposals]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/v1/publisher/proposals?status=verify");
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
              "Judul Proposal",
              "Dosen Pemohon",
              "Tanggal Pengajuan",
              "Status",
              "Aksi",
            ]}
          />
        </thead>
        <tbody>
          {filteredProposals.length > 0 ? (
            filteredProposals.map((proposal, index) => (
              <tr key={proposal.id}>
                <td className="p-4 text-black border">{index + 1}</td>
                <td className="p-4 text-black border font-semibold">
                  <div className="flex flex-col">
                    <span>{proposal.publication_title}</span>
                    <span className="text-gray-500 font-medium">
                      #{proposal.publication_ticket}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-black border ">
                  {proposal.lecturer?.name || "Dosen Tidak Diketahui"}
                </td>
                <td className="p-4 text-black border ">
                  {formatDate(proposal.createdAt)}
                </td>
                <td className="p-4 text-black border ">
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        router.push(`/publisher/proposal/${proposal.id}`)
                      }
                      className="bg-blue-100 p-2 rounded-lg text-blue-500 hover:text-blue-800"
                    >
                      <Eye />
                    </button>
                    {(proposal.current_status_id === 5 ||
                      proposal.current_status_id === 9) && (
                      <ModalVerifyStatus proposal={proposal} />
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr key="empty">
              <td colSpan={7} className="p-4 text-center text-gray-500">
                {searchTerm
                  ? `Tidak ada ajuan yang cocok dengan kata kunci "${searchTerm}"`
                  : "Tidak ada data ajuan."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VerifyProposalPublisher;
