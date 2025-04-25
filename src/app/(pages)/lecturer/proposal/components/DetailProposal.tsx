import { Eye } from "lucide-react";
import { PublicationType } from "@/types/publicationTypes";
import { formatDate } from "@/utils/dateFormatter";
import ModalVerifyDocument from "./ModalVerifyDocument";
const DetailProposalSection = ({ proposal }: { proposal: PublicationType }) => {
  return (
    <div>
      <h1 className="text-black text-xl font-semibold">
        {proposal.publication_title}
      </h1>
      <p className="text-gray-500 font-thin">
        Ticket: #{proposal.publication_ticket}
      </p>
      {proposal.publication_document && (
        <a
          href={proposal.publication_document}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-s flex items-center gap-1"
        >
          Draf Buku
        </a>
      )}
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

      {proposal.publication_book_cover && (
        <a
          href={proposal.publication_book_cover}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-s flex items-center gap-1"
        >
          <Eye className="w-4 h-4" />
          Cover Buku
        </a>
      )}

      {proposal.publication_authenticity_proof && (
        <a
          href={proposal.publication_authenticity_proof}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-s flex items-center gap-1"
        >
          <Eye className="w-4 h-4" />
          Bukti Keaslian
        </a>
      )}
      {proposal.current_status_id === 10 && (
        <ModalVerifyDocument proposal={proposal} />
      )}
    </div>
  );
};

export default DetailProposalSection;
