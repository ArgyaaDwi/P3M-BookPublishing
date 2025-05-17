// "use client";
// import { useEffect, useState } from "react";
// import { Publication } from "@/types/interfaces";
// import { formatDate } from "@/utils/dateFormatter";
// import BadgeStatus from "@/components/BadgeStatus";
// import LoadingIndicator from "@/components/Loading";
// import { PublicationType } from "@/types/publicationTypes";
// import { useRouter } from "next/navigation";
// import { Eye, SquarePen, Trash2, Search } from "lucide-react";
// import TableHeader from "@/components/TableHeader";
// import ExportButton from "@/components/button/ExportButton";
// import CreateButton from "@/components/button/CreateButton";
// import Image from "next/image";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const LecturerProposals = () => {
//   const [proposals, setProposals] = useState<PublicationType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const [filteredProposals, setFilteredProposals] = useState<Publication[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleExportPDF = () => {
//     const doc = new jsPDF();
//     autoTable(doc, {
//       head: [
//         ["No", "Judul Ajuan", "Kode Ajuan", "Status", "Tanggal Pengajuan"],
//       ],
//       body: proposals.map((proposal, index) => [
//         index + 1,
//         proposal.publication_title,
//         proposal.publication_ticket || "-",
//         proposal.status?.status_name,
//         formatDate(proposal.createdAt),
//       ]),
//     });

//     doc.save("data-my-allproposal.pdf");
//   };
//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     console.log(event.target.value);
//   };
//   const handleExportExcel = () => {
//     console.log("Export Excel");
//   };
//   const handleDeleteProposalById = async (id: number) => {
//     if (
//       !confirm(
//         `Apakah kamu yakin ingin menghapus proposal dengan judul "${
//           proposals.find((proposal) => proposal.id === id)?.publication_title
//         }" ini?`
//       )
//     ) {
//       return;
//     }
//     try {
//       const response = await fetch(`/api/lecturer/proposals/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id }),
//       });

//       const result = await response.json();
//       if (result.status === "success") {
//         alert("Proposal berhasil dihapus.");
//       } else {
//         alert("Gagal menghapus proposal: " + result.message);
//       }
//     } catch (error) {
//       console.error("Error deleting proposal:", error);
//       alert("Terjadi kesalahan saat menghapus proposal.");
//     }
//   };
//   useEffect(() => {
//     const fetchProposals = async () => {
//       try {
//         const res = await fetch("/api/lecturer/proposals?status=all");
//         const data = await res.json();
//         if (data.status === "success") {
//           setProposals(data.data || []);
//         } else {
//           console.error("Failed to fetch proposals:", data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching proposals:", error);
//         setProposals([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProposals();
//   }, []);

//   if (loading) return <LoadingIndicator />;

