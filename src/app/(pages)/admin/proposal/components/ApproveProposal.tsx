"use client";
import React, { useState, useEffect } from "react";
import BadgeStatus from "@/components/BadgeStatus";
import { Eye } from "lucide-react";
import Select from "@/components/form/Select";
import { formatDate } from "@/utils/dateFormatter";
import LoadingIndicator from "@/components/Loading";
import PublicationType from "@/types/publicationTypes";
const ApproveProposalAdmin = () => {
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [assignedReviewers, setAssignedPublishers] = useState<{
    [key: number]: string;
  }>({});
  const [publishers, setPublishers] = useState<
    { label: string; value: string }[]
  >([]);
  const [proposals, setProposals] = useState<PublicationType[]>([]);
  const [loading, setLoading] = useState(true);
  const getPublishers = async () => {
    try {
      const response = await fetch("/api/admin/publishers");
      const result = await response.json();
      if (result.status === "success" && Array.isArray(result.data)) {
        return result.data.map((publisher: { name: string; id: string }) => ({
          label: publisher.name,
          value: publisher.id,
        }));
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
    const fetchPublishers = async () => {
      const data = await getPublishers();
      setPublishers(data);
    };
    fetchPublishers();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/proposals?status=approved");
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
  const handleAssignClick = (rowId: number) => {
    setShowDropdown(showDropdown === rowId ? null : rowId);
  };

  const handleSelectChange = (rowId: number, value: string) => {
    setAssignedPublishers((prev) => ({ ...prev, [rowId]: value }));
    setShowDropdown(null);
    console.log("Assigned for row", rowId, ":", value);
  };
  if (loading) {
    return <LoadingIndicator />;
  }
  return (
    <table className="w-full text-left border border-gray-300 mt-2">
      <thead>
        <tr>
          <th className="p-4 text-base font-semibold bg-gray-50 text-gray-600 border text-left">
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
            Penerbit
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
                {proposal.lecturer?.name ?? "Dosen Tidak Diketahui"}
              </td>
              <td className="p-4 text-black border">
                {formatDate(proposal.createdAt)}
              </td>
              <td className="p-4 text-black border">
                {assignedReviewers[proposal.id] ? (
                  publishers.find(
                    (p) => p.value === assignedReviewers[proposal.id]
                  )?.label
                ) : (
                  <>
                    <button
                      className="bg-teal-500 hover:bg-teal-700 text-white px-3 py-1 rounded"
                      onClick={() => handleAssignClick(proposal.id)}
                    >
                      Assign
                    </button>
                    {showDropdown === proposal.id && (
                      <div className="mt-2">
                        <Select
                          label="Pilih Penerbit"
                          options={publishers}
                          value={assignedReviewers[proposal.id] || ""}
                          onChange={(value) =>
                            handleSelectChange(proposal.id, value)
                          }
                        />
                      </div>
                    )}
                  </>
                )}
              </td>
              <td className="p-4 text-black border font-semibold">
                <BadgeStatus
                  text={
                    proposal.status?.status_name || "Status Tidak Diketahui"
                  }
                  color={
                    proposal.current_status_id === 1
                      ? "badgePendingText"
                      : proposal.current_status_id === 2
                      ? "badgeRevText"
                      : "badgeSuccessText"
                  }
                  bgColor={
                    proposal.current_status_id === 1
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
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="text-center p-4 text-gray-500">
              Tidak Ada Ajuan Dengan Status Approve.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ApproveProposalAdmin;
