"use client";
import React, { useState, useEffect } from "react";
import { PublicationType } from "@/types/publicationTypes";
import Breadcrumb from "@/components/BreadCrumb";
import { CircleAlert, Eye, Clipboard } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import LoadingIndicator from "@/components/Loading";
import { formatDate } from "@/utils/dateFormatter";
import { handlePasteText } from "@/utils/handlePaste";
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
export default function SubmitAdministrationRevision() {
  const [proposal, setProposal] = useState<PublicationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const { id } = useParams();
  const proposalId = String(id);
  const [notes, setNotes] = useState<string>("");
  const [supportingUrl, setSupportingUrl] = useState<string>("");
  const router = useRouter();
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { name: "Dashboard", url: "/lecturer/dashboard" },
    { name: "Ajuan", url: "/lecturer/proposal" },
    { name: "Loading...", url: `/lecturer/lecturer/${proposalId}` },
  ]);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await fetch(`/api/lecturer/proposals/${proposalId}`);
        const data = await res.json();

        if (data.status === "success") {
          setProposal(data.data || null);
          setBreadcrumbItems([
            { name: "Dashboard", url: "/lecturer/dashboard" },
            { name: "Ajuan", url: "/lecturer/proposal" },
            {
              name: data.data.publication_title,
              url: `/lecturer/lecturer/${proposalId}`,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching proposal:", error);
        setProposal(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchActivities = async () => {
      try {
        const res = await fetch(`/api/proposals/log-revision/${proposalId}`);
        const data = await res.json();

        if (data.status === "success") {
          setActivities(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchProposal();
    fetchActivities();
  }, [proposalId]);
  const handlePaste = async () => {
    const url = await handlePasteText();
    if (url) setSupportingUrl(url);
  };
  const handleFormRevisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/lecturer/proposals/submit-revision/${proposalId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes, supportingUrl }),
        }
      );
      if (!res.ok) {
        alert(`Revisi Gagal: ${res.statusText}`);
        return;
      }
      const data = await res.json();
      console.log(data);
      if (data.status === "success") {
        alert("Revisi Berhasil");
        router.push("/lecturer/proposal");
      } else {
        alert("Revisi Gagal");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  if (loading) return <LoadingIndicator />;
  return (
    <div>
      <Breadcrumb title="Halaman Revisi" breadcrumbItems={breadcrumbItems} />
      <div className="bg-white rounded-lg mt-3 py-2">
        <h3 className="text-black text-2xl font-semibold px-4 pb-4 pt-2">
          Form Revisi Administrasi
        </h3>
        <hr className="mb-3" />
        <div className="flex gap-6 px-4">
          {/* Form Input (60%) */}
          <div className="w-3/5 bg-white p-4 rounded-lg shadow-md">
            <form onSubmit={handleFormRevisionSubmit}>
              <h3 className="text-black text-base self-start font-normal mb-1">
                Judul Buku:{" "}
                <span className="font-semibold">
                  {proposal?.publication_title || ""}
                </span>
              </h3>
              <h3 className="text-black text-base self-start font-normal mb-1">
                Status:{" "}
                <span className="bg-yellow-100 p-2 rounded-lg text-yellow-700">
                  {proposal?.status.status_name || ""}
                </span>
              </h3>
              <div className="mb-1">
                <label
                  htmlFor="notes"
                  className="text-black text-base self-start font-normal mb-1"
                >
                  Catatan Revisi:
                </label>
                <textarea
                  id="notes"
                  className="w-full border bg-inputColor border-borderInput p-3 rounded-xl text-black"
                  placeholder="Masukkan Catatan Keterangan Revisi"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-1">
                <label
                  htmlFor="supportingUrl"
                  className="text-black text-base self-start font-normal mb-1"
                >
                  Link URL Pendukung:
                </label>
                <div className="relative">
                  <input
                    id="supportingUrl"
                    type="url"
                    className="w-full border bg-inputColor border-borderInput p-3 rounded-xl text-black pr-12"
                    placeholder="Masukkan URL Pendukung"
                    value={supportingUrl}
                    onChange={(e) => setSupportingUrl(e.target.value)}
                    onBlur={() => {
                      if (
                        supportingUrl &&
                        !supportingUrl.startsWith("http://") &&
                        !supportingUrl.startsWith("https://")
                      ) {
                        setSupportingUrl(`https://${supportingUrl}`);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 border border-gray-400 bg-gray-100 p-2 rounded-lg hover:bg-gray-200 hover:border-black"
                    onClick={handlePaste}
                  >
                    <Clipboard className="h-5 w-5 text-black" />
                  </button>
                </div>
                <label className="pt-1 block text-sm font-normal text-black pb-1">
                  <CircleAlert className="inline pr-1" />
                  Isi Bila Diperlukan (Opsional)
                </label>
              </div>
              <div className="flex items-center gap-2 pt-4">
                <button className="bg-primary font-semibold px-3 py-2 rounded-lg text-white">
                    {loading ? "Loading..." : "Simpan"}
                  
                </button>
                <button
                  type="button"
                  className="bg-white border font-semibold border-red-600 px-3 py-2 rounded-lg text-red-600"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>

          {/* Log Aktivitas (40%) */}
          <div className="w-2/5 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-black text-lg font-semibold border-b pb-2 mb-4 -mx-4 px-4">
              Riwayat Catatan Revisi
            </h3>

            {loading ? (
              <LoadingIndicator />
            ) : activities.length > 0 ? (
              activities.map((activity: Activity, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg shadow max-w-xl ${
                    index === 0 ? "bg-gray-50" : "bg-green-50"
                  } mb-3`}
                >
                  <p className="text-md font-semibold text-black">
                    {activity.user?.name}
                  </p>
                  <p className="text-sm font-thin text-gray-600">
                    Status: {activity.status?.status_name}
                  </p>
                  <p className="text-xs text-gray-700">Catatan:</p>
                  <p className="text-sm text-gray-700">
                    {activity.publication_notes}
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
                  <p className="mt-2 text-xs text-gray-500">
                    {formatDate(activity.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-black">Belum Ada Aktivitas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
