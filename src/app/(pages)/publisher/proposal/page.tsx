"use client";

import Breadcrumb from "@/components/BreadCrumb";
import Tabs from "@/components/Tabs";
import AllProposalPublisher from "./components/AllProposal";
import ApprovedProposalPublisher from "./components/ApprovedProposal";
import RevisedProposalPublisher from "./components/RevisedProposal";
import VerifyProposalPublisher from "./components/VerifyProposal";
import { ChartBar, FileText } from "lucide-react";
// import Example from "@/components/tables/TestTable";
export default function ProposalPage() {
  const tabItems = [
    {
      title: "Semua Ajuan",
      content: (
        <div>
          <div className="flex gap-2 pb-2">
            <button className="bg-white border border-gray-500 text-gray-500 px-3 py-2 font-semibold rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Export PDF
            </button>
            <button className="bg-white border border-green-500 text-green-500 px-3 py-2 font-semibold rounded-lg hover:bg-green-500 hover:text-white transition-all duration-300 flex items-center gap-2">
              <ChartBar className="w-5 h-5" />
              Export Excel
            </button>
          </div>{" "}
          {/* <Example /> */}
          <AllProposalPublisher />
        </div>
      ),
    },
    {
      title: "Butuh Verifikasi",
      content: (
        <div>
          <div className="flex gap-2 pb-2">
            <button className="bg-white border border-gray-500 text-gray-500 px-3 py-2 font-semibold rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Export PDF
            </button>
            <button className="bg-white border border-green-500 text-green-500 px-3 py-2 font-semibold rounded-lg hover:bg-green-500 hover:text-white transition-all duration-300 flex items-center gap-2">
              <ChartBar className="w-5 h-5" />
              Export Excel
            </button>
          </div>{" "}
          <VerifyProposalPublisher />
        </div>
      ),
    },
    {
      title: "Status Revisi",
      content: (
        <div>
          <div className="flex gap-2 pb-2">
            <button className="bg-white border border-gray-500 text-gray-500 px-3 py-2 font-semibold rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Export PDF
            </button>
            <button className="bg-white border border-green-500 text-green-500 px-3 py-2 font-semibold rounded-lg hover:bg-green-500 hover:text-white transition-all duration-300 flex items-center gap-2">
              <ChartBar className="w-5 h-5" />
              Export Excel
            </button>
          </div>{" "}
          <RevisedProposalPublisher />
        </div>
      ),
    },
    {
      title: "Status Diterima",
      content: (
        <div>
          <div className="flex gap-2 pb-2">
            <button className="bg-white border border-gray-500 text-gray-500 px-3 py-2 font-semibold rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Export PDF
            </button>
            <button className="bg-white border border-green-500 text-green-500 px-3 py-2 font-semibold rounded-lg hover:bg-green-500 hover:text-white transition-all duration-300 flex items-center gap-2">
              <ChartBar className="w-5 h-5" />
              Export Excel
            </button>
          </div>{" "}
          <ApprovedProposalPublisher />
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
      name: "Ajuan",
      url: "/admin/proposal",
    },
  ];

  return (
    <div>
      <Breadcrumb
        title="Halaman Ajuan Buku"
        breadcrumbItems={breadcrumbItems}
      />
      <div className="bg-white rounded-lg mt-3">
        <Tabs tabs={tabItems} />
      </div>
    </div>
  );
}
