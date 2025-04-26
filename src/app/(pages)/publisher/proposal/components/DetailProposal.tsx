import { StickyNote } from "lucide-react";
import BadgeStatus from "@/components/BadgeStatus";
import { PublicationType } from "@/types/publicationTypes";
import { formatDate } from "@/utils/dateFormatter";
import ModalInputDocument from "./ModalInputDocument";
import ModalRevisionDocument from "./ModalRevisionDocument";
const DetailProposalSection = ({ proposal }: { proposal: PublicationType }) => {
  return (
    <div className="mx-auto bg-white rounded-2xl shadow-md p-8 space-y-6 border border-gray-200">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">
          {proposal.publication_title}
        </h1>
        <p className="text-sm text-gray-500">
          Ticket: #{proposal.publication_ticket}
        </p>
        <BadgeStatus
          text={proposal.status?.status_name || "Status Tidak Diketahui"}
          color={
            proposal.current_status_id === 1 ||
            proposal.current_status_id === 4 ||
            proposal.current_status_id === 5 ||
            proposal.current_status_id === 9 ||
            proposal.current_status_id === 10
              ? "badgePendingText"
              : proposal.current_status_id === 2 ||
                proposal.current_status_id === 6 ||
                proposal.current_status_id === 11
              ? "badgeRevText"
              : "badgeSuccessText"
          }
          bgColor={
            proposal.current_status_id === 1 ||
            proposal.current_status_id === 4 ||
            proposal.current_status_id === 5 ||
            proposal.current_status_id === 9 ||
            proposal.current_status_id === 10
              ? "badgePending"
              : proposal.current_status_id === 2 ||
                proposal.current_status_id === 6 ||
                proposal.current_status_id === 11
              ? "badgeRev"
              : "badgeSuccess"
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <p className="text-gray-500">Dosen Pengusul</p>
          <p className="font-medium text-gray-800">
            {proposal.lecturer?.name || "Tidak diketahui"} NIDN:{" "}
            {proposal.lecturer?.nidn || "-"}
          </p>
          {proposal?.items?.map((item) => (
            <div key={item.id}>
              <p>
                Status Transaksi:{" "}
                {item.transaction?.status?.status_name ?? "Belum Ada Transaksi"}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-400">
            Ajuan Dibuat: {formatDate(proposal.createdAt)}
          </p>
          <div className="flex flex-wrap gap-2">
            {proposal.publication_book_cover && (
              <a
                href={proposal.publication_book_cover}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition"
              >
                📚 Cover Buku
              </a>
            )}
            {proposal.publication_authenticity_proof && (
              <a
                href={proposal.publication_authenticity_proof}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition"
              >
                🛡️ Bukti Keaslian
              </a>
            )}
          </div>
        </div>
      </div>

      {proposal.publication_document && (
        <a
          href={proposal.publication_document}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
        >
          <StickyNote className="w-4 h-4  " />
          Lihat Draf Buku
        </a>
      )}

      {proposal.current_status_id === 7 && (
        <div className="space-pt-1">
          <p className="text-sm mb-2 text-gray-500">
            Cover buku dan bukti keaslian buku belum diunggah. Silahkan unggah
          </p>
          <ModalInputDocument proposal={proposal} />
        </div>
      )}
      {proposal.current_status_id === 11 && (
        <div className="space-pt-1">
          <p className="text-sm mb-2 text-gray-500">
            Cover buku / bukti keaslian perlu direvisi. Silahkan unggah
          </p>
          <ModalRevisionDocument proposal={proposal} />
        </div>
      )}
    </div>
  );
};

export default DetailProposalSection;
