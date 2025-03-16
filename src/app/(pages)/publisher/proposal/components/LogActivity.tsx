"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormatter";
import { Eye } from "lucide-react";
import { getSession } from "@/lib/session";
import LoadingIndicator from "@/components/Loading";
interface Activity {
  id: number;
  user?: {
    name: string;
  };
  status?: {
    status_name: string;
  };
  publication_notes?: string;
  createdAt: string;
  supporting_url?: string;
}

const LogActivityPublisher = ({
  publicationId,
}: {
  publicationId: number;
}) => {
  const [activities, setActivities] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setLoggedInUser(typeof session?.name === "string" ? session.name : null);
    };

    const fetchActivities = async () => {
      try {
        const res = await fetch(`/api/admin/activities/${publicationId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        if (data.status === "success") {
          setActivities(data.data || []);
        } else {
          console.error("Failed to fetch activities:", data.message);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
    fetchActivities();
  }, [publicationId]);
  if (loading) return <LoadingIndicator />;
  return (
    <div className="space-y-4">
      {activities.length > 0 ? (
        activities.map((activity: Activity) => {
          const isUser = activity.user?.name === loggedInUser;
          return (
            <div
              key={activity.id}
              className={`p-3 border rounded-lg shadow max-w-xl ${
                isUser ? "bg-blue-50 ml-auto" : "bg-gray-50 "
              }`}
            >
              <p className="text-md font-semibold text-black">
                {activity.user?.name || "Unknown User"}
              </p>
              <p className="text-sm font-thin text-gray-600">
                Status: {activity.status?.status_name || "Unknown Status"}
              </p>
              <p className="text-xs text-gray-700">Catatan:</p>
              <p className="text-sm text-gray-700">
                {activity.publication_notes || "No notes"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {formatDate(activity.createdAt)}
              </p>
              {activity.supporting_url && (
                <a
                  href={
                    activity.supporting_url.startsWith("http")
                      ? activity.supporting_url
                      : `https://${activity.supporting_url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-xs flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  Lihat Url Lampiran
                </a>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-sm">Belum ada aktivitas.</p>
      )}
    </div>
  );
};

export default LogActivityPublisher;
