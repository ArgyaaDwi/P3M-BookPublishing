"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormatter";
import { useRouter } from "next/navigation";
import { Eye, Search } from "lucide-react";
import { InvoiceType } from "@/types/invoiceTypes";
import { exportToPDF } from "@/utils/exportToPDF";
import { exportToExcel } from "@/utils/exportToExcel";
import Pagination from "@/components/Pagination";
import BadgeStatus from "@/components/BadgeStatus";
import LoadingIndicator from "@/components/Loading";
import TableHeader from "@/components/TableHeader";
import ExportButton from "@/components/button/ExportButton";

const VerifyInvoiceAdmin = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // Variabel state untuk halaman dan jumlah item per halaman
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleExportPDF = () => {
    const headers = [["No", "Kode Transaksi", "Tanggal Transaksi", "Status"]];

    const body = paginatedInvoices.map((invoice, index) => [
      (currentPage - 1) * itemsPerPage + index + 1,
      invoice.transaction_ticket,
      formatDate(invoice.createdAt),
      invoice.status?.status_name,
    ]);

    exportToPDF({
      head: headers,
      body: body,
      filename: `data-verify-invoice-halaman-${currentPage}`,
    });
  };

  const handleExportExcel = () => {
    const data = invoices.map((invoice, index) => ({
      No: index + 1,
      "Kode Transaksi": invoice.transaction_ticket,
      "Tanggal Transaksi": formatDate(invoice.createdAt),
      Status: invoice.status?.status_name,
    }));
    exportToExcel(data, "semua-invoice-verify");
  };
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInvoices(invoices);
      setCurrentPage(1);
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
    setCurrentPage(1);
  }, [searchTerm, invoices]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/v1/admin/invoices?status=waiting");
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
      <div className="flex justify-between pb-2">
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
              "Aksi",
            ]}
          />
        </thead>
        <tbody>
          {paginatedInvoices.length > 0 ? (
            paginatedInvoices.map((invoice, index) => (
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
      <Pagination
        currentPage={currentPage}
        totalItems={filteredInvoices.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(limit) => {
          setItemsPerPage(limit);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

export default VerifyInvoiceAdmin;
