"use client";
import Breadcrumb from "@/components/BreadCrumb";
import Tabs from "@/components/Tabs";
import Link from "next/link";
import ApproveProposal from "./components/ApproveProposal";
import RevisionProposal from "./components/RevisionProposal";
import AllProposal from "./components/AllProposall";

export default function ProposalPage() {
  const tabItems = [
    {
      title: "Semua Ajuan",
      content: (
        <div>
          <h3 className="text-black font-bold">Konten untuk Semua Ajuan</h3>
          <AllProposal />
        </div>
      ),
    },
    {
      title: "Status Revisi",
      content: (
        <div>
          <h3 className="text-black font-bold">Konten untuk Status Revisi</h3>
          <RevisionProposal />
        </div>
      ),
    },
    {
      title: "Status Diterima",
      content: (
        <div>
          <h3 className="text-black font-bold">Konten untuk Status Diterima</h3>
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
        <div className="flex justify-start py-3">
          <Link href="/lecturer/proposal/create">
            <button className="bg-secondary text-black px-3 py-2 font-semibold rounded-lg hover:text-white hover:bg-primary transition-all duration-300">
              + Buat Ajuan
            </button>
          </Link>
        </div>
        <Tabs tabs={tabItems} />
      </div>
    </div>
  );
}
