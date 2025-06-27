"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormatter";
import LoadingIndicator from "@/components/Loading";
import { User } from "@/types/interfaces";

export default function LatestLecturers() {
  const [recentLecturers, setRecentLecturers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchLatestLecturers = async () => {
      try {
        const res = await fetch("/api/v1/recent/lecturers");
        if (res.ok) {
          const data = await res.json();
          setRecentLecturers(data);
        }
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestLecturers();
  }, []);

  if (loading) return <LoadingIndicator />;
  if (recentLecturers.length === 0) return <p>Tidak ada aktivitas terbaru.</p>;

  return (
    <div className="overflow-x-auto border rounded-lg mt-1">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="px-4 py-3">No.</th>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">No. Telepon</th>
            <th className="px-4 py-3">Tanggal Bergabung</th>
          </tr>
        </thead>
        <tbody>
          {recentLecturers.map((recent, index) => (
            <tr key={recent.id} className="border-t">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{recent.name}</td>
              <td className="px-4 py-2">{recent.email}</td>
              <td className="px-4 py-2">{recent.phone_number || "-"}</td>
              <td className="px-4 py-2">{formatDate(recent.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
