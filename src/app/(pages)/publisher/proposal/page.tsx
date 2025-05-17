"use client";
import Breadcrumb from "@/components/BreadCrumb";
import Tabs from "@/components/Tabs";
import AllProposalPublisher from "./components/AllProposal";
import ApprovedProposalPublisher from "./components/ApprovedProposal";
import RevisedProposalPublisher from "./components/RevisedProposal";
import VerifyProposalPublisher from "./components/VerifyProposal";
// import Example from "@/components/tables/TestTable";
export default function ProposalPage() {
  const tabItems = [
    {
      title: "Semua Ajuan",
      content: (
        <div>
          {/* <Example /> */}
          <AllProposalPublisher />
        </div>
      ),
    },
    {
      title: "Butuh Verifikasi",
      content: (
        <div>
          <VerifyProposalPublisher />
        </div>
      ),
    },
    {
      title: "Status Revisi",
      content: (
        <div>
          <RevisedProposalPublisher />
        </div>
      ),
    },
    {
      title: "Status Diterima",
      content: (
        <div>
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
