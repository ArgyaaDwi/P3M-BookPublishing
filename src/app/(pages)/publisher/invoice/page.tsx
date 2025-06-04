"use client";
import Breadcrumb from "@/components/BreadCrumb";
import Tabs from "@/components/Tabs";
import AllInvoicePublisher from "./components/AllInvoice";
import VerifyInvoicePublisher from "./components/VerifyInvoice";
import SuccessInvoicePublisher from "./components/SuccessInvoice";

const breadcrumbItems = [
  {
    name: "Dashboard",
    url: "/admin/dashboard",
  },
  {
    name: "Invoice",
    url: "/publisher/invoice",
  },
];

export default function InvoicePage() {
  const tabItems = [
    {
      title: "Semua Transaksi",
      content: (
        <div>
          <AllInvoicePublisher />
        </div>
      ),
    },
    {
      title: "Menunggu Verifikasi",
      content: (
        <div>
          <VerifyInvoicePublisher />
        </div>
      ),
    },
    {
      title: "Transaksi Berhasil",
      content: (
        <div>
          <SuccessInvoicePublisher />
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
