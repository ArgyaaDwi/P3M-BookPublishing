"use client";
import Breadcrumb from "@/components/BreadCrumb";
import Tabs from "@/components/Tabs";
import ApprovedProposal from "./components/ApprovedProposal";
import RevisedProposal from "./components/RevisedProposal";
import AllProposal from "./components/AllProposall";

export default function ProposalPage() {
  const tabItems = [
    {
      title: "Semua Ajuan",
      content: (
        <div>
          <AllProposal />
        </div>
      ),
    },
    {
      title: "Status Revisi",
      content: (
        <div>
          <RevisedProposal />
        </div>
      ),
    },
    {
      title: "Status Diterima",
      content: (
        <div>
          <ApprovedProposal />
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
        title="Halaman Ajuan Buku"
        breadcrumbItems={breadcrumbItems}
      />
      <div className="bg-white rounded-lg mt-3 overflow-hidden px-4 pb-4">
        <Tabs tabs={tabItems} />
      </div>
    </div>
  );
}
