// "use client";

// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Doughnut } from "react-chartjs-2";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const labels = [
//   "Teknik Informatika",
//   "Teknik Elektro",
//   "Teknik Mekatronika",
//   "Teknik Telekomunikasi",
//   "Teknik Multimedia Broadcasting",
//   "Teknik Komputer",
//   "Teknik Elektronika",
// ];

// const data = {
//   labels,
//   datasets: [
//     {
//       label: "Jumlah Mahasiswa",
//       data: [120, 90, 75, 60, 50, 40, 30],
//       backgroundColor: [
//         "rgba(255, 99, 132, 0.5)",
//         "rgba(54, 162, 235, 0.5)",
//         "rgba(255, 206, 86, 0.5)",
//         "rgba(75, 192, 192, 0.5)",
//         "rgba(153, 102, 255, 0.5)",
//         "rgba(255, 159, 64, 0.5)",
//         "rgba(199, 199, 199, 0.5)",
//       ],
//       borderWidth: 1,
//     },
//   ],
// };

// const options = {
//   responsive: true,
//   cutout: "50%",
//   plugins: {
//     legend: {
//       position: "bottom",
//     },
//     title: {
//       display: true,
//       text: "Distribusi Mahasiswa per Jurusan",
//     },
//   },
// };

// export default function DoughnutChart() {
//   return <Doughnut data={data} options={options} />;
// }
"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const labels = [
  "Menunggu Pembayaran",
  "Verifikasi Pembayaran",
  "Revisi Bukti Pembayaran",
  "Pembayaran Berhasil",
];

const data = {
  labels,
  datasets: [
    {
      label: "Jumlah Mahasiswa",
      data: [10, 2, 7, 1],
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
      text: "Persentase Status Ajuan Penerbitan",
      padding: {
        top: 10,
        bottom: 10,
      },
    },
  },
};

export default function TransactionChart() {
  return (
    <div style={{ height: "350px" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
