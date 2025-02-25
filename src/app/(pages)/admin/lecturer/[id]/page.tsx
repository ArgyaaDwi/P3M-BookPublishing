"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Lecturer } from "@/types/lecturerTypes";
import Breadcrumb from "@/components/BreadCrumb";
import Tabs from "@/components/Tabs";
import DetailLecturer from "../components/DetailLecturer";
export default function LecturerDetailPage() {
  const { id } = useParams();
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { name: "Dashboard", url: "/admin/dashboard" },
    { name: "Dosen", url: "/admin/lecturer" },
    { name: "Loading...", url: `/admin/lecturer/${id}` },
  ]);
  useEffect(() => {
    const fetchLecturer = async () => {
      try {
        const response = await fetch(`/api/admin/lecturers/${id}`);
        const result = await response.json();
        if (result.status === "success") {
          setLecturer(result.data);
          setBreadcrumbItems([
            { name: "Dashboard", url: "/admin/dashboard" },
            { name: "Dosen", url: "/admin/lecturer" },
            { name: result.data.name, url: `/admin/lecturer/${id}` },
          ]);
        } else {
          console.error("Failed to fetch lecturer detail:", result.error);
        }
      } catch (error) {
        console.error("Error fetching lecturer detail:", error);
      }
    };
    fetchLecturer();
  }, [id]);

  if (!lecturer) {
    return <div className="text-center text-black">Memuat Data...</div>;
  }

  const tabItems = [
    {
      title: "Informasi Pengguna",
      content: (
        <div>
          <DetailLecturer />
        </div>
      ),
    },
    {
      title: "Ajuan Penerbitan Pengguna",
      content: (
        <div>
          <h3 className="text-black font-bold">
            Ajuan Penerbitan Buku Pengguna {lecturer.name}
          </h3>
        </div>
      ),
    },
  ];
  return (
    <div>
      <Breadcrumb title="Detail Dosen" breadcrumbItems={breadcrumbItems} />
      <div className="bg-white rounded-lg mt-3 overflow-hidden pb-4">
        <Tabs tabs={tabItems} />
      </div>
    </div>
  );
}
