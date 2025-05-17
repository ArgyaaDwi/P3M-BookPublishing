// import prisma from "@/lib/prisma";
import CardChart from "@/components/card/CardChart";
import Card from "@/components/card/Card";
import { Files, Banknote, CircleCheckBig, CircleAlert } from "lucide-react";
import DoughnutChart from "@/components/chart/DoughnutChart";
import Breadcrumb from "@/components/BreadCrumb";
import TransactionChart from "@/components/chart/TransactionChart";
import LatestProposals from "../components/LatestProposals";

export default async function DashboardPublisherPage() {
  const breadcrumbItems = [
    {
      name: "Dashboard",
      url: "/dashboard",
    },
  ];
  return (
    <div>
      <Breadcrumb title="Hai, Penerbit" breadcrumbItems={breadcrumbItems} />
      <p className="text-gray-600">Kelola Ajuan Penerbitan Buku Sekarang!</p>
      <p className="text-black mt-4 font-semibold">Overview</p>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-2">
        <Card
          icon={<Files color="gray" />}
          text="Total Ajuan"
          count={13}
          color="#E2E557"
          url="/publisher/proposal"
        />
        <Card
          icon={<Banknote color="gray" />}
          text="Total Transaksi"
          count={1}
          color="#81C3C7"
          url="/publisher/invoice"
        />

        <Card
          icon={<CircleAlert color="gray" />}
          text="Ajuan Belum Diverifikasi"
          count={7}
          color="#81C3C7"
          url="/publisher/proposal"
        />
        <Card
          icon={<CircleCheckBig color="gray" />}
          text="Ajuan Disetujui"
          count={4}
          color="#1448CD"
          url="/publisher/proposal"
        />
      </div>
      <p className="text-black font-semibold mt-4">Grafik Visualisasi</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        <CardChart title="Statistik Ajuan" subtitle="Persentase Status Ajuan">
          <DoughnutChart />
        </CardChart>
        <CardChart
          title="Statistik Transaksi"
          subtitle="Persentase Status Ajuan"
        >
          <TransactionChart />
        </CardChart>
      </div>
      <p className="text-black font-semibold mt-4">Informasi Umum</p>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mt-2">
        <CardChart
          title="Ajuan Terbaru"
          subtitle="Top 5 Ajuan yang Baru Terdaftar"
        >
          <LatestProposals />
        </CardChart>
      </div>
    </div>
  );
}
