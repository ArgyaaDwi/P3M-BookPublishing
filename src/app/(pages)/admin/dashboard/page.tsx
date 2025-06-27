import prisma from "@/lib/prisma";
import CardChart from "@/components/card/CardChart";
import Card from "@/components/card/Card";
import LatestLecturers from "../components/LatestLecturer";
import LatestPublishers from "../components/LatestPublisher";
import { formatCurrency } from "@/utils/formatCurrency";
import { getAdminChartData } from "@/lib/chart/getAdminChartData";
import { getAdminBarChartData } from "@/lib/chart/getAdminBarChartData";
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
import PublicationPerYear from "@/components/PublicationPerYear";

export default async function DashboardAdminPage() {
  const { labels: barLabels, data: barData } = await getAdminBarChartData();
  const { labels: doughnutLabels, data: doughnutData } = await getAdminChartData();
  const totalLecturer = await prisma.user.count({
    where: {
      role: "DOSEN",
      deleted: false,
    },
  });
  const totalProposal = await prisma.publication.count();
  const totalPublisher = await prisma.user.count({
    where: {
      role: "PENERBIT",
      deleted: false,
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
  const totalTransaction = await prisma.transaction.count();
  const breadcrumbItems = [
    {
      name: "Dashboard",
      url: "/dashboard",
    },
  ];
  const data2023 = await prisma.publication.findMany({
    where: {
      createdAt: {
        gte: new Date("2023-01-01"),
        lt: new Date("2024-01-01"),
      },
    },
  });
  const data2024 = await prisma.publication.findMany({
    where: {
      createdAt: {
        gte: new Date("2024-01-01"),
        lt: new Date("2025-01-01"),
      },
    },
  });
    const data2025 = await prisma.publication.findMany({
    where: {
      createdAt: {
        gte: new Date("2025-01-01"),
        lt: new Date("2026-01-01"),
      },
    },
  });
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
          count={totalTransaction}
          color="#81C3C7"
          url="/admin/invoice"
        />
        <Card
          icon={<Banknote color="gray" />}
          text="Total Nominal Transaksi"
          count={`Rp. ${formatCurrency(nominal)}`}
          color="#1448CD"
          url="/admin/invoice"
        />
      </div>
      <p className="text-black mt-4 font-semibold">Ajuan Sesuai Tahun</p>
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
        <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
          <div>
            <p className="text-sm text-gray-500 mt-1">Tahun</p>
            <h3 className="text-2xl font-bold text-gray-800">2023</h3>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mt-1">Total Ajuan</p>
            <p className="text-3xl font-bold text-blue-600">{data2023.length}</p>
          </div>
        </div>
        <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
          <div>
            <p className="text-sm text-gray-500 mt-1">Tahun</p>
            <h3 className="text-2xl font-bold text-gray-800">2024</h3>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mt-1">Total Ajuan</p>
            <p className="text-3xl font-bold text-blue-600">{data2024.length}</p>
          </div>
        </div>
        <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
          <div>
            <p className="text-sm text-gray-500 mt-1">Tahun</p>
            <h3 className="text-2xl font-bold text-gray-800">2025</h3>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mt-1">Total Ajuan</p>
            <p className="text-3xl font-bold text-blue-600">{data2025.length}</p>
          </div>
        </div>
      </div> */}
      <PublicationPerYear
        dataPerTahun={{
          2023: data2023.length,
          2024: data2024.length,
          2025: data2025.length,
        }}
      />
      <p className="text-black font-semibold mt-4">Grafik Visualisasi</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        <CardChart
          title="Statistik Ajuan"
          subtitle="Jumlah Ajuan Tiap Jurusan"
        >
          <BarChart labels={barLabels} data={barData} />
        </CardChart>
        <CardChart title="Statistik Ajuan" subtitle="Jumlah Ajuan Berdasarkan Status">
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"
              />
            </svg>
            <p> Klik label di bawah chart untuk menyembunyikan/menampilkan ajuan sesuai status. </p>
          </div>
          <DoughnutChart labels={doughnutLabels} data={doughnutData} />
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
