import prisma from "@/lib/prisma";
import CardChart from "@/components/card/CardChart";
import Card from "@/components/card/Card";
import LatestLecturers from "../components/LatestLecturer";
import LatestPublishers from "../components/LatestPublisher";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  Files,
  Users,
  UserRoundPen,
  CircleAlert,
  Banknote,
  ArrowLeftRight,
} from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import BarChart from "@/components/chart/BarChart";
import DoughnutChart from "@/components/chart/DoughnutChart";

export default async function DashboardAdminPage() {
  const totalLecturer = await prisma.user.count({
    where: {
      role: "DOSEN",
    },
  });
  const totalProposal = await prisma.publication.count();
  const totalPublisher = await prisma.user.count({
    where: {
      role: "PENERBIT",
    },
  });
  const totalUnVerifiyProposal = await prisma.publication.count({
    where: {
      current_status_id: 1,
    },
  });
  const totalNominal = await prisma.transactionItem.aggregate({
    _sum: {
      total_cost: true,
    },
    where: {
      deleted: false,
    },
  });
  const nominal = totalNominal._sum.total_cost ?? 0;

  const breadcrumbItems = [
    {
      name: "Dashboard",
      url: "/dashboard",
    },
  ];
  return (
    <div>
      <Breadcrumb title="Hai, Admin P3M" breadcrumbItems={breadcrumbItems} />
      <p className="text-gray-600">Kelola Ajuan Penerbitan Buku Sekarang!</p>
      <p className="text-black mt-4 font-semibold">Overview</p>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-2">
        <Card
          icon={<Users color="gray" />}
          text="Total Dosen"
          count={totalLecturer}
          color="#63C2EB"
          url="/admin/lecturer"
        />
        <Card
          icon={<UserRoundPen color="gray" />}
          text="Total Penerbit"
          count={totalPublisher}
          color="#81C3C7"
          url="/admin/publisher"
        />
        <Card
          icon={<Files color="gray" />}
          text="Total Ajuan"
          count={totalProposal}
          color="#E2E557"
          url="/admin/proposal"
        />
        <Card
          icon={<CircleAlert color="gray" />}
          text="Ajuan Belum Diverifikasi"
          count={totalUnVerifiyProposal}
          color="#1448CD"
          url="/admin/proposal"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        <Card
          icon={<ArrowLeftRight color="gray" />}
          text="Total Transaksi"
          count={totalPublisher}
          color="#81C3C7"
          url="/admin/publisher"
        />
        <Card
          icon={<Banknote color="gray" />}
          text="Total Nominal Transaksi"
          count={`Rp. ${formatCurrency(nominal)}`}
          color="#1448CD"
          url="/admin/proposal"
        />
      </div>
      <p className="text-black font-semibold mt-4">Grafik Visualisasi</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        <CardChart
          title="Statistik Ajuan"
          subtitle="Top 5 Jurusan dengan Jumlah Ajuan Tertinggi"
        >
          <div>
            <BarChart />
            <BarChart />
          </div>
        </CardChart>

        <CardChart title="Statistik Ajuan" subtitle="Persentase Status Ajuan">
          <div>
            <DoughnutChart />
          </div>
        </CardChart>
      </div>
      <p className="text-black font-semibold mt-4">Informasi Umum</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        <CardChart
          title="Dosen Terbaru"
          subtitle="Top 5 Dosen yang Baru Terdaftar"
        >
          <LatestLecturers />
        </CardChart>
        <CardChart
          title="Penerbit Terbaru"
          subtitle="Top 5 Penerbit yang Baru Terdaftar"
        >
          <LatestPublishers />
        </CardChart>
      </div>
    </div>
  );
}
