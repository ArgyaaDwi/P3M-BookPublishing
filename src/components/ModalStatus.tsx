// "use client";
// import React, { useState, useEffect } from "react";
// import { Pencil, CircleAlert } from "lucide-react";
// import StatusType from "@/types/statusTypes";
// type ModalStatusProps = {
//   proposal: {
//     id: number;
//     current_status_id: number;
//     status: { status_name: string };
//   } | null;
// };

// const ModalStatus: React.FC<ModalStatusProps> = ({ proposal }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [statusList, setStatusList] = useState<StatusType[]>([]);
//   const [currentStatus, setCurrentStatus] = useState<string>("");
//   const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

//   useEffect(() => {
//     const getStatus = async () => {
//       try {
//         const response = await fetch("/api/admin/status");
//         const result = await response.json();
//         if (result.status === "success" && Array.isArray(result.data)) {
//           setStatusList(result.data);
//         }
//       } catch (error) {
//         console.error("Error fetching status:", error);
//       }
//     };
//     getStatus();
//   }, []);
//   useEffect(() => {
//     if (proposal) {
//       setCurrentStatus(
//         proposal.status?.status_name || "Status Tidak Diketahui"
//       );
//       // setSelectedStatus(
//       //   proposal.status?.status_name || "Status Tidak Diketahui"
//       // );
//       setSelectedStatus(null);
//     }
//   }, [proposal, isOpen]);

//   return (
//     <div>
//       <button
//         className="bg-yellow-100 p-2 rounded-lg text-yellow-500 hover:text-yellow-800 flex gap-2"
//         onClick={() => setIsOpen(true)}
//       >
//         <Pencil />
//         Ubah Status
//       </button>
//       {isOpen && proposal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8">
//             <div className="flex items-center justify-center pb-3">
//               <h3 className="text-2xl font-semibold text-gray-900 ">
//                 Update Status Ajuan Proposal
//               </h3>
//               {/* <button
//                 className="text-gray-400 hover:text-gray-900"
//                 onClick={() => setIsOpen(false)}
//               >
//                 ✖
//               </button> */}
//             </div>
//             <form className="mt-4">
//               <div className="mb-3">
//                 <label className="block text-sm font-medium text-black pb-1">
//                   Status Sekarang
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-400 p-3 rounded-xl text-black text-center"
//                   value={currentStatus}
//                   disabled
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="block text-sm font-medium text-black pb-1">
//                   Pilih Status Baru
//                 </label>
//                 <select
//                   className="w-full border border-gray-400 p-3 rounded-xl text-black text-center"
//                   value={selectedStatus || ""}
//                   onChange={(e) => setSelectedStatus(e.target.value)}
//                 >
//                   <option value="">.:: Pilih Status ::.</option>
//                   {statusList.map((status) => (
//                     <option key={status.id} value={status.status_name}>
//                       {status.status_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="mb-1">
//                 <label className="block text-sm font-medium text-black pb-1">
//                   Catatan
//                 </label>
//                 <textarea
//                   className="w-full border border-gray-400 p-3 rounded-xl text-black"
//                   placeholder="Masukkan Catatan Keterangan yang Diinginkan"
//                   rows={4}
//                 ></textarea>
//               </div>
//               <div className="mb-5">
//                 <label className="block text-sm font-medium text-black pb-1">
//                   Link URL Pendukung
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-400 p-3 rounded-xl text-black"
//                   placeholder="Masukkan URL Pendukung"
//                 />
//                 <label className="pt-1 block text-sm font-normal text-black pb-1">
//                   <CircleAlert className="inline pr-1" />
//                   Isi Bila Diperlukan (Opsional)
//                 </label>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   type="submit"
//                   className="bg-primary font-semibold px-3 py-2 rounded-lg text-white"
//                 >
//                   Simpan
//                 </button>
//                 <button
//                   type="button"
//                   className="bg-white border font-semibold border-red-600 px-3 py-2 rounded-lg text-red-600"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Batal
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ModalStatus;
"use client";
import React, { useState, useEffect } from "react";
import { Pencil, CircleAlert } from "lucide-react";
import StatusType from "@/types/statusTypes";

type ModalStatusProps = {
  proposal: {
    id: number;
    current_status_id: number;
    status: { status_name: string };
  } | null;
};

const ModalStatus: React.FC<ModalStatusProps> = ({ proposal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [statusList, setStatusList] = useState<StatusType[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [note, setNote] = useState<string>("");
  const [supportingUrl, setSupportingUrl] = useState<string>("");

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await fetch("/api/admin/status");
        const result = await response.json();
        if (result.status === "success" && Array.isArray(result.data)) {
          setStatusList(result.data);
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };
    getStatus();
  }, []);

  useEffect(() => {
    if (proposal) {
      setCurrentStatus(
        proposal.status?.status_name || "Status Tidak Diketahui"
      );
      setSelectedStatus(null);
      setNote("");
      setSupportingUrl("");
    }
  }, [proposal, isOpen]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposal || !selectedStatus) return;

    try {
      const res = await fetch(`/api/admin/status/${proposal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newStatusId: selectedStatus,
          note,
          supportingUrl,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Status berhasil diperbarui!");
        setIsOpen(false);
        window.location.reload();
      } else {
        alert(`Gagal update: ${result.error || "Terjadi kesalahan"}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div>
      <button
        className="bg-yellow-100 p-2 rounded-lg text-yellow-500 hover:text-yellow-800 flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Pencil className="w-5 h-5" />
        Ubah Status
      </button>

      {isOpen && proposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-4">
              Update Status Ajuan Proposal
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-black pb-1">
                  Status Sekarang
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-400 p-3 rounded-xl text-black text-center"
                  value={currentStatus}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-black pb-1">
                  Pilih Status Baru
                </label>
                <select
                  className="w-full border border-gray-400 p-3 rounded-xl text-black text-center"
                  value={selectedStatus || ""}
                  onChange={(e) => setSelectedStatus(Number(e.target.value))}
                >
                  <option value="">.:: Pilih Status ::.</option>
                  {statusList.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.status_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-1">
                <label className="block text-sm font-medium text-black pb-1">
                  Catatan
                </label>
                <textarea
                  className="w-full border border-gray-400 p-3 rounded-xl text-black"
                  placeholder="Masukkan Catatan Keterangan yang Diinginkan"
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-black pb-1">
                  Link URL Pendukung
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-400 p-3 rounded-xl text-black"
                  placeholder="Masukkan URL Pendukung"
                  value={supportingUrl}
                  onChange={(e) => setSupportingUrl(e.target.value)}
                />
                <label className="pt-1 block text-sm font-normal text-black pb-1">
                  <CircleAlert className="inline pr-1" />
                  Isi Bila Diperlukan (Opsional)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="bg-primary font-semibold px-3 py-2 rounded-lg text-white"
                >
                  Simpan
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

export default ModalStatus;
