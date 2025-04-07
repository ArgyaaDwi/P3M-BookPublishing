"use client";
import { useEffect, useState } from "react";
import { PublicationType } from "@/types/publicationTypes";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/BreadCrumb";
import Tabs from "@/components/Tabs";
import { formatDate } from "@/utils/dateFormatter";
import LoadingIndicator from "@/components/Loading";
import LogActivityPublisher from "../components/LogActivity";
import InvoiceSection from "../components/InvoiceSection";
const ProposalDetailPublisher = () => {
  const { id } = useParams();
  const proposalId = String(id);
  const [proposal, setProposal] = useState<PublicationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { name: "Dashboard", url: "/publisher/dashboard" },
    { name: "Ajuan", url: "/publisher/proposal" },
    { name: "Loading...", url: `/publisher/publisher/${proposalId}` },
  ]);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await fetch(`/api/admin/proposals/${proposalId}`);
        const data = await res.json();
        console.log("Detail Proposal:", data);

        if (data.status === "success") {
          setProposal(data.data || null);
          setBreadcrumbItems([
            { name: "Dashboard", url: "/publisher/dashboard" },
            { name: "Ajuan", url: "/publisher/proposal" },
            {
              name: data.data.publication_title,
              url: `/publisher/lecturer/${proposalId}`,
            },
          ]);
        } else {
          console.error("Failed to fetch proposal:", data.message);
        }
      } catch (error) {
        console.error("Error fetching proposal:", error);
        setProposal(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [proposalId]);

  if (loading) return <LoadingIndicator />;
  if (!proposal)
    return (
      <p className="text-center text-gray-500">Ajuan Buku tidak ditemukan.</p>
    );
  const tabItems = [
    {
      title: "Informasi Ajuan Buku",
      content: (
        <div>
          <h1 className="text-black text-xl font-semibold">
            {proposal.publication_title}
          </h1>
          <p className="text-gray-500 font-thin">
            Ticket: #{proposal.publication_ticket}
          </p>
          <p className="text-black">
            Dosen Pengusul: {proposal.lecturer?.name || "Tidak diketahui"}
          </p>
          <p className="text-black">
            Status: {proposal.status?.status_name || "Tidak diketahui"}
          </p>
          <p className="text-black">
            Diajukan pada: {formatDate(proposal.createdAt)}
          </p>{" "}
        </div>
      ),
    },
    {
      title: "Log Aktivitas Ajuan Buku",
      content: (
        <div>
          <h3 className="text-black font-bold">Riwayat Aktivitas</h3>
          <LogActivityPublisher publicationId={Number(id)} />
        </div>
      ),
    },
    {
      title: "Invoice",
      content: (
        <div>
          
          <InvoiceSection proposalId={Number(id)}/>
        </div>
      ),
    },
  ];
  return (
    <div>
      <Breadcrumb title="Detail Ajuan Buku" breadcrumbItems={breadcrumbItems} />
      <div className="bg-white rounded-lg mt-3 overflow-hidden pb-4">
        <Tabs tabs={tabItems} />
      </div>
    </div>
  );
};

export default ProposalDetailPublisher;
