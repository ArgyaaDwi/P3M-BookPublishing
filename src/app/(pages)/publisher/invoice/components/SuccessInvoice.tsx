"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormatter";
import { useRouter } from "next/navigation";
import BadgeStatus from "@/components/BadgeStatus";
import { Eye, Search } from "lucide-react";
import { InvoiceType } from "@/types/invoiceTypes";
import LoadingIndicator from "@/components/Loading";
import TableHeader from "@/components/TableHeader";
import ExportButton from "@/components/button/ExportButton";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CreateButton from "@/components/button/CreateButton";

const SuccessInvoicePublisher = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInvoices(invoices);
      return;
    }
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = invoices.filter((invoice) => {
      const formattedDate = invoice.createdAt.toString();
      return (
        (invoice.transaction_ticket &&
          invoice.transaction_ticket.toLowerCase().includes(searchTermLower)) ||
        (invoice.status?.status_name &&
          invoice.status?.status_name
            .toLowerCase()
            .includes(searchTermLower)) ||
        (invoice.createdAt &&
          formatDate(invoice.createdAt)
            .toLowerCase()
            .includes(searchTermLower)) ||
        (invoice.createdAt &&
          formattedDate.toLowerCase().includes(searchTermLower)) ||
        (invoice.id && invoice.id.toString().includes(searchTermLower))
      );
    });
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["No", "Kode Transaksi", "Tanggal Transaksi", "Status"]],
      body: filteredInvoices.map((invoice, index) => [
        index + 1,
        invoice.transaction_ticket,
        formatDate(invoice.createdAt),
        invoice.status?.status_name,
      ]),
    });

    doc.save("data-success-invoice.pdf");
  };
  const handleExportExcel = () => {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/v1/admin/invoices?status=success");
        const data = await res.json();
        console.log("Invoices:", data);
        setInvoices(data.data || []);
        setFilteredInvoices(data.data || []);
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
    <div>
      <div className="flex justify-between py-3">
        <div className="flex gap-2">
          <ExportButton type="pdf" onClick={handleExportPDF} />
          <ExportButton type="excel" onClick={handleExportExcel} />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari di semua kolom..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border text-primary  border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary w-64"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
          <CreateButton href="/publisher/invoice/create">
            + Buat Invoice
          </CreateButton>
        </div>
      </div>
      <table className="w-full text-left border border-gray-300 mt-2">
        <thead>
          <TableHeader
            columns={[
              "No",
              "Transaksi Tiket",
              "Tanggal Transaksi",
              "Status",
              "Bukti Pembayaran",
              "Aksi",
            ]}
          />
        </thead>
        <tbody>
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice, index) => (
              <tr key={invoice.id}>
                <td className="p-4 text-black border">{index + 1}</td>
                <td className="p-4 text-black border font-semibold">
                  {invoice.transaction_ticket}
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
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr key="empty">
              <td colSpan={5} className="p-4 text-center text-gray-500">
                {searchTerm
                  ? `Tidak ada invoice yang cocok dengan kata kunci "${searchTerm}"`
                  : "Tidak ada data invoice."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SuccessInvoicePublisher;
