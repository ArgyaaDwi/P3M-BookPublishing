import prisma from "@/lib/prisma";
import CardChart from "@/components/card/CardChart";
import Card from "@/components/card/Card";
import { Files, Banknote, CircleCheckBig, CircleAlert } from "lucide-react";
import DoughnutChart from "@/components/chart/DoughnutChart";
import Breadcrumb from "@/components/BreadCrumb";
import TransactionChart from "@/components/chart/TransactionChart";
import LatestProposals from "../components/LatestProposals";
import { getSession } from "@/lib/session";
import { getPublisherChartData } from "@/lib/chart/getPublisherChartData";
import { getTransactionPublisherChartData } from "@/lib/chart/getTransactionPublisherChartData";
import PublicationPerYear from "@/components/PublicationPerYear";

export default async function DashboardPublisherPage() {
  const breadcrumbItems = [
    {
      name: "Dashboard",
      url: "/dashboard",
    },
  ];
  const session = await getSession();
  const publisherId = Number(session?.user_id);
  const { labels: proposalLabels, data: proposalData } = await getPublisherChartData(publisherId);
  const { labels: transactionLabels, data: transactionData } = await getTransactionPublisherChartData(publisherId);
  const totalMyProposal = await prisma.publication.count({
    where: {
      publisher: {
        id: publisherId,
      },
    },
  });
  const totalMyProposalUnverify = await prisma.publication.count({
    where: {
      publisher: {
        id: publisherId,
      },
      status: {
        id: {
          in: [1,4,5,9],
        }
      }
    },
  });
  const totalMyProposalAccepted = await prisma.publication.count({
    where: {
      publisher: {
        id: publisherId,
      },
      status: {
        id: {
          in: [3,7],
        }
      }
    },
  });
  const totalMyTransaction = await prisma.transaction.count({
    where: {
      user_id: publisherId
    },
  });
  const data2023 = await prisma.publication.findMany({
    where: {
      publisher: {
        id: publisherId,
      },
      createdAt: {
        gte: new Date("2023-01-01"),
        lt: new Date("2024-01-01"),
      },
    },
  });
  const data2024 = await prisma.publication.findMany({
    where: {
      publisher: {
        id: publisherId,
      },
      createdAt: {
        gte: new Date("2024-01-01"),
        lt: new Date("2025-01-01"),
      },
    },
  });
    const data2025 = await prisma.publication.findMany({
    where: {
      publisher: {
        id: publisherId,
      },
      createdAt: {
        gte: new Date("2025-01-01"),
        lt: new Date("2026-01-01"),
      },
    },
  });
  return (
    <div>
      <Breadcrumb title="Hai, Penerbit" breadcrumbItems={breadcrumbItems} />
      <p className="text-gray-600">Kelola Ajuan Penerbitan Buku Sekarang!</p>
      <p className="text-black mt-4 font-semibold">Overview</p>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-2">
        <Card
          icon={<Files color="gray" />}
          text="Total Ajuan"
          count={totalMyProposal}
          color="#E2E557"
          url="/publisher/proposal"
        />
        <Card
          icon={<Banknote color="gray" />}
          text="Total Transaksi"
          count={totalMyTransaction}
          color="#81C3C7"
          url="/publisher/invoice"
        />

        <Card
          icon={<CircleAlert color="gray" />}
          text="Ajuan Belum Diverifikasi"
          count={totalMyProposalUnverify}
          color="#81C3C7"
          url="/publisher/proposal"
        />
        <Card
          icon={<CircleCheckBig color="gray" />}
          text="Ajuan Disetujui"
          count={totalMyProposalAccepted}
          color="#1448CD"
          url="/publisher/proposal"
        />
      </div>
      <p className="text-black mt-4 font-semibold">Ajuan yang Ditangani Sesuai Tahun</p>
       <PublicationPerYear
        dataPerTahun={{
          2023: data2023.length,
          2024: data2024.length,
          2025: data2025.length,
        }}
      />
      <p className="text-black font-semibold mt-4">Grafik Visualisasi</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
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
          <DoughnutChart labels={proposalLabels} data={proposalData}/>
        </CardChart>
        <CardChart
          title="Statistik Transaksi"
          subtitle="Jumlah Transaksi Berdasarkan Status"
        >
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
          <TransactionChart labels={transactionLabels} data={transactionData} />
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
