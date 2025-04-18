"use client";
import { useEffect, useState } from "react";
import { InvoiceType } from "@/types/invoiceTypes";
import { useParams } from "next/navigation";
import { Eye } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import Tabs from "@/components/Tabs";
import { formatDate } from "@/utils/dateFormatter";
import LoadingIndicator from "@/components/Loading";
import BadgeStatus from "@/components/BadgeStatus";
import TransactionLogs from "../components/TransactionLogs";
const InvoiceDetailAdmin = () => {
  const { id } = useParams();
  const invoiceId = String(id);
  const [invoice, setInvoice] = useState<InvoiceType | null>(null);
  const [loading, setLoading] = useState(true);
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { name: "Dashboard", url: "/publisher/dashboard" },
    { name: "Invoice", url: "/publisher/proposal" },
    { name: "Loading...", url: `/publisher/publisher/${invoiceId}` },
  ]);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`/api/publisher/invoice/${invoiceId}`);
        const data = await res.json();
        console.log("Detail Invoice:", data);

        if (data.status === "success") {
          setInvoice(data.data || null);
          setBreadcrumbItems([
            { name: "Dashboard", url: "/publisher/dashboard" },
            { name: "Invoice", url: "/publisher/invoice" },
            {
              name: data.id,
              url: `/publisher/lecturer/${invoiceId}`,
            },
          ]);
        } else {
          console.error("Failed to fetch proposal:", data.message);
        }
      } catch (error) {
        console.error("Error fetching proposal:", error);
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  if (loading) return <LoadingIndicator />;
  if (!invoice)
    return <p className="text-center text-gray-500">Ajuan tidak ditemukan.</p>;
  const tabItems = [
    {
      title: "Informasi Invoice",
      content: (
        <div className="p-4 bg-white rounded-xl shadow-md space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-black">
              Invoice #{invoice.id}
            </h1>
            <p className="text-sm text-gray-600">
              Diajukan pada: {formatDate(invoice.createdAt)}
            </p>
            {invoice.transaction_notes && (
              <p className="text-gray-800 mt-1">
                Catatan Transaksi: {invoice.transaction_notes}
              </p>
            )}
          </div>

          <BadgeStatus
            text={invoice.status?.status_name || "Status Tidak Diketahui"}
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
              Item Transaksi
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
                      Dosen Penulis: {item.publication.lecturer.name} NIDN.
                      {item.publication.lecturer.nidn}
                    </p>
                  </div>
                  <div className="text-right mt-2 sm:mt-0">
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
      ),
    },
    {
      title: "Log Aktivitas",
      content: (
        <div>
          <h3 className="text-black font-bold">Log Invoice</h3>
          <TransactionLogs id={invoice.id} />
        </div>
      ),
    },
  ];
  return (
    <div>
      <Breadcrumb title="Detail Invoice" breadcrumbItems={breadcrumbItems} />
      <div className="bg-white rounded-lg mt-3 overflow-hidden pb-4">
        <Tabs tabs={tabItems} />
      </div>
    </div>
  );
};

export default InvoiceDetailAdmin;
