// import prisma from "@/lib/prisma";

// export async function getAdminBarChartData() {
//   const majors = await prisma.major.findMany();
//   const counts = await prisma.publication.groupBy({
//     by: ["user_id"],
//     _count: true,
//   });
//   const lecturers = await prisma.user.findMany({
//     where: { role: "DOSEN" },
//     select: {
//       id: true,
//       major_id: true,
//     },
//   });
//   const majorCounts: Record<number, number> = {};
//   for (const count of counts) {
//     const user = lecturers.find((u) => u.id === count.user_id);
//     if (user?.major_id) {
//       majorCounts[user.major_id] = (majorCounts[user.major_id] || 0) + count._count;
//     }
//   }

//   const labels = majors.map((m) => m.major_name);
//   const data = majors.map((m) => majorCounts[m.id] || 0);

//   return { labels, data };
// }
// src/lib/chart/getAdminBarChartData.ts
import prisma from "@/lib/prisma";

export async function getAdminBarChartData() {
  const majors = await prisma.major.findMany();
  const lecturers = await prisma.user.findMany({
    where: { role: "DOSEN" },
    select: { id: true, major_id: true },
  });

  const counts = await prisma.publication.groupBy({
    by: ["user_id"],
    _count: true,
  });

  const majorCounts: Record<number, number> = {};
  for (const count of counts) {
    const user = lecturers.find((u) => u.id === count.user_id);
    if (user?.major_id) {
      majorCounts[user.major_id] = (majorCounts[user.major_id] || 0) + count._count;
    }
  }

  const labels = majors.map((m) => m.major_name);
  const data = majors.map((m) => majorCounts[m.id] || 0);

  return { labels, data };
}
