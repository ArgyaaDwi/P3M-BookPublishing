"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormatter";
import { useRouter } from "next/navigation";
import BadgeStatus from "@/components/BadgeStatus";
import { Eye } from "lucide-react";
import ModalVerifyInvoice from "./ModalVerify";
import { InvoiceType } from "@/types/invoiceTypes";
import LoadingIndicator from "@/components/Loading";
import TableHeader from "@/components/TableHeader";
const VerifyInvoicePublisher = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const res = await fetch("/api/publisher/invoice?status=waiting");
      const data = await res.json();
      console.log("Invoices:", data);
      setInvoices(data.data || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleVerifiyPayment = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin verifikasi bukti pembayaran ini?")) {
      return;
    }
    try {
      const response = await fetch(
        `/api/publisher/invoice/verify-payment/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
      const result = await response.json();
      if (result.status === "success") {
        alert("Status berhasil diperbarui.");
      } else {
        alert("Gagal mengupdate status: " + result.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Terjadi kesalahan saat mengupdate status.");
    }
  };
  if (loading) return <LoadingIndicator />;
  return (
    <table className="w-full text-left border border-gray-300 mt-2">
      <thead>
        <TableHeader
          columns={[
            "No",
            "ID Transaksi",
            "Tanggal Transaksi",
            "Status",
            "Bukti Pembayaran",
            "Aksi",
          ]}
        />
      </thead>
      <tbody>
        {invoices.length > 0 ? (
          invoices.map(
            (invoice, index) => (
              console.log("Invoice:", invoice),
              (
                <tr key={invoice.id}>
                  <td className="p-4 text-black border">{index + 1}</td>
                  <td className="p-4 text-black border font-semibold">
                    {invoice.id}
                  </td>
                  <td className="p-4 text-black border ">
                    {formatDate(invoice.createdAt)}
                  </td>
                  <td className="p-4 text-black border">
                    <BadgeStatus
                      text={
                        invoice.status?.status_name || "Status Tidak Diketahui"
                      }
                      color={
                        invoice.current_status_id === 1
                          ? "badgePendingText"
                          : invoice.current_status_id === 3
                          ? "badgeRevText"
                          : "badgeSuccessText"
                      }
                      bgColor={
                        invoice.current_status_id === 1
                          ? "badgePending"
                          : invoice.current_status_id === 3
                          ? "badgeRev"
                          : "badgeSuccess"
                      }
                    />
                  </td>
                  <td className="p-4 text-black border">
                    {invoice.payment_proof ? (
                      <a
                        href={
                          invoice.payment_proof.startsWith("http")
                            ? invoice.payment_proof
                            : `https://${invoice.payment_proof}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex"
                      >
                        Cek Bukti Pembayaran
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-4 text-black border">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          router.push(`/publisher/invoice/${invoice.id}`)
                        }
                        className="bg-blue-100 p-2 rounded-lg text-blue-500 hover:text-blue-800"
                      >
                        <Eye />
                      </button>
                      {invoice.current_status_id === 3 && (
                        <ModalVerifyInvoice invoice={invoice} />
                      )}
                    </div>
                  </td>
                </tr>
              )
            )
          )
        ) : (
          <tr>
            <td colSpan={6} className="text-center p-4 text-gray-500">
              Tidak Ada Invoice.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default VerifyInvoicePublisher;
