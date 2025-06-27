"use client";
import { useEffect, useState } from "react";
import { CheckCircle, CircleEllipsis, FileText, AlertCircle, MapPin } from "lucide-react";
import { formatDate } from "@/utils/dateFormatter";

const statusFlow = [1, 2, 4, 3, 5, 6, 9, 7, 10, 11, 8];

const statusMap: Record<number, { label: string }> = {
  1: { label: "Menunggu Verifikasi Admin" },
  2: { label: "Revisi dari Admin" },
  4: { label: "Revisi oleh Dosen dan Menunggu Verifikasi Admin" },
  3: { label: "Disetujui Admin" },
  5: { label: "Menunggu Verifikasi Penerbit" },
  6: { label: "Revisi dari Penerbit" },
  9: { label: "Revisi oleh Dosen dan Menunggu Verifikasi Penerbit" },
  7: { label: "Disetujui Penerbit" },
  10: { label: "Proses Dokumen" },
  11: { label: "Revisi Dokumen" },
  8: { label: "Selesai" },
};

const revisiStatusIds = [2, 4, 6, 9, 11];

interface Props {
  publicationId: number;
  currentStatusId: number;
}

interface ActivityLog {
  id: number;
  publication_id: number;
  publication_status_id: number;
  createdAt: string;
}

const PublicationTimeline: React.FC<Props> = ({ publicationId, currentStatusId }) => {
  const [passed, setPassed] = useState<number[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await fetch(`/api/v1/proposals/log-activities/${publicationId}`);
        const data = await res.json();

        if (data.status === "success") {
          const logs = data.data || [];
          const statusIds = logs.map((item: ActivityLog) => item.publication_status_id);
          setPassed(statusIds);
          setActivities(logs);
        }
      } catch (err) {
        console.error("Gagal ambil data log aktivitas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLog();
  }, [publicationId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-sm text-gray-600">Memuat timeline status...</span>
        </div>
      </div>
    );
  }

  if (passed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Belum Ada Riwayat</h3>
        <p className="text-gray-500 text-sm">Belum ada riwayat status untuk publikasi ini.</p>
      </div>
    );
  }

  const current = currentStatusId;
  const filteredStatuses = statusFlow.filter((statusId) => {
    if (revisiStatusIds.includes(statusId)) {
      return passed.includes(statusId) || current === statusId;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Timeline Ajuan Penerbitan</h3>
      </div>
      
      <div className="relative">
        {filteredStatuses.map((statusId, index) => {
          const status = statusMap[statusId];
          const isPassed = passed.includes(statusId);
          const isCurrent = statusId === current;
          const isRevision = revisiStatusIds.includes(statusId);
          const isLast = index === filteredStatuses.length - 1;
          
          const activity = activities.find(act => act.publication_status_id === statusId);

          let icon;
          let iconBg;
          let textClass;
          let statusBadge;

          if (isCurrent) {
            icon = <MapPin className="w-5 h-5 text-white" />;
            iconBg = "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30";
            textClass = "text-gray-800 font-semibold";
            statusBadge = (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-3">
                Status Saat Ini
              </span>
            );
          } else if (isPassed) {
            icon = <CheckCircle className="w-5 h-5 text-white" />;
            iconBg = isRevision 
              ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30"
              : "bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/30";
            textClass = "text-gray-700";
            statusBadge = (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-3 ${
                isRevision 
                  ? "bg-orange-100 text-orange-800" 
                  : "bg-green-100 text-green-800"
              }`}>
                {isRevision ? "Revisi" : "Selesai"}
              </span>
            );
          } else {
            icon = <CircleEllipsis className="w-5 h-5 text-gray-400" />;
            iconBg = "bg-gray-200";
            textClass = "text-gray-500";
            statusBadge = null;
          }

          return (
            <div key={statusId} className="relative flex items-start">
              {!isLast && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-gray-300 to-gray-200"></div>
              )}
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${iconBg} transition-all duration-300`}>
                {icon}
              </div>
              <div className="ml-4 flex-1 pb-10">
                <div className="flex items-center flex-wrap">
                  <p className={`text-sm ${textClass} leading-relaxed`}>
                    {status.label}
                  </p>
                  {statusBadge}
                </div>
                {activity && activity.createdAt && (
                  <div className="mt-1 text-xs text-gray-500">
                    {formatDate(activity.createdAt)}
                  </div>
                )}
                {isRevision && (isCurrent || isPassed) && (
                  <div className="mt-2 flex items-center text-xs text-orange-600">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    <span>Memerlukan perbaikan</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div> 
    </div>
  );
};

export default PublicationTimeline;