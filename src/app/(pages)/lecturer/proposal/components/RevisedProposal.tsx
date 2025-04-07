"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormatter";
import { useRouter } from "next/navigation";
import { PublicationType } from "@/types/publicationTypes";
import BadgeStatus from "@/components/BadgeStatus";
import LoadingIndicator from "@/components/Loading";
import { Eye, SquarePen } from "lucide-react";
import TableHeader from "@/components/TableHeader";
const RevisedProposal = () => {
  const router = useRouter();
  const [proposals, setProposals] = useState<PublicationType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/lecturer/proposals?status=revision");
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
  if (loading) return <LoadingIndicator />;
  return (
    <table className="w-full text-left border border-gray-300 mt-2">
      <thead>
        <TableHeader
          columns={["No", "Judul Ajuan", "Status", "Tanggal Pengajuan", "Aksi"]}
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
              <td className="p-4 text-black border">
                <BadgeStatus
                  text={
                    proposal.status?.status_name || "Status Tidak Diketahui"
                  }
                  color={
                    proposal.current_status_id === 1 ||
                    proposal.current_status_id === 4
                      ? "badgePendingText"
                      : proposal.current_status_id === 2 ||
                        proposal.current_status_id === 6
                      ? "badgeRevText"
                      : "badgeSuccessText"
                  }
                  bgColor={
                    proposal.current_status_id === 1 ||
                    proposal.current_status_id === 4
                      ? "badgePending"
                      : proposal.current_status_id === 2 ||
                        proposal.current_status_id === 6
                      ? "badgeRev"
                      : "badgeSuccess"
                  }
                />
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
                    className="h-10 w-10 bg-blue-100 p-2 rounded-lg text-blue-500 hover:text-blue-800 transition-all duration-300 ease-in-out"
                  >
                    <Eye />
                  </button>
                  {proposal.current_status_id === 2 && (
                    <button
                      className=" bg-yellow-100 p-2 rounded-lg text-yellow-500 hover:text-yellow-800 transition-all duration-300 ease-in-out flex items-center gap-2"
                      onClick={() =>
                        router.push(
                          `/lecturer/proposal/submit-revision/${proposal.id}`
                        )
                      }
                    >
                      <SquarePen />
                      Revisi
                    </button>
                  )}
                  {proposal.current_status_id === 6 && (
                    <button
                      className=" bg-yellow-100 p-2 rounded-lg text-yellow-700 hover:text-yellow-900 transition-all duration-300 ease-in-out flex items-center gap-2"
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
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="text-center p-4 text-gray-500">
              Tidak ada proposal yang diajukan.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default RevisedProposal;
