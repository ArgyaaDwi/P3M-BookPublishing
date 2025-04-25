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
        Status Transaksi:{" "}
        {proposal.items && proposal.items.length > 0
          ? proposal.items
              .map(
                (item) =>
                  item.transaction?.status?.status_name ||
                  "Status Tidak Diketahui"
              )
              .filter((status, idx, self) => self.indexOf(status) === idx)
              .sort((a, b) => (a && b ? (a > b ? -1 : 1) : 0))[0]
          : "Belum ada transaksi"}
      </p>
    </div>
  );
};

export default DetailProposalSection;
