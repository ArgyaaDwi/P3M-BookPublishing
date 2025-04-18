"use client";

import Breadcrumb from "@/components/BreadCrumb";
import Tabs from "@/components/Tabs";
import AllInvoiceAdmin from "./components/AllInvoice";
import VerifyInvoiceAdmin from "./components/VerifyInvoice";
import SuccessInvoiceAdmin from "./components/SuccessInvoice";
import { ChartBar, FileText } from "lucide-react";
// import Example from "@/components/tables/TestTable";
export default function InvoicePageAdmin() {
  const tabItems = [
    {
      title: "Semua Transaksi",
      content: (
        <div>
          <div className="flex justify-between pb-2">
            <div className="flex gap-2">
              <button className="bg-white border border-gray-500 text-gray-500 px-3 py-2 font-semibold rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Export PDF
              </button>
              <button className="bg-white border border-green-500 text-green-500 px-3 py-2 font-semibold rounded-lg hover:bg-green-500 hover:text-white transition-all duration-300 flex items-center gap-2">
                <ChartBar className="w-5 h-5" />
                Export Excel
              </button>
            </div>
          </div>
          <AllInvoiceAdmin />
        </div>
      ),
    },
    {
      title: "Revisi Bukti",
      content: (
        <div>
          <div className="flex justify-between pb-2">
            <div className="flex gap-2">
              <button className="bg-white border border-gray-500 text-gray-500 px-3 py-2 font-semibold rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Export PDF
              </button>
              <button className="bg-white border border-green-500 text-green-500 px-3 py-2 font-semibold rounded-lg hover:bg-green-500 hover:text-white transition-all duration-300 flex items-center gap-2">
                <ChartBar className="w-5 h-5" />
                Export Excel
              </button>
            </div>
          </div>
          <VerifyInvoiceAdmin />
        </div>
      ),
    },
    {
      title: "Transaksi Berhasil",
      content: (
        <div>
          <div className="flex justify-between pb-2">
            <div className="flex gap-2">
              <button className="bg-white border border-gray-500 text-gray-500 px-3 py-2 font-semibold rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Export PDF
              </button>
              <button className="bg-white border border-green-500 text-green-500 px-3 py-2 font-semibold rounded-lg hover:bg-green-500 hover:text-white transition-all duration-300 flex items-center gap-2">
                <ChartBar className="w-5 h-5" />
                Export Excel
              </button>
            </div>
          </div>
          <SuccessInvoiceAdmin />
        </div>
      ),
    },
  ];

  const breadcrumbItems = [
    {
      name: "Dashboard",
      url: "/admin/dashboard",
    },
    {
      name: "Invoice",
      url: "/admin/invoice",
    },
  ];

  return (
    <div>
      <Breadcrumb title="Halaman Invoice" breadcrumbItems={breadcrumbItems} />
      <div className="bg-white rounded-lg mt-3">
        <Tabs tabs={tabItems} />
      </div>
    </div>
  );
}
