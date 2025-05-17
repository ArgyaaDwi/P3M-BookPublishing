import Breadcrumb from "@/components/BreadCrumb";
import Tabs from "@/components/Tabs";
import AllProposalAdmin from "./components/AllProposal";
import ApprovedProposalAdmin from "./components/ApprovedProposal";
import RevisedProposalAdmin from "./components/RevisedProposal";
import VerifyProposalAdmin from "./components/VerifyProposal";
// import AllProposalAdmisn from "@/components/tables/TestTable";
export default function ProposalPage() {
  const tabItems = [
    {
      title: "Semua Ajuan",
      content: (
        <div>
          <AllProposalAdmin />
        </div>
      ),
    },
    {
      title: "Butuh Verifikasi",
      content: (
        <div>
          <VerifyProposalAdmin />
        </div>
      ),
    },
    {
      title: "Status Revisi",
      content: (
        <div>
          <RevisedProposalAdmin />
        </div>
      ),
    },
    {
      title: "Status Diterima",
      content: (
        <div>
          <ApprovedProposalAdmin />
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
        title="Halaman Ajuan Penerbitan"
        breadcrumbItems={breadcrumbItems}
      />
      <div className="bg-white rounded-lg mt-3">
        <Tabs tabs={tabItems} />
      </div>
    </div>
  );
}
