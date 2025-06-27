"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormatter";
import LoadingIndicator from "@/components/Loading";
import { Clock, UserCircle, FileText, AlertCircle } from "lucide-react";

interface Logs {
  id: number;
  user?: {
    name: string;
  };
  status?: {
    status_name: string;
  };
  note: string;
  createdAt: string;
  transaction_status_id: number;
}
interface StatusBadgeProps {
  statusId: number;
  statusName: string | null;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ statusId, statusName }) => {
  const getStatusConfig = (id: number) => {
    switch (id) {
      case 1: 
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-200",
          icon: <Clock size={16} className="text-blue-600" />,
        };
      case 3:
        return {
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-200",
          icon: <AlertCircle size={16} className="text-yellow-600" />,
        };
      default:
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
          icon: <FileText size={16} className="text-green-600" />,
        };
    }
  };

  const config = getStatusConfig(statusId);

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full ${config.bgColor} ${config.textColor} ${config.borderColor} border`}
    >
      {config.icon}
      <span className="ml-1 text-xs font-medium">
        {statusName || "Status Tidak Diketahui"}
      </span>
    </div>
  );
};

const TransactionLogs = ({ id }: { id: number }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/v1/publisher/invoice/invoice-logs/${id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        if (data.status === "success") {
          setLogs(data.data || []);
        } else {
          console.error("Failed to fetch activities:", data.message);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [id]);

  if (loading) return <LoadingIndicator />;

  return (
    <div className="rounded-lg border shadow-sm bg-white p-4">
      {logs.length > 0 ? (
        <div className="space-y-6">
          {logs.map((log: Logs, index) => (
            <div key={log.id} className="relative pb-8">
              {index < logs.length - 1 && (
                <div className="absolute left-6 top-10 h-full w-0.5 bg-gray-200"></div>
              )}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center z-10">
                  <UserCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900">
                      {log.user?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      <Clock className="inline-block mr-1" size={16} />
                      {formatDate(log.createdAt)}
                    </p>
                  </div>

                  <StatusBadge
                    statusId={log.transaction_status_id}
                    statusName={log.status?.status_name || null}
                  />
                  <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      Catatan:
                    </p>
                    <p className="text-sm text-gray-700">
                      {log.note || "Tidak ada catatan"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 flex flex-col items-center justify-center text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FileText className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-gray-500">
            Belum ada aktivitas untuk transaksi ini.
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionLogs;
