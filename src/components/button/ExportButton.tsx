"use client";
import React from "react";
import { FileText, ChartBar } from "lucide-react";

type ExportButtonProps = {
  onClick: () => void;
  type?: "pdf" | "excel";
  label?: string;
};

export default function ExportButton({
  onClick,
  type = "pdf",
  label,
}: ExportButtonProps) {
  const isPDF = type === "pdf";
  return (
    <button
      onClick={onClick}
      className={`bg-white border ${
        isPDF
          ? "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
          : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
      } px-3 py-2 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2`}
    >
      {isPDF ? (
        <FileText className="w-5 h-5" />
      ) : (
        <ChartBar className="w-5 h-5" />
      )}
      {label || (isPDF ? "Export PDF" : "Export Excel")}
    </button>
  );
}
