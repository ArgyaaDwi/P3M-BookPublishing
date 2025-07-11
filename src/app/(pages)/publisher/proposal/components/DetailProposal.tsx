import { StickyNote } from "lucide-react";
import { PublicationType } from "@/types/publicationTypes";
import { formatDate } from "@/utils/dateFormatter";
import BadgeStatus from "@/components/BadgeStatus";
import ModalInputDocument from "./ModalInputDocument";
import ModalRevisionDocument from "./ModalRevisionDocument";
import ModalVerifyStatus from "./ModalVerify";
import ModalInputFinalDoc from "./ModalInputFinalDoc";
import ModalRevisionFinalDoc from "./ModalRevisionFinalDoc";
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
        <p className="text-md text-gray-800">
          Penerbit: {proposal.publisher?.name || "Belum Ada Penerbit"}
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

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700"> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
        <div>
          <p className="text-gray-500">Dosen Pengusul</p>
          <p className="font-medium text-gray-800">
            {proposal.lecturer?.name || "Tidak diketahui"} NIDN.{" "}
            {proposal.lecturer?.nidn || "-"}
          </p>
          <p className="text-gray-800 mt-2">
            Email Pengusul: {proposal.lecturer.email}
          </p>
          <p className="text-gray-800">
            No. Telefon: {proposal.lecturer.phone_number || "-"}
          </p>
          {proposal.status_transaction && (
            <p className="text-gray-700 mt-2 font-mono">
              Status Transaksi:{" "}
              {proposal.status_transaction?.status_name ??
                "Belum Ada Transaksi"}
            </p>
          )}
          <div className="my-4">
            {proposal.publication_book_cover && (
              <div className="space-y-2">
                <div className="overflow-hidden border shadow-sm max-w-[300px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proposal.publication_book_cover}
                    alt="Cover Buku"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <a
                  href={`${proposal.publication_book_cover.replace(
                    "/upload/",
                    "/upload/fl_attachment/"
                  )}`}
                  className="inline-block px-3 py-1 bg-sky-600 text-white text-sm rounded-md hover:bg-sky-700 transition"
                >
                  ⬇️ Download Cover Buku
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-400">
            Ajuan Dibuat: {formatDate(proposal.createdAt)}
          </p>
          {/* <div className="flex flex-wrap gap-2 py-4">
            {proposal.publication_book_cover && (
              <a
                href={proposal.publication_book_cover}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium hover:bg-sky-200 transition"
              >
                📚 File Cover Buku
              </a>
            )}
            {proposal.publication_authenticity_proof && (
              <a
                href={proposal.publication_authenticity_proof}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium hover:bg-teal-200 transition"
              >
                🛡️ Bukti Keaslian
              </a>
            )}
          </div> */}
          <div className="flex flex-wrap gap-2 pt-4">
            {proposal.publication_book_cover && (
              <a
                href={proposal.publication_book_cover}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium hover:bg-sky-200 transition"
              >
                📚 Lihat Cover Buku
              </a>
            )}
            {proposal.publication_authenticity_proof && (
              <a
                href={proposal.publication_authenticity_proof}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium hover:bg-emerald-200 transition"
              >
                🛡️ Bukti Keaslian
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
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
        {proposal.publication_final_book && (
          <a
            href={proposal.publication_final_book}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-6 py-3 bg-green-50 border border-green-200 rounded-xl hover:from-green-100 hover:to-indigo-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg"
          >
            <div className="relative flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg ">
              <StickyNote className="w-5 h-5 text-green-600 group-hover:text-green-700 " />
            </div>
            <div className="flex flex-col relative">
              <span className="font-semibold text-green-700 group-hover:text-green-800 transition-colors duration-300">
                Lihat File Final Buku
              </span>
              <span className="text-xs text-green-500 group-hover:text-green-600 transition-colors duration-300">
                Klik untuk melihat dokumen
              </span>
            </div>
            <div className="relative ml-auto">
              <svg
                className="w-4 h-4 text-green-600 group-hover:text-green-700 "
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
      </div>
      {proposal.current_status_id === 8 &&
        proposal.current_transaction_status_id === 2 &&
        proposal.publication_final_book == null && (
          <div className="space-pt-1">
            <p className="text-sm mb-2 text-gray-500">
              Dokumen akhir ajuan penerbitan buku belum diunggah. Silahkan
              unggah
            </p>
            <ModalInputFinalDoc proposal={proposal} />
          </div>
        )}
      {proposal.current_status_id === 8 &&
        proposal.current_transaction_status_id === 2 &&
        proposal.publication_final_book != null && (
          <div className="space-pt-1">
            <p className="text-sm mb-2 text-gray-500">
              Unggah revisi dokumen akhir ajuan penerbitan buku bila diperlukan
            </p>
            <ModalRevisionFinalDoc proposal={proposal} />
          </div>
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
      {(proposal.current_status_id === 5 ||
        proposal.current_status_id === 9) && (
        <ModalVerifyStatus proposal={proposal} />
      )}
    </div>
  );
};
export default DetailProposalSection;
