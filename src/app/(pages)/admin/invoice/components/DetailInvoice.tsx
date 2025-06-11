import React from "react";
import { InvoiceType } from "@/types/invoiceTypes";
import { formatDate } from "@/utils/dateFormatter";
import BadgeStatus from "@/components/BadgeStatus";
import { Eye } from "lucide-react";
import SubmitPaymentModal from "./ModalSubmitPayment";
import RevisionPaymentModal from "./ModalRevisionPayment";
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
      {invoice.is_shipped && (
        <div className="my-4">
          <p className="text-sm mb-2 text-gray-500">Sudah dikirim</p>
        </div>
      )}
      {invoice.payment_proof && (
        <div className="inline-flex">
          <a
            href={
              invoice.payment_proof.startsWith("http")
                ? invoice.payment_proof
                : `https://${invoice.payment_proof}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 border border-blue-200 rounded-lg transition-all duration-200 ease-in-out group"
          >
            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Lihat Bukti Pembayaran</span>
            <svg
              className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
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
          </a>
        </div>
      )}
      <div className="mt-2">
        {invoice.current_status_id === 1 && (
          <SubmitPaymentModal invoice={invoice} />
        )}
        {invoice.current_status_id === 4 && (
          <RevisionPaymentModal invoice={invoice} />
        )}
      </div>
      <div>
        <h2 className="text-lg font-medium text-black mt-4 mb-2">
          Item Transaksi:
        </h2>
        <div className="space-y-2">
          {invoice.items.map((item, index: number) => (
            <div
              key={index}
              className="p-3 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div>
                <p className="text-base font-semibold text-black">
                  {item.publication.publication_title}
                </p>
                <p className="text-sm text-gray-500">
                  Dosen: {item.publication.lecturer.name} NIDN{" "}
                  {item.publication.lecturer.nidn}
                </p>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <p className="text-sm text-gray-600">
                  Biaya: Rp{item.cost.toLocaleString("id-ID")}
                </p>
                <p className="text-sm text-gray-600">Jumlah: {item.quantity}</p>
                <p className="text-sm font-semibold text-black">
                  Total: Rp{item.total_cost.toLocaleString("id-ID")}
                </p>
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
