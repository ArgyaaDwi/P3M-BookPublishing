"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormatter";
import BadgeStatus from "@/components/BadgeStatus";
import LoadingIndicator from "@/components/Loading";
import { PublicationType } from "@/types/publicationTypes";
import { useRouter } from "next/navigation";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import TableHeader from "@/components/TableHeader";
const LecturerProposals = () => {
  const [proposals, setProposals] = useState<PublicationType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const handleDeleteProposalById = async (id: number) => {
    if (
      !confirm(
        `Apakah kamu yakin ingin menghapus proposal dengan judul "${
          proposals.find((proposal) => proposal.id === id)?.publication_title
        }" ini?`
      )
    ) {
      return;
    }
    try {
      const response = await fetch(`/api/lecturer/proposals/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Proposal berhasil dihapus.");
      } else {
        alert("Gagal menghapus proposal: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting proposal:", error);
      alert("Terjadi kesalahan saat menghapus proposal.");
    }
  };
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await fetch("/api/lecturer/proposals?status=all");
        const data = await res.json();
        if (data.status === "success") {
          setProposals(data.data || []);
        } else {
          console.error("Failed to fetch proposals:", data.message);
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
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
                    proposal.current_status_id === 4 ||
                    proposal.current_status_id === 5 ||
                    proposal.current_status_id === 9
                      ? "badgePendingText"
                      : proposal.current_status_id === 2 ||
                        proposal.current_status_id === 6
                      ? "badgeRevText"
                      : "badgeSuccessText"
                  }
                  bgColor={
                    proposal.current_status_id === 1 ||
                    proposal.current_status_id === 4 ||
                    proposal.current_status_id === 5 ||
                    proposal.current_status_id === 9
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
                      className=" bg-yellow-100 p-2 rounded-lg text-yellow-700 hover:text-yellow-900 transition-all duration-300 ease-in-out flex items-center gap-2"
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
            <td colSpan={5} className="text-center p-4 text-gray-500">
              Tidak ada proposal yang diajukan.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default LecturerProposals;
