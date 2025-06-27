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
      text: "Persentase Status Ajuan Penerbitan",
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

export default function DoughnutChart({ labels, data }: Props) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Jumlah Ajuan",
        data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",  
          "rgba(54, 162, 235, 0.5)",  
          "rgba(255, 206, 86, 0.5)",  
          "rgba(153, 102, 255, 0.5)", 
          "rgba(255, 159, 64, 0.5)",  
          "rgba(199, 199, 199, 0.5)", 
          "rgba(75, 192, 192, 0.5)",  
          "rgba(255, 99, 71, 0.5)",   
          "rgba(100, 149, 237, 0.5)", 
          "rgba(60, 179, 113, 0.5)",  
          "rgba(218, 112, 214, 0.5)", 
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
