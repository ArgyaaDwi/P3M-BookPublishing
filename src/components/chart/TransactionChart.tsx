// "use client";

// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Doughnut } from "react-chartjs-2";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const labels = [
//   "Menunggu Pembayaran",
//   "Verifikasi Pembayaran",
//   "Revisi Bukti Pembayaran",
//   "Pembayaran Berhasil",
// ];

// const data = {
//   labels,
//   datasets: [
//     {
//       label: "Jumlah Transaksi",
//       data: [10, 2, 7, 1],
//       backgroundColor: [
//         "rgba(255, 91, 132, 0.5)",
//         "rgba(255, 129, 64, 0.5)",
//         "rgba(199, 19, 199, 0.5)",
//         "rgba(75, 190, 122, 0.5)",
//       ],
//       borderWidth: 1,
//     },
//   ],
// };

// const options = {
//   responsive: true,
//   maintainAspectRatio: false,
//   cutout: "50%",
//   plugins: {
//     legend: {
//       position: "bottom" as const,
//       display: true,
//       labels: {
//         padding: 10,
//         boxWidth: 12,
//       },
//     },
//     title: {
//       display: true,
//       text: "Jumlah Sesuai Status Transaksi",
//       padding: {
//         top: 10,
//         bottom: 10,
//       },
//     },
//   },
// };

// export default function TransactionChart() {
//   return (
//     <div style={{ height: "350px" }}>
//       <Doughnut data={data} options={options} />
//     </div>
//   );
// }
"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "50%",
  plugins: {
    legend: {
      position: "bottom" as const,
      display: true,
      labels: {
        padding: 10,
        boxWidth: 12,
      },
    },
    title: {
      display: true,
      text: "Jumlah Sesuai Status Transaksi",
      padding: {
        top: 10,
        bottom: 10,
      },
    },
  },
};

type Props = {
  labels: string[];
  data: number[];
};

export default function TransactionChart({ labels, data }: Props) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Jumlah Transaksi",
        data,
        backgroundColor: [
          "rgba(255, 91, 132, 0.5)",
          "rgba(255, 129, 64, 0.5)",
          "rgba(199, 19, 199, 0.5)",
          "rgba(75, 190, 122, 0.5)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ height: "350px" }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
