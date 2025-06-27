"use client";
import { useEffect, useState } from "react";
import { InvoiceType } from "@/types/invoiceTypes";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/BreadCrumb";
import Tabs from "@/components/Tabs";
import LoadingIndicator from "@/components/Loading";
import DetailInvoiceSection from "../components/DetailInvoice";
import TransactionLogs from "@/components/invoice/LogTransaction";
const InvoiceDetailAdmin = () => {
  const { id } = useParams();
  const invoiceId = String(id);
  const [invoice, setInvoice] = useState<InvoiceType | null>(null);
  const [loading, setLoading] = useState(true);

  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { name: "Dashboard", url: "/admin/dashboard" },
    { name: "Invoice", url: "/admin/proposal" },
    { name: "Loading...", url: `/admin/invoice/${invoiceId}` },
  ]);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`/api/v1/admin/invoices/${invoiceId}`);
        const data = await res.json();
        console.log("Detail Invoice:", data);

        if (data.status === "success") {
          setInvoice(data.data || null);
          setBreadcrumbItems([
            { name: "Dashboard", url: "/admin/dashboard" },
            { name: "Invoice", url: "/admin/invoice" },
            {
              name: "Detail Invoice",
              url: `/admin/invoice/${invoiceId}`,
            },
          ]);
        } else {
          console.error("Failed to fetch data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  if (loading) return <LoadingIndicator />;
  if (!invoice)
    return (
      <p className="text-center text-gray-500">Invoice tidak ditemukan.</p>
    );
  const tabItems = [
    {
      title: "Overview",
      content: (
        <div className="p-4 bg-white rounded-xl shadow-md space-y-4">
          <DetailInvoiceSection invoice={invoice} />
        </div>
      ),
    },
    {
      title: "Log Invoice",
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
