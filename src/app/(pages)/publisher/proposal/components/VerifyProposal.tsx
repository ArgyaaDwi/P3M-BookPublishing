"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/dateFormatter";
import BadgeStatus from "@/components/BadgeStatus";
import { Eye } from "lucide-react";
import { PublicationType } from "@/types/publicationTypes";
import LoadingIndicator from "@/components/Loading";
import ModalVerifyStatus from "./ModalVerify";
import TableHeader from "@/components/TableHeader";
const VerifyProposalPublisher = () => {
  const router = useRouter();
  const [proposals, setProposals] = useState<PublicationType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/publisher/proposals?status=verify");
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
        {proposals.length > 0 ? (
          proposals.map((proposal, index) => (
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
                <BadgeStatus
                  text={
                    proposal.status?.status_name || "Status Tidak Diketahui"
                  }
                  color={
                    proposal.current_status_id === 1 ||
                    proposal.current_status_id === 4 ||
                    proposal.current_status_id === 5 ||
                    proposal.current_status_id === 9
                      ? "badgePendingText"
                      : proposal.current_status_id === 2
                      ? "badgeRevText"
                      : "badgeSuccessText"
                  }
                  bgColor={
                    proposal.current_status_id === 1 ||
                    proposal.current_status_id === 4 ||
                    proposal.current_status_id === 5 ||
                    proposal.current_status_id === 9
                      ? "badgePending"
                      : proposal.current_status_id === 2
                      ? "badgeRev"
                      : "badgeSuccess"
                  }
                />
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
          <tr>
            <td colSpan={6} className="text-center p-4 text-gray-500">
              Tidak Ada Ajuan Penerbitan Yang Perlu Diverifikasi.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default VerifyProposalPublisher;
