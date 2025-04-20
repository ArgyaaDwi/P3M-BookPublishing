import { PublicationType } from "@/types/publicationTypes";
import { formatDate } from "@/utils/dateFormatter";
const DetailProposalSection = ({ proposal }: { proposal: PublicationType }) => {
  return (
    <div>
      <h1 className="text-black text-xl font-semibold">
        {proposal.publication_title}
      </h1>
      <p className="text-gray-500 font-thin">
        Ticket: #{proposal.publication_ticket}
      </p>
      <p className="text-black">
        Dosen Pengusul: {proposal.lecturer?.name || "Tidak diketahui"} NIDN.
        {proposal.lecturer?.nidn || "Tidak diketahui"}
      </p>
      <p className="text-black">
        Status: {proposal.status?.status_name || "Tidak diketahui"}
      </p>
      <p className="text-black">
        Diajukan pada: {formatDate(proposal.createdAt)}
      </p>
    </div>
  );
};

export default DetailProposalSection;
