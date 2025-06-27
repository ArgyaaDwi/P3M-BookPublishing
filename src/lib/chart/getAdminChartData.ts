// import prisma from "@/lib/prisma";
// export async function getAdminChartData() {
//   const grouped = await prisma.publication.groupBy({
//     by: ["current_status_id"],
//     _count: true,
//   });

//   const allStatus = await prisma.publicationStatus.findMany();
//   const labels = allStatus.map((s) => s.status_name);
//   const data = allStatus.map((s) => {
//     const found = grouped.find((g) => g.current_status_id === s.id);
//     return found?._count || 0;
//   });

//   return { labels, data };
// }
import prisma from "@/lib/prisma";

export async function getAdminChartData() {
  const customOrder = [1, 2, 4, 3, 5, 6, 9, 7, 10, 11, 8];
  const allStatus = await prisma.publicationStatus.findMany();

  const grouped = await prisma.publication.groupBy({
    by: ["current_status_id"],
    _count: true,
  });

  const sortedStatus = allStatus.sort((a, b) => {
    const indexA = customOrder.indexOf(a.id);
    const indexB = customOrder.indexOf(b.id);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });

  const labels = sortedStatus.map((s) => s.status_name);
  const data = sortedStatus.map((s) => {
    const found = grouped.find((g) => g.current_status_id === s.id);
    return found?._count || 0;
  });

  return { labels, data };
}
