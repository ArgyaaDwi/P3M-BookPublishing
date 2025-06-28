import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
interface PageProps {
  params: { id: string };
}

export default async function DetailPublikasi({ params }: PageProps) {
  const book = await prisma.publication.findUnique({
    where: { id: parseInt(params.id) },
    select: {
      publication_title: true,
      publication_ticket: true,
      publication_document: true,
      publication_final_book: true,
      publication_book_cover: true,
      publication_authenticity_proof: true,
      status: { select: { status_name: true } },
    },
  });

  if (!book) return notFound();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/publication"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali ke Daftar Publikasi
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {book.publication_title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="inline-flex items-center py-1 text-sm font-medium  text-blue-800">
              Kode Buku #{book.publication_ticket}
            </span>
            {/* {book.status?.status_name && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {book.status.status_name}
              </span>
            )} */}
          </div>
        </div>
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            {book.publication_book_cover ? (
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Cover Buku
                </h3>
                <div className="overflow-hidden shadow-lg border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.publication_book_cover}
                    alt="Cover Buku"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <a
                  href={`${book.publication_book_cover.replace(
                    "/upload/",
                    "/upload/fl_attachment/"
                  )}`}
                  className="my-4 inline-block px-3 py-1 bg-sky-600 text-white text-sm rounded-md hover:bg-sky-700 transition"
                >
                  ⬇️ Download Cover Buku
                </a>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Cover Buku
                </h3>
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
                      />
                    </svg>
                    <p className="text-gray-500 text-sm">
                      Cover belum tersedia
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Documents Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Dokumen Publikasi Buku
              </h3>

              <div className="space-y-4">
                {/* Main Document */}
                {book.publication_final_book ? (
                  <div className="group">
                    <a
                      href={book.publication_final_book}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-700 group-hover:text-blue-800">
                          Dokumen Akhir Buku
                        </h4>
                        <p className="text-sm text-blue-600 group-hover:text-blue-700">
                          Klik untuk membuka dokumen
                        </p>
                      </div>
                      <svg
                        className="w-5 h-5 text-blue-600 group-hover:text-blue-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-500">
                        Dokumen Publikasi
                      </h4>
                      <p className="text-sm text-gray-400">
                        Dokumen belum tersedia
                      </p>
                    </div>
                  </div>
                )}

                {/* Cover Book Link */}
                {book.publication_book_cover && (
                  <div className="group">
                    <a
                      href={book.publication_book_cover}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 hover:border-green-300 transition-all duration-200"
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
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
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-700 group-hover:text-green-800">
                          Cover Buku
                        </h4>
                        <p className="text-sm text-green-600 group-hover:text-green-700">
                          Klik untuk melihat cover dalam ukuran penuh
                        </p>
                      </div>
                      <svg
                        className="w-5 h-5 text-green-600 group-hover:text-green-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                )}

                {/* Authenticity Proof */}
                {book.publication_authenticity_proof && (
                  <div className="group">
                    <a
                      href={book.publication_authenticity_proof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 hover:border-purple-300 transition-all duration-200"
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                        <svg
                          className="w-6 h-6 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-purple-700 group-hover:text-purple-800">
                          Bukti Keaslian
                        </h4>
                        <p className="text-sm text-purple-600 group-hover:text-purple-700">
                          Klik untuk melihat dokumen bukti keaslian
                        </p>
                      </div>
                      <svg
                        className="w-5 h-5 text-purple-600 group-hover:text-purple-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
