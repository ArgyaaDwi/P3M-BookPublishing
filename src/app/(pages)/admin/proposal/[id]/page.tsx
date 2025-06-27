"use client";
import { useEffect, useState } from "react";
import { PublicationType } from "@/types/publicationTypes";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/BreadCrumb";
import Tabs from "@/components/Tabs";
import LoadingIndicator from "@/components/Loading";
import LogPublicationActivity from "@/components/publication/LogActivity";
import DetailProposalSection from "../components/DetailProposal";
import PublicationTimeline from "@/components/publication/PublicationTimeline";

const ProposalDetail = () => {
  const { id } = useParams();
  const proposalId = String(id);
  const [proposal, setProposal] = useState<PublicationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { name: "Dashboard", url: "/admin/dashboard" },
    { name: "Ajuan", url: "/admin/proposal" },
    { name: "Loading...", url: `/admin/proposal/${proposalId}` },
  ]);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await fetch(`/api/v1/admin/proposals/${proposalId}`);
        const data = await res.json();
        console.log("Detail Proposal:", data);

        if (data.status === "success") {
          setProposal(data.data || null);
          setBreadcrumbItems([
            { name: "Dashboard", url: "/admin/dashboard" },
            { name: "Ajuan", url: "/admin/proposal" },
            {
              name: data.data.publication_title,
              url: `/admin/lecturer/${proposalId}`,
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
    return <p className="text-center text-gray-500">Ajuan tidak ditemukan.</p>;
  const tabItems = [
    {
      title: "Overview",
      content: (
        <div>
          <DetailProposalSection proposal={proposal} />
        </div>
      ),
    },
    {
      title: "Timeline",
      content: (
        <div>
          <PublicationTimeline publicationId={proposal.id}
          currentStatusId={proposal.current_status_id} />    
        </div>
      ),
    },
    {
      title: "Log Aktivitas",
      content: (
        <div>
          <h3 className="text-black font-bold">Riwayat Aktivitas</h3>
          <LogPublicationActivity publicationId={Number(id)} />
        </div>
      ),
    },
  ];
  return (
    <div>
      <Breadcrumb title="Detail Ajuan" breadcrumbItems={breadcrumbItems} />
      <div className="bg-white rounded-lg mt-3 overflow-hidden pb-4">
        <Tabs tabs={tabItems} />
      </div>
    </div>
  );
};

export default ProposalDetail;
