"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormatter";
import BadgeStatus from "@/components/BadgeStatus";
import { Eye, Trash2 } from "lucide-react";
import PublicationType from "@/types/publicationTypes";
import LoadingIndicator from "@/components/Loading";
const AllProposalAdmin = () => {
  const [proposals, setProposals] = useState<PublicationType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/proposals?status=all");
        const data = await res.json();
        console.log("Proposals:", data);
        setProposals(data.data || []);
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
    <table className="w-full text-left border border-gray-300 mt-2">
      <thead>
        <tr>
          <th className="p-4 text-base font-semibold bg-gray-50  text-gray-600 border text-left">
            No
          </th>
          <th className="p-4 text-base font-semibold bg-gray-50 text-gray-600 border text-left">
            Judul Proposal
          </th>
          <th className="p-4 text-base font-semibold bg-gray-50 text-gray-600 border text-left">
            Dosen Pemohon
          </th>
          <th className="p-4 text-base font-semibold bg-gray-50 text-gray-600 border text-left">
            Tanggal Pengajuan
          </th>
          <th className="p-4 text-base font-semibold bg-gray-50 text-gray-600 border text-left">
            Status
          </th>
          <th className="p-4 text-base font-semibold bg-gray-50 text-gray-600 border text-left">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        {proposals.length > 0 ? (
          proposals.map(
            (proposal, index) => (
              console.log("Proposal:", proposal),
              (
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
                  <td className="p-4 text-black border">
                    {proposal.lecturer?.name || "Dosen Tidak Diketahui"}
                  </td>
                  <td className="p-4 text-black border ">
                    {formatDate(proposal.createdAt)}
                  </td>
                  <td className="p-4 text-black border">
                    <BadgeStatus
                      text={
                        proposal.status?.status_name || "Status Tidak Diketahui"
                      }
                      color={
                        proposal.current_status_id === 1 ||
                        proposal.current_status_id === 4
                          ? "badgePendingText"
                          : proposal.current_status_id === 2
                          ? "badgeRevText"
                          : "badgeSuccessText"
                      }
                      bgColor={
                        proposal.current_status_id === 1 ||
                        proposal.current_status_id === 4
                          ? "badgePending"
                          : proposal.current_status_id === 2
                          ? "badgeRev"
                          : "badgeSuccess"
                      }
                    />
                  </td>
                  <td className="p-4 text-black border">
                    <div className="flex items-center gap-2">
                      <button className="bg-blue-100 p-2 rounded-lg text-blue-500 hover:text-blue-800">
                        <Eye />
                      </button>
                      {/* <button className="bg-yellow-100 p-2 rounded-lg text-yellow-500 hover:text-yellow-800">
                        <Pencil />
                      </button> */}
                      <button className="bg-red-100 p-2 rounded-lg text-red-500 hover:text-red-800">
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )
          )
        ) : (
          <tr>
            <td colSpan={6} className="text-center p-4 text-gray-500">
              Tidak Ada Data Ajuan Proposal.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default AllProposalAdmin;
