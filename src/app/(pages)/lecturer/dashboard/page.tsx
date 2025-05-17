import prisma from "@/lib/prisma";
import CardChart from "@/components/card/CardChart";
import Card from "@/components/card/Card";
import { Files, CircleAlert, FilePenLine, CircleCheckBig } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import DoughnutChart from "@/components/chart/DoughnutChart";
import LatestProposals from "../components/LatestProposals";
export default async function DashboardLecturerPage() {
  const totalMyProposal = await prisma.publication.count({
    where: {
      lecturer: {
        id: 8,
      },
    },
  });
  const breadcrumbItems = [
    {
      name: "Dashboard",
      url: "/dashboard",
    },
  ];
  return (
    <div>
      <Breadcrumb
        title="Hai, Dosen Penulis"
        breadcrumbItems={breadcrumbItems}
      />
      <p className="text-gray-600">Ajukan Penerbitan Buku Sekarang!</p>
      <p className="text-black mt-4 font-semibold">Overview</p>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-2">
        <Card
          icon={<Files color="gray" />}
          text="Ajuan Saya"
          count={6}
          color="#63C2EB"
          url="/admin/lecturer"
        />
        <Card
          icon={<CircleAlert color="gray" />}
          text="Ajuan Belum Diverifikasi"
          count={totalMyProposal}
          color="#E2E557"
          url="/admin/proposal"
        />
        <Card
          icon={<CircleCheckBig color="gray" />}
          text="Ajuan Disetujui"
          count={19}
          color="#81C3C7"
          url="/admin/publisher"
        />
        <Card
          icon={<FilePenLine color="gray" />}
          text="Ajuan Revisi"
          count={12}
          color="#1448CD"
          url="/admin/proposal"
        />
      </div>
      <p className="text-black font-semibold mt-4">Grafik Visualisasi</p>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mt-2">
        <CardChart title="Statistik Ajuan" subtitle="Persentase Status Ajuan">
          <DoughnutChart />
        </CardChart>
      </div>
      <p className="text-black font-semibold mt-4">Informasi Umum</p>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mt-2">
        <CardChart
          title="Dosen Terbaru"
          subtitle="Top 5 Dosen yang Baru Terdaftar"
        >
          <LatestProposals />
        </CardChart>
      </div>
    </div>
  );
}
