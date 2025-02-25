import BadgeStatus from "@/components/BadgeStatus";
import { Eye, Pencil, Trash2 } from "lucide-react";

const proposals = [
  {
    id: 1,
    title: "Proposal 1",
    code: "#BO25909192",
    date: "Minggu, 16 Februari 2025 pukul 21.35",
    status: {
      text: "Diterima",
      color: "badgeSuccessText",
      bgColor: "badgeSuccess",
    },
  },
  {
    id: 2,
    title: "Proposal 2",
    code: "#BO25909193",
    date: "Senin, 17 Februari 2025 pukul 10.15",
    status: {
      text: "Revisi by Admin",
      color: "badgeRevText",
      bgColor: "badgeRev",
    },
  },
];

const AllProposal = () => {
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
        {proposals.map((proposal) => (
          <tr key={proposal.id}>
            <td className="p-4 text-black border font-semibold">
              {proposal.id}
            </td>
            <td className="p-4 text-black border font-semibold">
              <div className="flex flex-col">
                <span>{proposal.title}</span>
                <span className="text-gray-500 font-medium">
                  {proposal.code}
                </span>
              </div>
            </td>
            <td className="p-4 text-black border font-semibold">
              {proposal.date}
            </td>
            <td className="p-4 text-black border font-semibold">
              <BadgeStatus
                text={proposal.status.text}
                color={proposal.status.color}
                bgColor={proposal.status.bgColor}
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

export default AllProposal;
