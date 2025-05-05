"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormatter";
import LoadingIndicator from "@/components/Loading";
import { User } from "@/types/interfaces";

export default function LatestPublishers() {
  const [recentPublishers, setRecentPublishers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchLatestPublishers = async () => {
      try {
        const res = await fetch("/api/recent/publishers");
        if (res.ok) {
          const data = await res.json();
          setRecentPublishers(data);
        }
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPublishers();
  }, []);

  if (loading) return <LoadingIndicator />;
  if (recentPublishers.length === 0) return <p>Tidak ada aktivitas terbaru.</p>;

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
          {recentPublishers.map((recent, index) => (
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
