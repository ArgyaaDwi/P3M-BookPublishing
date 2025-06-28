// import { cookies } from "next/headers";
// import { verifySessionToken } from "@/lib/encrypt";

// import prisma from "@/lib/prisma";
// import Link from "next/link";

// export const dynamic = "force-dynamic";

// export default async function PublikasiPage() {
//   const cookieStore = await cookies();
//   const sessionToken = cookieStore.get("session")?.value;
//   //   let session = null;
//   let session: { name?: string; role?: string } | null = null;

//   if (sessionToken) {
//     // session = await verifySessionToken(sessionToken);
//     session = (await verifySessionToken(sessionToken)) as {
//       name?: string;
//       role?: string;
//     };
//   }
//   const books = await prisma.publication.findMany({
//     where: {
//       current_status_id: 8,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//     select: {
//       id: true,
//       publication_title: true,
//       publication_ticket: true,
//       current_status_id: true,
//       status: { select: { status_name: true } },
//     },
//   });

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-5xl mx-auto px-4 py-10">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-1">
//               Daftar Publikasi Buku
//             </h1>
//             <p className="text-gray-600">
//               Menampilkan buku-buku yang telah diterbitkan
//             </p>
//           </div>

//           {session ? (
//             <div className="text-right">
//               <p className="text-sm text-gray-700 mb-1">
//                 Halo, {session.name || session.role}
//               </p>
//               <a
//                 href={
//                   session.role === "ADMIN"
//                     ? "/admin/dashboard"
//                     : session.role === "DOSEN"
//                     ? "/lecturer/dashboard"
//                     : session.role === "PENERBIT"
//                     ? "/publisher/dashboard"
//                     : "/"
//                 }
//                 className="text-sm text-blue-600 hover:underline"
//               >
//                 Masuk ke Dashboard
//               </a>
//             </div>
//           ) : (
//             <a href="/login" className="text-sm text-blue-600 hover:underline">
//               Login untuk mengakses dashboard →
//             </a>
//           )}
//         </div>

//         {books.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {books.map((book) => (
//               <div
//                 key={book.id}
//                 className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200"
//               >
//                 <div className="space-y-3">
//                   <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
//                     {book.publication_title}
//                   </h2>

//                   <div className="flex items-center gap-2">
//                     <span className="inline-flex items-center py-0.5 text-xs text-blue-800">
//                       Kode Buku #{book.publication_ticket}
//                     </span>
//                   </div>

//                   <Link
//                     href={`/publication/${book.id}`}
//                     className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline text-sm font-medium transition-colors"
//                   >
//                     Lihat detail
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 5l7 7-7 7"
//                       />
//                     </svg>
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16">
//             <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//               <svg
//                 className="w-12 h-12 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               Belum ada publikasi
//             </h3>
//             <p className="text-gray-500">
//               Belum ada buku yang diterbitkan saat ini.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/encrypt";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";
import BookList from "@/components/BookList";
import BookListProgress from "@/components/BookListProgress";
export const dynamic = "force-dynamic";

export default async function PublikasiPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  let session: { name?: string; role?: string } | null = null;

  if (sessionToken) {
    session = (await verifySessionToken(sessionToken)) as {
      name?: string;
      role?: string;
    };
  }

  const books = await prisma.publication.findMany({
    where: {
      current_status_id: 8,
      current_transaction_status_id: 2,
      publication_authenticity_proof: { not: null },
      publication_book_cover: { not: null },
      publication_final_book: { not: null },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      publication_title: true,
      publication_ticket: true,
      current_status_id: true,
      status: { select: { status_name: true } },
    },
  });

  const bookProgress = await prisma.publication.findMany({
    where: {
      current_status_id: {
        in: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      publication_title: true,
      publication_ticket: true,
      current_status_id: true,
      status: { select: { status_name: true } },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div
        className="relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url('/assets/images/gedungku-pens.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                P3M Book Publishing
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-light text-blue-100 mt-2">
                  Sistem Pengelolaan Penerbitan Buku ISBN P3M PENS
                </span>
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Jelajahi koleksi buku dari para akademisi dan peneliti.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              {session ? (
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <span className="text-white font-medium">
                      Selamat datang, {session.name || session.role}
                    </span>
                  </div>
                  <a
                    href={
                      session.role === "ADMIN"
                        ? "/admin/dashboard"
                        : session.role === "DOSEN"
                        ? "/lecturer/dashboard"
                        : session.role === "PENERBIT"
                        ? "/publisher/dashboard"
                        : "/"
                    }
                    className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    Dashboard
                  </a>
                </div>
              ) : (
                <a
                  href="/login"
                  className="bg-white text-blue-600 px-8 py-3 rounded-full font-medium hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Masuk untuk Akses Penuh →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Stats Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {books.length}
                </div>
                <div className="text-slate-600">Buku Tersedia</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  100%
                </div>
                <div className="text-slate-600">Terverifikasi</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  24/7
                </div>
                <div className="text-slate-600">Akses Online</div>
              </div>
            </div>
          </div>
        </div>

        {/* Publications Section */}
        <div className="mb-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Buku Tersedia
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Temukan karya-karya buku terbaru dari berbagai bidang keilmuan
            </p>
          </div>
          {books.length > 0 ? (
            <BookList books={books} />
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl mb-6">
                  <svg
                    className="w-12 h-12 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Segera Hadir
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Koleksi bukusedang dalam proses kurasi. Pantau terus untuk
                  mendapatkan akses ke karya-karya terbaru.
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Publications Section */}
        <div className="mb-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Buku Dalam Proses
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Daftar karya-karya ajuan buku yang sedang dalam proses kurasi
            </p>
          </div>
          {books.length > 0 ? (
            <BookListProgress books={bookProgress} />
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl mb-6">
                  <svg
                    className="w-12 h-12 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Segera Hadir
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Koleksi bukusedang dalam proses kurasi. Pantau terus untuk
                  mendapatkan akses ke karya-karya terbaru.
                </p>
              </div>
            </div>
          )}
        </div>
        {!session && (
          <div className="mt-16">
            <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-500 rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Login untuk akses selengkapnya
                </h3>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Dapatkan akses penuh ke semua fitur
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/login"
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Masuk Sekarang
                  </a>
                </div>
              </div>
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
