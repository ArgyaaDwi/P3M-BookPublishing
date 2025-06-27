"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormatter";
import LoadingIndicator from "@/components/Loading";
import { Publication } from "@/types/interfaces";
import { getBadgeVariant } from "@/utils/statusPublicationHelper";
import BadgeStatus from "@/components/BadgeStatus";
export default function LatestProposals() {
  const [recentProposals, setRecentProposals] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchLatestPublishers = async () => {
      try {
        const res = await fetch("/api/v1/recent/my-publisher-proposals");
        if (res.ok) {
          const data = await res.json();
          setRecentProposals(data);
        }
      } catch (err) {
        console.error("Failed to fetch proposals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPublishers();
  }, []);

  if (loading) return <LoadingIndicator />;
  if (recentProposals.length === 0)
    return <p className="text-gray-600">Tidak ada proposal terbaru.</p>;
  return (
    <div className="overflow-x-auto border rounded-lg mt-1">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="px-4 py-3">No.</th>
            <th className="px-4 py-3">Judul Ajuan</th>
            <th className="px-4 py-3">Dosen Pemohon</th>
            <th className="px-4 py-3">Tanggal Pengajuan</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {recentProposals.map((recent, index) => (
            <tr key={recent.id} className="border-t">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{recent.publication_title}</td>
              <td className="px-4 py-2">{recent.lecturer?.name}</td>
              <td className="px-4 py-2">{formatDate(recent.createdAt)}</td>
              <td className="px-4 py-2">
                {" "}
                {(() => {
                  const [bg, color] = getBadgeVariant(recent.current_status_id);
                  return (
                    <BadgeStatus
                      text={
                        recent.status?.status_name || "Status Tidak Diketahui"
                      }
                      color={color}
                      bgColor={bg}
                    />
                  );
                })()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
