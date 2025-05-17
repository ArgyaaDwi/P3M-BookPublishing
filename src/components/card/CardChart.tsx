interface CardChartProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}
const CardChart = ({ children, title, subtitle }: CardChartProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h1 className="pt-3 px-4 text-black text-lg font-bold">{title}</h1>
      <p className="px-4 pb-3 text-gray-600 text-xs font-normal">{subtitle}</p>
      <hr />
      <div className="px-4 py-3">{children}</div>
    </div>
  );
};
export default CardChart;
// "use client";

// import React from "react";

// interface CardChartProps {
//   title: string;
//   subtitle?: string;
//   children: React.ReactNode;
// }

// export default function CardChart({
//   title,
//   subtitle,
//   children,
// }: CardChartProps) {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
//       <div className="mb-2">
//         <h2 className="text-lg font-semibold">{title}</h2>
//         {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
//       </div>
      
//       <div className="flex-grow flex items-center justify-center">
//         {children}
//       </div>
//     </div>
//   );
// }
