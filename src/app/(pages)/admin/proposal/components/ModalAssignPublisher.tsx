"use client";
import React, { useState, useEffect } from "react";
import { CircleAlert, Clipboard } from "lucide-react";
import { Publisher } from "@/types/publisherTypes";
import { handlePasteText } from "@/utils/handlePaste";
import Select from "@/components/form/Select";
import ErrorValidation from "@/components/form/ErrorValidation";
import Swal from "sweetalert2";
type ProposalType = {
  id: number;
  current_status_id: number;
  status: { status_name: string };
};

type ModalPublisherProps = {
  proposal: ProposalType;
};

const ModalPublisher: React.FC<ModalPublisherProps> = ({
  proposal: publication,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [publisherList, setPublisherList] = useState<Publisher[]>([]);
  const [selectedPublisher, setSelectedPublisher] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const [supportingUrl, setSupportingUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("/api/v1/admin/publishers");
        const result = await response.json();
        if (result.status === "success" && Array.isArray(result.data)) {
          setPublisherList(result.data);
        }
      } catch (error) {
        console.error("Error fetching publishers:", error);
      }
    };
    getData();
  }, []);
  const handlePaste = async () => {
    const url = await handlePasteText();
    if (url) setSupportingUrl(url);
  };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedPublisher) {
      setError(null);
      setTimeout(() => {
        setError("Penerbit wajib diisi");
      }, 10);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/v1/admin/proposals/assign-publisher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId: publication?.id,
          publisherId: selectedPublisher,
          note,
          supportingUrl,
        }),
      });

      const result = await response.json();
      if (response.ok && result.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Proposal berhasil di-assign!",
          confirmButtonColor: "#3085d6",
        });
        // alert("Proposal berhasil di-assign!");
        setIsOpen(false);
        window.location.reload();
      } else {
        console.error("Gagal mengassign proposal:", result.message);
        await Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal assign: " + result.message,
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error assigning publisher:", error);
      alert("Terjadi kesalahan. Coba lagi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button
        className="bg-teal-500 hover:bg-teal-700 text-white px-3 py-1 rounded"
        onClick={() => setIsOpen(true)}
      >
        Assign{" "}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8"> */}
          <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-4">
              Assign Penerbit
            </h3>
            <form>
              {error && <ErrorValidation message={error} duration={3000} />}
              <Select
                label="Pilih Penerbit"
                value={selectedPublisher?.toString() || ""}
                onChange={(val) => setSelectedPublisher(Number(val))}
                placeholder=".:: Pilih Penerbit ::."
                isRequired={true}
                options={[
                  ...publisherList.map((p) => ({
                    value: p.id.toString(),
                    label: p.name,
                  })),
                ]}
              />
              <div className="mb-1">
                <label className="block font-medium text-black pb-1">
                  Catatan
                </label>
                <textarea
                  className="w-full border border-gray-400 p-3 rounded-xl text-black"
                  placeholder="Masukkan Catatan Keterangan yang Diinginkan"
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
                <label className="block text-sm text-gray-600 pb-2">
                  <CircleAlert className="inline pr-1" />
                  Isi Bila Diperlukan (Opsional)
                </label>
              </div>
              <div className="mb-5">
                <label className="block font-medium text-black pb-1">
                  Link URL Pendukung:
                </label>
                <div className="relative">
                  <input
                    type="url"
                    className="w-full border border-gray-400 p-3 rounded-xl text-black pr-12"
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
                <label className="pt-1 block text-sm font-normal text-gray-600 pb-1">
                  <CircleAlert className="inline pr-1" />
                  Isi Bila Diperlukan (Opsional)
                </label>
              </div>
              <div className="flex items-center gap-2">
                {/* <button
                  type="submit"
                  className="bg-primary font-semibold px-3 py-2 rounded-lg text-white"
                  onClick={handleSave}
                >
                  Simpan
                </button> */}
                <button
                  type="submit"
                  className="bg-primary font-semibold px-3 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                  onClick={handleSave}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
                <button
                  type="button"
                  className="bg-white border font-semibold border-red-600 px-3 py-2 rounded-lg text-red-600"
                  onClick={() => setIsOpen(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalPublisher;
