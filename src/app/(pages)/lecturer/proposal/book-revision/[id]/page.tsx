"use client";
import React, { useState, useEffect } from "react";
import { PublicationType } from "@/types/publicationTypes";
import Breadcrumb from "@/components/BreadCrumb";
import { Eye, Clipboard } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import LoadingIndicator from "@/components/Loading";
import { formatDate } from "@/utils/dateFormatter";
import { handlePasteText } from "@/utils/handlePaste";
import HeaderForm from "@/components/form/HeaderForm";
import ErrorValidation from "@/components/form/ErrorValidation";
import Swal from "sweetalert2";
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
export default function SubmitBookRevision() {
  const [proposal, setProposal] = useState<PublicationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const { id } = useParams();
  const proposalId = String(id);
  const [notes, setNotes] = useState<string>("");
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { name: "Dashboard", url: "/lecturer/dashboard" },
    { name: "Ajuan", url: "/lecturer/proposal" },
    { name: "Loading...", url: `/lecturer/lecturer/${proposalId}` },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await fetch(`/api/v1/lecturer/proposals/${proposalId}`);
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
        const res = await fetch(`/api/v1/proposals/log-revision/${proposalId}`);
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
    if (url) setDocumentUrl(url);
  };
  const handleFormRevisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!notes) {
      setError(null);
      setTimeout(() => {
        setError("Pesan Respon terhadap Revisi wajib diisi");
      }, 10);
      return;
    }
    if (!documentUrl) {
      setError(null);
      setTimeout(() => {
        setError("URL Draf Buku wajib diisi");
      }, 10);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/v1/lecturer/proposals/book-revision/${proposalId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes, documentUrl }),
        }
      );
      if (!res.ok) {
        await Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal revisi: ",
          confirmButtonColor: "#d33",
        });
        return;
      }
      const data = await res.json();
      console.log(data);
      if (data.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Revisi berhasil!",
          confirmButtonColor: "#3085d6",
        });
        router.push("/lecturer/proposal");
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal revisi: ",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (loading) return <LoadingIndicator />;
  return (
    <div>
      <Breadcrumb title="Halaman Revisi" breadcrumbItems={breadcrumbItems} />
      <div className="bg-white rounded-lg mt-3 py-2">
        <HeaderForm title="Form Revisi Penerbitan Buku" />
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
              {error && <ErrorValidation message={error} duration={3000} />}
              <div className="mb-1">
                <label
                  htmlFor="notes"
                  className="text-black text-base self-start font-normal mb-1"
                >
                  Respon Terhadap Revisi <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="notes"
                  className="w-full border bg-inputColor border-borderInput p-3 rounded-xl text-black"
                  placeholder="Masukkan Pesan Respon terhadap Revisi"
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
                  Link URL Revisi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="supportingUrl"
                    type="url"
                    className="w-full border bg-inputColor border-borderInput p-3 rounded-xl text-black pr-12"
                    placeholder="Masukkan URL Pendukung"
                    value={documentUrl}
                    onChange={(e) => setDocumentUrl(e.target.value)}
                    onBlur={() => {
                      if (
                        documentUrl &&
                        !documentUrl.startsWith("http://") &&
                        !documentUrl.startsWith("https://")
                      ) {
                        setDocumentUrl(`https://${documentUrl}`);
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
              </div>
              <div className="flex items-center gap-2 pt-4">
                {/* <button className="bg-primary font-semibold px-3 py-2 rounded-lg text-white">
                  {loading ? "Loading..." : "Simpan"}
                </button> */}
                <button
                  className="bg-primary font-semibold px-3 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
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

          <div className="w-2/5 bg-white p-4 rounded-lg shadow-md max-h-[500px] overflow-y-auto">
            <h3 className="text-black text-lg font-semibold border-b pb-2 mb-4 -mx-4 px-4">
              Riwayat Catatan Revisi
            </h3>

            {loading ? (
              <LoadingIndicator />
            ) : activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((activity: Activity, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg shadow ${
                      index === 0 ? "bg-gray-50" : "bg-green-50"
                    }`}
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
                        className="text-blue-500 text-xs flex items-center gap-1 mt-2"
                      >
                        <Eye className="w-4 h-4" />
                        Lihat Url Lampiran
                      </a>
                    )}

                    <p className="mt-2 text-xs text-gray-500">
                      {formatDate(activity.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-black">Belum Ada Aktivitas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
