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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  labels: string[];
  data: number[];
};

export default function BarChart({ labels, data }: Props) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Jumlah Ajuan",
        data,
        backgroundColor: "rgba(8, 19, 133, 0.89)",
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Ajuan Penerbitan Tiap Jurusan",
      },
    },
  };

  return (
    <div style={{ height: "350px" }}>
      <Bar options={options} data={chartData} />
    </div>
  );
}


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
//       data: [12, 9, 7, 6, 5, 4, 3],
//       backgroundColor: "rgba(8, 19, 133, 0.89)",
//     },
//   ],
// };

// const options = {
//   indexAxis: "y" as const,
//   responsive: true,
//   maintainAspectRatio: false, // Penting untuk kontrol tinggi kustom
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
//   return (
//     <div style={{ height: "350px" }}>
//       {" "}
//       {/* Tetapkan tinggi yang konsisten */}
//       <Bar options={options} data={data} />
//     </div>
//   );
// }
