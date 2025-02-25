"use client";
import React, { useState, useEffect } from "react";
import BadgeStatus from "@/components/BadgeStatus";
import { Eye } from "lucide-react";
import Select from "@/components/form/Select";
import ModalStatus from "@/components/ModalStatus";

const ApproveProposalAdmin = () => {
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [assignedReviewers, setAssignedPublishers] = useState<{
    [key: number]: string;
  }>({});
  const [publishers, setPublishers] = useState<
    { label: string; value: string }[]
  >([]);

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

  const handleAssignClick = (rowId: number) => {
    setShowDropdown(showDropdown === rowId ? null : rowId);
  };

  const handleSelectChange = (rowId: number, value: string) => {
    setAssignedPublishers((prev) => ({ ...prev, [rowId]: value }));
    setShowDropdown(null);
    console.log("Assigned for row", rowId, ":", value);
  };
  return (
    <table className="w-full text-left border border-gray-300 mt-2">
      <thead>
        <tr>
          <th className="p-4 text-base font-medium text-gray-600 border text-left">
            No
          </th>
          <th className="p-4 text-base font-medium text-gray-600 border text-left">
            Judul Proposal
          </th>
          <th className="p-4 text-base font-medium text-gray-600 border text-left">
            Tanggal Pengajuan Dibuat
          </th>
          <th className="p-4 text-base font-medium text-gray-600 border text-left">
            Penerbit
          </th>
          <th className="p-4 text-base font-medium text-gray-600 border text-left">
            Status
          </th>
          <th className="p-4 text-base font-medium text-gray-600 border text-left">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        {[1, 2].map((rowId) => (
          <tr key={rowId}>
            <td className="p-4 text-black border font-semibold">{rowId}</td>
            <td className="p-4 text-black border font-semibold">
              <div className="flex flex-col">
                <span>Proposal {rowId}</span>
                <span className="text-gray-500 font-medium">#BO25909192</span>
              </div>
            </td>
            <td className="p-4 text-black border font-semibold">
              Minggu, 16 Februari 2025 pukul 21.35
            </td>
            <td className="p-4 text-black border font-semibold">
              {assignedReviewers[rowId] ? (
                publishers.find((p) => p.value === assignedReviewers[rowId])
                  ?.label
              ) : (
                <>
                  <button
                    className="bg-teal-500 hover:bg-teal-700 text-white px-3 py-1 rounded"
                    onClick={() => handleAssignClick(rowId)}
                  >
                    Assign
                  </button>
                  {showDropdown === rowId && (
                    <div className="mt-2">
                      <Select
                        label="Pilih Penerbit"
                        options={publishers}
                        value={assignedReviewers[rowId] || ""}
                        onChange={(value) => handleSelectChange(rowId, value)}
                      />
                    </div>
                  )}
                </>
              )}
            </td>

            <td className="p-4 text-black border font-semibold">
              <BadgeStatus
                text="Approve dari Admin"
                color="badgeSuccessText"
                bgColor="badgeSuccess"
              />
            </td>
            <td className="p-4 text-black border">
              <div className="flex items-center gap-2">
                <button className="bg-blue-100 p-2 rounded-lg text-blue-500 hover:text-blue-800">
                  <Eye />
                </button>
              <ModalStatus />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ApproveProposalAdmin;
