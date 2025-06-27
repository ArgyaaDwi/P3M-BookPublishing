import prisma from "@/lib/prisma";

export async function getPublisherChartData(publisherId: number) {
  const customOrder = [5, 6, 9, 7, 10, 11, 8];

  const grouped = await prisma.publication.groupBy({
    by: ["current_status_id"],
    _count: true,
    where: {
      publisher_id: publisherId,
    },
  });

  const allStatus = await prisma.publicationStatus.findMany();

  const filteredAndSortedStatus = allStatus
    .filter((status) => customOrder.includes(status.id))
    .sort((a, b) => {
      return customOrder.indexOf(a.id) - customOrder.indexOf(b.id);
    });

  const labels = filteredAndSortedStatus.map((s) => s.status_name);
  const data = filteredAndSortedStatus.map((s) => {
    const found = grouped.find((g) => g.current_status_id === s.id);
    return found?._count || 0;
  });

  return { labels, data };
}