//   return proposals.length > 0 ? (
//     <div>
//       <div className="flex justify-between pb-2">
//         <div className="flex gap-2">
//           <ExportButton type="pdf" onClick={handleExportPDF} />
//           <ExportButton type="excel" onClick={handleExportExcel} />
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Cari di semua kolom..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//               className="border text-primary  border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary w-64"
//             />
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             {searchTerm && (
//               <button
//                 onClick={() => setSearchTerm("")}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 ×
//               </button>
//             )}
//           </div>
//           <CreateButton href="/lecturer/proposal/create">
//             + Buat Ajuan
//           </CreateButton>
//         </div>
//       </div>
//       <table className="w-full text-left border border-gray-300 mt-2">
//         <thead>
//           <TableHeader
//             columns={[
//               "No",
//               "Judul Ajuan",
//               "Status",
//               "Tanggal Pengajuan",
//               "Aksi",
//             ]}
//           />
//         </thead>
//         <tbody>
//           {proposals.map((proposal, index) => (
//             <tr key={proposal.id}>
//               <td className="p-4 text-black border">{index + 1}</td>
//               <td className="p-4 text-black border font-semibold">
//                 <div className="flex flex-col">
//                   <span>{proposal.publication_title}</span>
//                   <span className="text-gray-500 font-medium">
//                     #{proposal.publication_ticket}
//                   </span>
//                 </div>
//               </td>
//               <td className="p-4 text-black border">
//                 <BadgeStatus
//                   text={
//                     proposal.status?.status_name || "Status Tidak Diketahui"
//                   }
//                   color={
//                     proposal.current_status_id === 1 ||
//                     proposal.current_status_id === 4 ||
//                     proposal.current_status_id === 5 ||
//                     proposal.current_status_id === 9
//                       ? "badgePendingText"
//                       : proposal.current_status_id === 2 ||
//                         proposal.current_status_id === 6
//                       ? "badgeRevText"
//                       : "badgeSuccessText"
//                   }
//                   bgColor={
//                     proposal.current_status_id === 1 ||
//                     proposal.current_status_id === 4 ||
//                     proposal.current_status_id === 5 ||
//                     proposal.current_status_id === 9
//                       ? "badgePending"
//                       : proposal.current_status_id === 2 ||
//                         proposal.current_status_id === 6
//                       ? "badgeRev"
//                       : "badgeSuccess"
//                   }
//                 />
//               </td>
//               <td className="p-4 text-black border">
//                 {formatDate(proposal.createdAt)}
//               </td>
//               <td className="p-4 text-black border">
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() =>
//                       router.push(`/lecturer/proposal/${proposal.id}`)
//                     }
//                     className="bg-blue-100 p-2 rounded-lg text-blue-500 hover:text-blue-800 transition-all duration-300 ease-in-out"
//                   >
//                     <Eye />
//                   </button>
//                   {proposal.current_status_id === 1 && (
//                     <button
//                       className="bg-red-100 p-2 rounded-lg text-red-500 hover:text-red-800 transition-all duration-300 ease-in-out"
//                       onClick={() => handleDeleteProposalById(proposal.id)}
//                     >
//                       <Trash2 />
//                     </button>
//                   )}
//                   {proposal.current_status_id === 2 && (
//                     <button
//                       className="bg-yellow-100 p-2 rounded-lg text-yellow-700 hover:text-yellow-900 transition-all duration-300 ease-in-out flex items-center gap-2"
//                       onClick={() =>
//                         router.push(
//                           `/lecturer/proposal/administration-revision/${proposal.id}`
//                         )
//                       }
//                     >
//                       <SquarePen />
//                       Revisi
//                     </button>
//                   )}
//                   {proposal.current_status_id === 6 && (
//                     <button
//                       className="bg-yellow-100 p-2 rounded-lg text-yellow-700 hover:text-yellow-900 transition-all duration-300 ease-in-out flex items-center gap-2"
//                       onClick={() =>
//                         router.push(
//                           `/lecturer/proposal/book-revision/${proposal.id}`
//                         )
//                       }
//                     >
//                       <SquarePen />
//                       Revisi
//                     </button>
//                   )}
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   ) : (
//     <div className="w-full flex flex-col items-center justify-center mt-8">
//       <Image
//         src="/assets/images/nodata.jpg"
//         alt="Data kosong"
//         width={240}
//         height={160}
//         className="opacity-70"
//       />
//       <p className="text-gray-500 mt-4 text-center">
//         Belum ada proposal yang diajukan.
//       </p>
//     </div>
//   );
// };

// export default LecturerProposals;
"use client";
import { useEffect, useState } from "react";
// import { Publication } from "@/types/interfaces";
import { formatDate } from "@/utils/dateFormatter";
import BadgeStatus from "@/components/BadgeStatus";
import LoadingIndicator from "@/components/Loading";
import { PublicationType } from "@/types/publicationTypes";
import { useRouter } from "next/navigation";
import { Eye, SquarePen, Trash2, Search } from "lucide-react";
import TableHeader from "@/components/TableHeader";
import ExportButton from "@/components/button/ExportButton";
import CreateButton from "@/components/button/CreateButton";
import Image from "next/image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getBadgeVariant } from "@/utils/statusPublicationHelper";

const LecturerProposals = () => {
  const [proposals, setProposals] = useState<PublicationType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [filteredProposals, setFilteredProposals] = useState<PublicationType[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");

  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        ["No", "Judul Ajuan", "Kode Ajuan", "Status", "Tanggal Pengajuan"],
      ],
      body: filteredProposals.map((proposal, index) => [
        index + 1,
        proposal.publication_title,
        proposal.publication_ticket || "-",
        proposal.status?.status_name,
        formatDate(proposal.createdAt),
      ]),
    });

    doc.save("data-my-allproposal.pdf");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      setFilteredProposals(proposals);
    } else {
      const filtered = proposals.filter((proposal) => {
        const searchString = value.toLowerCase();
        return (
          proposal.publication_title?.toLowerCase().includes(searchString) ||
          proposal.publication_ticket?.toLowerCase().includes(searchString) ||
          proposal.status?.status_name?.toLowerCase().includes(searchString) ||
          formatDate(proposal.createdAt)?.toLowerCase().includes(searchString)
        );
      });

      setFilteredProposals(filtered);
    }
  };

  const handleExportExcel = () => {
    console.log("Export Excel");
  };

  const handleDeleteProposalById = async (id: number) => {
    if (
      !confirm(
        `Apakah kamu yakin ingin menghapus proposal dengan judul "${
          proposals.find((proposal) => proposal.id === id)?.publication_title
        }" ini?`
      )
    ) {
      return;
    }
    try {
      const response = await fetch(`/api/v1/lecturer/proposals/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Proposal berhasil dihapus.");
        setProposals(proposals.filter((proposal) => proposal.id !== id));
        setFilteredProposals(
          filteredProposals.filter((proposal) => proposal.id !== id)
        );
      } else {
        alert("Gagal menghapus proposal: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting proposal:", error);
      alert("Terjadi kesalahan saat menghapus proposal.");
    }
  };

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await fetch("/api/v1/lecturer/proposals?status=all");
        const data = await res.json();
        if (data.status === "success") {
          const proposalsData = data.data || [];
          setProposals(proposalsData);
          setFilteredProposals(proposalsData);
        } else {
          console.error("Failed to fetch proposals:", data.message);
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
        setProposals([]);
        setFilteredProposals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  if (loading) return <LoadingIndicator />;

  return filteredProposals.length > 0 || searchTerm ? (
    <div>
      <div className="flex justify-between pb-2">
        <div className="flex gap-2">
          <ExportButton type="pdf" onClick={handleExportPDF} />
          <ExportButton type="excel" onClick={handleExportExcel} />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari di semua kolom..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border text-primary border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary w-64"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilteredProposals(proposals);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
          <CreateButton href="/lecturer/proposal/create">
            + Buat Ajuan
          </CreateButton>
        </div>
      </div>
      {filteredProposals.length > 0 ? (
        <table className="w-full text-left border border-gray-300 mt-2">
          <thead>
            <TableHeader
              columns={[
                "No",
                "Judul Ajuan",
                "Status",
                "Tanggal Pengajuan",
                "Aksi",
              ]}
            />
          </thead>
          <tbody>
            {filteredProposals.map((proposal, index) => (
              <tr key={proposal.id}>
                <td className="p-4 text-black border">{index + 1}</td>
                <td className="p-4 text-black border font-semibold">
                  <div className="flex flex-col">
                    <span>{proposal.publication_title}</span>
                    <span className="text-gray-500 font-medium">
                      #{proposal.publication_ticket}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-black border">
                  {(() => {
                    const [bg, color] = getBadgeVariant(
                      proposal.current_status_id
                    );
                    return (
                      <BadgeStatus
                        text={
                          proposal.status?.status_name ||
                          "Status Tidak Diketahui"
                        }
                        color={color}
                        bgColor={bg}
                      />
                    );
                  })()}
                </td>
                <td className="p-4 text-black border">
                  {formatDate(proposal.createdAt)}
                </td>
                <td className="p-4 text-black border">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        router.push(`/lecturer/proposal/${proposal.id}`)
                      }
                      className="bg-blue-100 p-2 rounded-lg text-blue-500 hover:text-blue-800 transition-all duration-300 ease-in-out"
                    >
                      <Eye />
                    </button>
                    {proposal.current_status_id === 1 && (
                      <button
                        className="bg-red-100 p-2 rounded-lg text-red-500 hover:text-red-800 transition-all duration-300 ease-in-out"
                        onClick={() => handleDeleteProposalById(proposal.id)}
                      >
                        <Trash2 />
                      </button>
                    )}
                    {proposal.current_status_id === 2 && (
                      <button
                        className="bg-yellow-100 p-2 rounded-lg text-yellow-700 hover:text-yellow-900 transition-all duration-300 ease-in-out flex items-center gap-2"
                        onClick={() =>
                          router.push(
                            `/lecturer/proposal/administration-revision/${proposal.id}`
                          )
                        }
                      >
                        <SquarePen />
                        Revisi
                      </button>
                    )}
                    {proposal.current_status_id === 6 && (
                      <button
                        className="bg-yellow-100 p-2 rounded-lg text-yellow-700 hover:text-yellow-900 transition-all duration-300 ease-in-out flex items-center gap-2"
                        onClick={() =>
                          router.push(
                            `/lecturer/proposal/book-revision/${proposal.id}`
                          )
                        }
                      >
                        <SquarePen />
                        Revisi
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="w-full flex flex-col items-center justify-center mt-8 border border-gray-300 rounded-lg p-8">
          <Image
            src="/assets/images/nodata.jpg"
            alt="Data kosong"
            width={240}
            height={160}
            className="opacity-70"
          />
          <p className="text-gray-500 mt-4 text-center">
            Tidak ada data yang sesuai dengan pencarian &quot;{searchTerm}
            &quot;.
          </p>
        </div>
      )}
    </div>
  ) : (
    <div className="w-full flex flex-col items-center justify-center mt-8">
      <Image
        src="/assets/images/nodata.jpg"
        alt="Data kosong"
        width={240}
        height={160}
        className="opacity-70"
      />
      <p className="text-gray-500 mt-4 text-center">
        Belum ada proposal yang diajukan.
      </p>
    </div>
  );
};

export default LecturerProposals;
