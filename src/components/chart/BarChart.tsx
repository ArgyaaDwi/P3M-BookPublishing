// "use client";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

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
//       label: "Jumlah Ajuan",
//       data: [120, 90, 75, 60, 50, 40, 30],
//       backgroundColor: "rgba(8, 19, 133, 0.89)",
//     },
//   ],
// };

// const options = {
//   indexAxis: "y" as const,
//   responsive: true,
//   plugins: {
//     legend: {
//       position: "top" as const,
//     },
//     title: {
//       display: true,
//       text: "Ajuan Penerbitan Tiap Jurusan",
//     },
//   },
// };

// export default function BarChart() {
//   return <Bar options={options} data={data} />;
// }
"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const labels = [
  "Teknik Informatika",
  "Teknik Elektro",
  "Teknik Mekatronika",
  "Teknik Telekomunikasi",
  "Teknik Multimedia Broadcasting",
  "Teknik Komputer",
  "Teknik Elektronika",
];

const data = {
  labels,
  datasets: [
    {
      label: "Jumlah Ajuan",
      data: [12, 9, 7, 6, 5, 4, 3],
      backgroundColor: "rgba(8, 19, 133, 0.89)",
    },
  ],
};

const options = {
  indexAxis: "y" as const,
  responsive: true,
  maintainAspectRatio: false, // Penting untuk kontrol tinggi kustom
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Ajuan Penerbitan Tiap Jurusan",
    },
  },
};

export default function BarChart() {
  return (
    <div style={{ height: "350px" }}>
      {" "}
      {/* Tetapkan tinggi yang konsisten */}
      <Bar options={options} data={data} />
    </div>
  );
}
