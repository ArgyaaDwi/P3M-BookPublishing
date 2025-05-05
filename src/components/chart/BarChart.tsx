"use client"; // <- Wajib kalau pakai Next.js App Router

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

// Registrasi komponen Chart.js yang mau dipakai
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Data jurusan
const labels = [
  "Teknik Informatika",
  "Teknik Elektro",
  "Teknik Mekatronika",
  "Teknik Telekomunikasi",
  "Teknik Multimedia Broadcasting",
  "Teknik Komputer",
  "Teknik Elektronika",
];

// Data jumlah per jurusan
const data = {
  labels,
  datasets: [
    {
      label: "Jumlah Ajuan",
      data: [120, 90, 75, 60, 50, 40, 30],
      backgroundColor: "rgba(8, 19, 133, 0.89)",
    },
  ],
};

// Opsi chart
const options = {
  indexAxis: "y" as const,
  responsive: true,
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
  return <Bar options={options} data={data} />;
}
