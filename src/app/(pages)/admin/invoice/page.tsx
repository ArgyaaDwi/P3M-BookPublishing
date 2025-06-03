"use client";
import Breadcrumb from "@/components/BreadCrumb";
import Tabs from "@/components/Tabs";
import AllInvoiceAdmin from "./components/AllInvoice";
import VerifyInvoiceAdmin from "./components/VerifyInvoice";
import SuccessInvoiceAdmin from "./components/SuccessInvoice";
// import Example from "@/components/tables/TestTable";
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

export default function InvoicePageAdmin() {
  const tabItems = [
    {
      title: "Semua Transaksi",
      content: (
        <div>
          <AllInvoiceAdmin />
        </div>
      ),
    },
    {
      title: "Revisi Bukti",
      content: (
        <div>
          <VerifyInvoiceAdmin />
        </div>
      ),
    },
    {
      title: "Transaksi Berhasil",
      content: (
        <div>
          <SuccessInvoiceAdmin />
        </div>
      ),
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
