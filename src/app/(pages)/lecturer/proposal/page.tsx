"use client";
import Breadcrumb from "@/components/BreadCrumb";
import Tabs from "@/components/Tabs";
import Link from "next/link";
import ApproveProposal from "./components/ApproveProposal";
import RevisionProposal from "./components/RevisionProposal";
import AllProposal from "./components/AllProposall";
import { ChartBar, FileText } from "lucide-react";

export default function ProposalPage() {
  const tabItems = [
    {
      title: "Semua Ajuan",
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
            <Link href="/lecturer/proposal/create">
              <button className="bg-secondary text-black px-3 py-2 font-semibold rounded-lg hover:text-white hover:bg-primary transition-all duration-300">
                + Buat Ajuan
              </button>
            </Link>
          </div>
          <AllProposal />
        </div>
      ),
    },
    {
      title: "Status Revisi",
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
            <Link href="/lecturer/proposal/create">
              <button className="bg-secondary text-black px-3 py-2 font-semibold rounded-lg hover:text-white hover:bg-primary transition-all duration-300">
                + Buat Ajuan
              </button>
            </Link>
          </div>
          <RevisionProposal />
        </div>
      ),
    },
    {
      title: "Status Diterima",
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
            <Link href="/lecturer/proposal/create">
              <button className="bg-secondary text-black px-3 py-2 font-semibold rounded-lg hover:text-white hover:bg-primary transition-all duration-300">
                + Buat Ajuan
              </button>
            </Link>
          </div>
          <ApproveProposal />
        </div>
      ),
    },
  ];

  const breadcrumbItems = [
    {
      name: "Dashboard",
      url: "/lecturer/dashboard",
    },
    {
      name: "Ajuan",
      url: "/lecturer/proposal",
    },
  ];

  return (
    <div>
      <Breadcrumb
        title="Halaman Proposal Ajuan"
        breadcrumbItems={breadcrumbItems}
      />
      <div className="bg-white rounded-lg mt-3 overflow-hidden px-4 pb-4">
        <Tabs tabs={tabItems} />
      </div>
    </div>
  );
}
