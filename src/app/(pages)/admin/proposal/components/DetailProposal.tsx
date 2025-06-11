import { PublicationType } from "@/types/publicationTypes";
import { formatDate } from "@/utils/dateFormatter";
import BadgeStatus from "@/components/BadgeStatus";
import { StickyNote } from "lucide-react";
import ModalStatus from "./ModalVerifyStatus";
import ModalPublisher from "./ModalAssignPublisher";
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
            {proposal.lecturer?.name || "Tidak diketahui"} NIDN.{" "}
            {proposal.lecturer?.nidn || "-"}
          </p>
          {proposal.status_transaction && (
            <p className="text-gray-700 mt-2 font-mono">
              Status Transaksi:{" "}
              {proposal.status_transaction?.status_name ??
                "Belum Ada Transaksi"}
            </p>
          )}
        </div>

        <div className="space-y-2">
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
          className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
        >
          <div className="relative flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg ">
            <StickyNote className="w-5 h-5 text-blue-600 group-hover:text-blue-700 " />
          </div>
          <div className="flex flex-col relative">
            <span className="font-semibold text-blue-700 group-hover:text-blue-800 transition-colors duration-300">
              Lihat Draf Buku
            </span>
            <span className="text-xs text-blue-500 group-hover:text-blue-600 transition-colors duration-300">
              Klik untuk melihat dokumen
            </span>
          </div>
          <div className="relative ml-auto">
            <svg
              className="w-4 h-4 text-blue-600 group-hover:text-blue-700 "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </a>
      )}
      {(proposal.current_status_id === 1 ||
        proposal.current_status_id === 4) && (
        <ModalStatus proposal={proposal} />
      )}
      {proposal.current_status_id === 3 && (
        <ModalPublisher proposal={proposal} />
      )}
    </div>
  );
};

export default DetailProposalSection;
