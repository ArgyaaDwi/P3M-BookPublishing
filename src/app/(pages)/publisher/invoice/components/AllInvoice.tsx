"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormatter";
import { useRouter } from "next/navigation";
import BadgeStatus from "@/components/BadgeStatus";
import { Eye } from "lucide-react";
import { InvoiceType } from "@/types/invoiceTypes";
import LoadingIndicator from "@/components/Loading";
import TableHeader from "@/components/TableHeader";
const AllInvoicePublisher = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/publisher/invoice?status=all");
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
    fetchData();
  }, []);
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
                          : invoice.current_status_id === 2
                          ? "badgeRevText"
                          : "badgeSuccessText"
                      }
                      bgColor={
                        invoice.current_status_id === 1
                          ? "badgePending"
                          : invoice.current_status_id === 2
                          ? "badgeRev"
                          : "badgeSuccess"
                      }
                    />
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
                    </div>
                  </td>
                </tr>
              )
            )
          )
        ) : (
          <tr>
            <td colSpan={5} className="text-center p-4 text-gray-500">
              Tidak Ada Ajuan Penerbitan Buku.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default AllInvoicePublisher;
