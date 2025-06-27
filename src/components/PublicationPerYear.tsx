"use client";

import { useState } from "react";
interface Props {
  dataPerTahun: { [year: number]: number };
}
const PublicationPerYear = ({ dataPerTahun }: Props) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const years = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);
  const count = dataPerTahun[selectedYear] ?? 0;

  return (
    <div className="mt-2">
        <div className="flex items-center gap-4 mb-2">
            <label className="ml-2 text-gray-800 font-normal text-md whitespace-nowrap">
                Pilih Tahun:
            </label>
            <div className="relative w-fit">
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-100 transition text-sm"
                >
                    {years.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 transform">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Tahun Terpilih
              </p>
            </div>
            <h3 className="text-4xl font-bold text-gray-800 mb-1">
              {selectedYear}
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-2">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider mr-3">
                Total Ajuan
              </p>
            </div>
            <div className="flex items-center justify-end">
              <p className="text-5xl font-bold text-blue-500">
                {count}
              </p>
              <div className="ml-3 p-2 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-20 blur-xl"></div>
      </div>
    </div>
  );
};

export default PublicationPerYear;