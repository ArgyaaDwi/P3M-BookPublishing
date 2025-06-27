"use client";
import Breadcrumb from "@/components/BreadCrumb";
import Tabs from "@/components/Tabs";
import AllInvoicePublisher from "./components/AllInvoice";
import VerifyInvoicePublisher from "./components/VerifyInvoice";
import SuccessInvoicePublisher from "./components/SuccessInvoice";
import WaitingInvoicePublisher from "./components/WaitingInvoice";
const breadcrumbItems = [
  {
    name: "Dashboard",
    url: "/publisher/dashboard",
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
      title: "Menunggu Pembayaran",
      content: (
        <div>
          <WaitingInvoicePublisher />
        </div>
      ),
    },
    {
      title: "Butuh Verifikasi",
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
