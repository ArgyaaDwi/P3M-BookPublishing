"use client";
import { useEffect, useMemo, useState } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { formatDate } from "@/utils/dateFormatter";
import BadgeStatus from "@/components/BadgeStatus";
import { Eye, Trash2 } from "lucide-react";
import { PublicationType } from "@/types/publicationTypes";
import LoadingIndicator from "@/components/Loading";
import { Button } from "@mantine/core";

const AllProposalAdmisn = () => {
  const [proposals, setProposals] = useState<PublicationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/v1/admin/proposals?status=all");
        const data = await res.json();
        console.log("Proposals:", data);
        setProposals(data.data || []);
      } catch (error) {
        console.error("Error fetching proposals:", error);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = useMemo<MRT_ColumnDef<PublicationType>[]>(
    () => [
      {
        header: "No",
        size: 50,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "publication_title",
        header: "Judul Proposal",

        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold">
              {row.original.publication_title}
            </span>
            <span className="text-gray-500 font-medium">
              #{row.original.publication_ticket}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "lecturer.name",
        header: "Dosen Pemohon",
        Cell: ({ row }) =>
          row.original.lecturer?.name || "Dosen Tidak Diketahui",
      },
      {
        accessorKey: "createdAt",
        header: "Tanggal Pengajuan",
        Cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        accessorKey: "status.status_name",
        header: "Status",
        Cell: ({ row }) => (
          <BadgeStatus
            text={row.original.status?.status_name || "Status Tidak Diketahui"}
            color={
              row.original.current_status_id === 1 ||
              row.original.current_status_id === 4
                ? "badgePendingText"
                : row.original.current_status_id === 2
                ? "badgeRevText"
                : "badgeSuccessText"
            }
            bgColor={
              row.original.current_status_id === 1 ||
              row.original.current_status_id === 4
                ? "badgePending"
                : row.original.current_status_id === 2
                ? "badgeRev"
                : "badgeSuccess"
            }
          />
        ),
      },
      {
        accessorKey: "actions",
        header: "Aksi",
        enableSorting: false,
        enableColumnFilter: false,
        Cell: () => (
          <div className="flex items-center gap-2">
            <Button variant="light" color="blue">
              <Eye size={18} />
            </Button>
            <Button variant="light" color="red">
              <Trash2 size={18} />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    enableGlobalFilter: true,
    data: proposals,
    enableStickyHeader: true,
    enablePagination: true,
    enableHiding: false,
    enableColumnActions: false,
    enableSorting: true,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  if (loading) return <LoadingIndicator />;

  return <MantineReactTable table={table} />;
};

export default AllProposalAdmisn;
