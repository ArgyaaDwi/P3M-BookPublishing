import prisma from "@/lib/prisma";
import CardChart from "@/components/card/CardChart";
import Card from "@/components/card/Card";
import { Files, CircleAlert, FilePenLine, CircleCheckBig } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
export default async function DashboardLecturerPage() {
  const totalMyProposal = await prisma.publication.count({
    where: {
      lecturer: {
        id: 8
      }
    }
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
          text="Total Ajuan"
          count={68}
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
          count={122}
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
          <p className="text-gray-600 text-base font-normal">
            Rencananya akan menampilkan grafik batang top 5 jurusan
          </p>
        </CardChart>
        <CardChart title="Statistik Ajuan" subtitle="Persentase Status Ajuan">
          <p className="text-gray-600 text-base font-normal">
            Rencananya akan menampilkan grafik pie status ajuan
          </p>
        </CardChart>
      </div>
      <p className="text-black font-semibold mt-4">Informasi Umum</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        <CardChart
          title="Dosen Terbaru"
          subtitle="Top 5 Dosen yang Baru Terdaftar"
        >
          <p className="text-gray-600 text-base font-normal">
            Rencananya akan menampilkan tabel dosen terbaru
          </p>
        </CardChart>
        <CardChart
          title="Penerbit Terbaru"
          subtitle="Top 5 Penerbit yang Baru Terdaftar"
        >
          <p className="text-gray-600 text-base font-normal">
            Rencananya akan menampilkan tabel penerbit terbaru
          </p>
        </CardChart>
      </div>
    </div>
  );
}
