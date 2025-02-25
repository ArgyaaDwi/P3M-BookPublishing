import BadgeStatus from "@/components/BadgeStatus";
import { Eye, Pencil, Trash2 } from "lucide-react";
const ApproveProposal = () => {
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
              <BadgeStatus
                text="Diterima"
                color="badgeSuccessText"
                bgColor="badgeSuccess"
              />
            </td>
            <td className="p-4 text-black border">
              <div className="flex items-center gap-2">
                <button className="bg-blue-100 p-2 rounded-lg text-blue-500 hover:text-blue-800">
                  <Eye />
                </button>
                <button className="bg-yellow-100 p-2 rounded-lg text-yellow-500 hover:text-yellow-800">
                  <Pencil />
                </button>
                <button className="bg-red-100 p-2 rounded-lg text-red-500 hover:text-red-800">
                  <Trash2 />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ApproveProposal;
