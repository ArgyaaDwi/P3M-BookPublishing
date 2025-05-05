// "use client";
// import { useEffect, useState } from "react";
// import { formatDate } from "@/utils/dateFormatter";
// import { Eye, StickyNote } from "lucide-react";
// import { getSession } from "@/lib/session";
// import LoadingIndicator from "@/components/Loading";
// import BadgeStatus from "@/components/BadgeStatus";
// import { PublicationActivity } from "@/types/interfaces";

// const LogPublicationActivity = ({
//   publicationId,
// }: {
//   publicationId: number;
// }) => {
//   const [activities, setActivities] = useState([]);
//   const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const fetchSession = async () => {
//       const session = await getSession();
//       setLoggedInUser(typeof session?.name === "string" ? session.name : null);
//     };

//     const fetchActivities = async () => {
//       try {
//         const res = await fetch(
//           `/api/proposals/log-activities/${publicationId}`
//         );
//         if (!res.ok) {
//           throw new Error(`HTTP error! Status: ${res.status}`);
//         }
//         const data = await res.json();
//         if (data.status === "success") {
//           setActivities(data.data || []);
//         } else {
//           console.error("Failed to fetch activities:", data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching activities:", error);
//         setActivities([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSession();
//     fetchActivities();
//   }, [publicationId]);
//   if (loading || loggedInUser === null) return <LoadingIndicator />;
//   return (
//     <div className="space-y-4">
//       {activities.length > 0 ? (
//         activities.map((activity: PublicationActivity) => {
//           const isUser = activity.user?.name === loggedInUser;
//           return (
//             <div
//               key={activity.id}
//               className={`p-3 border rounded-lg shadow max-w-xl ${
//                 isUser ? "bg-indigo-50 ml-auto" : "bg-gray-50 "
//               }`}
//             >
//               <p className="mb-1 text-md font-semibold text-black">
//                 {activity.user?.name || "Unknown User"}
//               </p>
//               <BadgeStatus
//                 text={activity.status?.status_name || "Status Tidak Diketahui"}
//                 color={
//                   activity.publication_status_id === 1 ||
//                   activity.publication_status_id === 4 ||
//                   activity.publication_status_id === 5 ||
//                   activity.publication_status_id === 9 ||
//                   activity.publication_status_id === 10
//                     ? "badgePendingText"
//                     : activity.publication_status_id === 2 ||
//                       activity.publication_status_id === 6 ||
//                       activity.publication_status_id === 11
//                     ? "badgeRevText"
//                     : "badgeSuccessText"
//                 }
//                 bgColor={
//                   activity.publication_status_id === 1 ||
//                   activity.publication_status_id === 4 ||
//                   activity.publication_status_id === 5 ||
//                   activity.publication_status_id === 9 ||
//                   activity.publication_status_id === 10
//                     ? "badgePending"
//                     : activity.publication_status_id === 2 ||
//                       activity.publication_status_id === 6 ||
//                       activity.publication_status_id === 11
//                     ? "badgeRev"
//                     : "badgeSuccess"
//                 }
//               />
//               <p className="mt-1 text-xs text-gray-700">Catatan:</p>
//               <p className="text-sm text-gray-700">
//                 {activity.publication_notes || "No notes"}
//               </p>
//               {activity.publication_document_url && (
//                 <a
//                   href={
//                     activity.publication_document_url.startsWith("http")
//                       ? activity.publication_document_url
//                       : `https://${activity.publication_document_url}`
//                   }
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-500 text-xs flex items-center gap-1"
//                 >
//                   <StickyNote className="w-4 h-4" />
//                   Draf Buku
//                 </a>
//               )}
//               {activity.supporting_url && (
//                 <a
//                   href={
//                     activity.supporting_url.startsWith("http")
//                       ? activity.supporting_url
//                       : `https://${activity.supporting_url}`
//                   }
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-500 text-xs flex items-center gap-1"
//                 >
//                   <Eye className="w-4 h-4" />
//                   Lihat Url Pendukung
//                 </a>
//               )}
//               <p className="mt-1 text-xs text-gray-500">
//                 {formatDate(activity.createdAt)}
//               </p>
//             </div>
//           );
//         })
//       ) : (
//         <p className="text-gray-500 text-sm">Belum ada aktivitas.</p>
//       )}
//     </div>
//   );
// };

