import Breadcrumb from "@/components/BreadCrumb";
import Tabs from "@/components/Tabs";

export default function ProposalPage() {
  const tabItems = [
    {
      title: "Semua Ajuan",
      content: (
        <div className="text-black font-bold">Konten untuk Semua Ajuan</div>
      ),
    },
    {
      title: "Status Revisi",
      content: (
        <div className="text-black font-bold">
          Konten untuk Ajuan yang Statusnya Revisi Awokawok Mampus
        </div>
      ),
    },
    {
      title: "Status Diterima",
      content: (
        <div className="text-black font-bold">
          Konten untuk Ajuan yang Statusnya Diterima Cie Congrats
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
      name: "Proposal",
      url: "/admin/proposal",
    },
  ];
  return (
    <div>
      <Breadcrumb title="Halaman Proposal" breadcrumbItems={breadcrumbItems} />
      <div className="bg-white rounded-lg mt-3">
        <Tabs tabs={tabItems} />
      </div>
    </div>
  );
}
