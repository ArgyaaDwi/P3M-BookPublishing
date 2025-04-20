import { InvoiceType } from "@/types/invoiceTypes";
import { formatDate } from "@/utils/dateFormatter";
import BadgeStatus from "@/components/BadgeStatus";
import { Eye } from "lucide-react";
const DetailInvoiceSection = ({ invoice }: { invoice: InvoiceType }) => {
  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold text-black">
          Invoice #{invoice.transaction_ticket}
        </h1>
        <p className="mb-2 text-sm text-gray-600">
          Dibuat pada: {formatDate(invoice.createdAt)}
        </p>
        <BadgeStatus
          text={invoice.status?.status_name || "Status Tidak Diketahui"}
          color={
            invoice.current_status_id === 1
              ? "badgePendingText"
              : invoice.current_status_id === 3 ||
                invoice.current_status_id === 4
              ? "badgeRevText"
              : "badgeSuccessText"
          }
          bgColor={
            invoice.current_status_id === 1
              ? "badgePending"
              : invoice.current_status_id === 3 ||
                invoice.current_status_id === 4
              ? "badgeRev"
              : "badgeSuccess"
          }
        />
        {invoice.transaction_notes && (
          <p className="my-2 text-gray-800">
            Catatan Transaksi: {invoice.transaction_notes}
          </p>
        )}
      </div>

      {invoice.payment_proof && (
        <a
          href={
            invoice.payment_proof.startsWith("http")
              ? invoice.payment_proof
              : `https://${invoice.payment_proof}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-s flex items-center gap-1"
        >
          <Eye className="w-4 h-4" />
          Bukti Pembayaran
        </a>
      )}
      <div>
        <h2 className="text-lg font-medium text-black mt-4 mb-2">
          Item Transaksi:
        </h2>
        <div className="space-y-2">
          {invoice.items.map((item, index: number) => (
            <div
              key={index}
              className="p-4 border rounded-xl bg-white shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center"
            >
              {/* kiri */}
              <div className="flex-[2] min-w-[220px]">
                <p className="text-base font-semibold text-black">
                  {item.publication.publication_title}
                </p>
                <p className="text-sm text-gray-500">
                  Dosen Penulis: {item.publication.lecturer.name} - NIDN.{" "}
                  {item.publication.lecturer.nidn}
                </p>
              </div>
              {/* kanan */}
              <div className="flex-[2] flex flex-col gap-2">
                {/* biaya */}
                <div className="flex gap-6 flex-wrap sm:flex-nowrap">
                  <p className="text-sm text-gray-600">
                    Biaya: Rp{item.cost.toLocaleString("id-ID")}
                  </p>
                  <p className="text-sm text-gray-600">
                    Jumlah: {item.quantity}
                  </p>
                  <p className="text-sm font-semibold text-black">
                    Total: Rp{item.total_cost.toLocaleString("id-ID")}
                  </p>
                </div>
                {/* dokumen */}
                {invoice.current_status_id === 2 && (
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Cover */}
                    <div className="flex-1">
                      <label className="text-gray-800 block text-sm font-medium mb-1">
                        Upload Cover Buku
                      </label>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFileChange(
                            item.id,
                            "cover",
                            e.target.files?.[0]
                          )
                        }
                        className="block w-full text-sm text-gray-700
        file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0
        file:bg-indigo-50 file:text-indigo-700
        hover:file:bg-indigo-100"
                      />
                    </div>

                    {/* Bukti Keaslian */}
                    <div className="flex-1">
                      <label className="text-gray-800 block text-sm font-medium mb-1">
                        Upload Bukti Keaslian
                      </label>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFileChange(
                            item.id,
                            "proof",
                            e.target.files?.[0]
                          )
                        }
                        className="block w-full text-sm text-gray-700
        file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0
        file:bg-indigo-50 file:text-indigo-700
        hover:file:bg-indigo-100"
                      />
                    </div>
                  </div>
                )}

                {/* Tombol Simpan */}
                {invoice.current_status_id === 2 && (
                  <div className="mt-1">
                    <button
                      onClick={() => handleSubmitUpload(item.id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
                    >
                      Simpan
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          <p className="text-lg font-semibold text-black text-right">
            Total Keseluruhan: Rp
            {invoice.items
              .reduce((acc: number, item) => acc + item.total_cost, 0)
              .toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailInvoiceSection;