// export default LogPublicationActivity;
"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormatter";
import {
  Eye,
  StickyNote,
  UserCircle,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
} from "lucide-react";
import { getSession } from "@/lib/session";
import LoadingIndicator from "@/components/Loading";
import { PublicationActivity } from "@/types/interfaces";

interface StatusBadgeProps {
  statusId: number;
  statusName: string | null;
}
const StatusBadge: React.FC<StatusBadgeProps> = ({ statusId, statusName }) => {
  const getStatusConfig = (id: number) => {
    if ([1, 4, 5, 9, 10].includes(id)) {
      return {
        bgColor: "bg-blue-50",
        textColor: "text-blue-800",
        borderColor: "border-blue-200",
        icon: <Clock size={16} className="text-blue-600" />,
      };
    } else if ([2, 6, 11].includes(id)) {
      return {
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-200",
        icon: <AlertCircle size={16} className="text-yellow-600" />,
      };
    } else {
      return {
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-200",
        icon: <CheckCircle size={16} className="text-green-600" />,
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

const LogPublicationActivity = ({
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
        const res = await fetch(
          `/api/proposals/log-activities/${publicationId}`
        );
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

  if (loading || loggedInUser === null) return <LoadingIndicator />;

  return (
    <div className="rounded-lg border shadow-sm bg-white p-4">
      {/* <h3 className="font-semibold text-lg mb-4">
        Riwayat Aktivitas Publikasi
      </h3> */}
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity: PublicationActivity) => {
            const isUser = activity.user?.name === loggedInUser;
            return (
              <div
                key={activity.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-lg border shadow-sm overflow-hidden w-full max-w-lg ${
                    isUser
                      ? "bg-slate-50 border-indigo-100"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center gap-3 p-3 border-b border-gray-300">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isUser ? "bg-secondary" : "bg-gray-100"
                      }`}
                    >
                      <UserCircle
                        className={`w-5 h-5 ${
                          isUser ? "text-primary" : "text-gray-600"
                        }`}
                      />
                    </div>

                    <div className="flex-grow">
                      <p className="font-semibold text-gray-900">
                        {activity.user?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>

                    <StatusBadge
                      statusId={activity.publication_status_id}
                      statusName={
                        activity.status?.status_name || "Status Tidak Diketahui"
                      }
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        Catatan:
                      </p>
                      <p className="text-sm text-gray-700">
                        {activity.publication_notes || "Tidak ada catatan"}
                      </p>
                    </div>

                    {/* Document links container */}
                    {(activity.publication_document_url ||
                      activity.supporting_url) && (
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                        {activity.publication_document_url && (
                          <a
                            href={
                              activity.publication_document_url.startsWith(
                                "http"
                              )
                                ? activity.publication_document_url
                                : `https://${activity.publication_document_url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 text-xs flex items-center gap-1 py-1 px-2 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                          >
                            <StickyNote className="w-4 h-4" />
                            Draf Buku
                          </a>
                        )}

                        {activity.supporting_url && (
                          <a
                            href={
                              activity.supporting_url.startsWith("http")
                                ? activity.supporting_url
                                : `https://${activity.supporting_url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 text-xs flex items-center gap-1 py-1 px-2 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Lihat Url Pendukung
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-6 flex flex-col items-center justify-center text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FileText className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-gray-500">
            Belum ada aktivitas untuk publikasi ini.
          </p>
        </div>
      )}
    </div>
  );
};

export default LogPublicationActivity;
