"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormatter";
import LoadingIndicator from "@/components/Loading";
import BadgeStatus from "@/components/BadgeStatus";
import { ShipmentLog } from "@/types/interfaces";

const ShipmentLogs = ({ id }: { id: number }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/invoices/log-shipment/${id}`);
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
        logs.map((log: ShipmentLog) => {
          return (
            <div key={log.id} className="p-3 border rounded-lg shadow">
              <p className="text-md font-semibold text-black mb-1">
                {log.user?.name || "Unknown User"}
              </p>
              <BadgeStatus
                text={log.status || "Status Tidak Diketahui"}
                color={
                  log.status === "SHIPPED"
                    ? "badgePendingText"
                    : log.status === "DELIVERED"
                    ? "badgeRevText"
                    : "badgeSuccessText"
                }
                bgColor={
                  log.status === "SHIPPED"
                    ? "badgePending"
                    : log.status === "DELIVERED"
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

export default ShipmentLogs;
