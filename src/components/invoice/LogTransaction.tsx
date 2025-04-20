"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormatter";
import LoadingIndicator from "@/components/Loading";
import BadgeStatus from "@/components/BadgeStatus";
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

const TransactionLogs = ({ id }: { id: number }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/publisher/invoice/invoice-logs/${id}`);
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
    <div className="space-y-4 my-2">
      {logs.length > 0 ? (
        logs.map((log: Logs) => {
          return (
            <div key={log.id} className="p-3 border rounded-lg shadow">
              <p className="text-md font-semibold text-black mb-1">
                {log.user?.name || "Unknown User"}
              </p>
              <BadgeStatus
                text={log.status?.status_name || "Status Tidak Diketahui"}
                color={
                  log.transaction_status_id === 1
                    ? "badgePendingText"
                    : log.transaction_status_id === 3 ||
                      log.transaction_status_id === 4
                    ? "badgeRevText"
                    : "badgeSuccessText"
                }
                bgColor={
                  log.transaction_status_id === 1
                    ? "badgePending"
                    : log.transaction_status_id === 3 ||
                      log.transaction_status_id === 4
                    ? "badgeRev"
                    : "badgeSuccess"
                }
              />
              <p className="text-xs text-gray-700 mt-1">Catatan:</p>
              <p className="text-sm text-gray-700">{log.note || "No notes"}</p>
              <p className="mt-1 text-xs text-gray-500">
                {formatDate(log.createdAt)}
              </p>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-sm">Belum ada aktivitas.</p>
      )}
    </div>
  );
};

export default TransactionLogs;
