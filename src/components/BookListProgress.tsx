"use client";

import { useState } from "react";

type Book = {
  id: number;
  current_status_id: number;
  publication_title: string;
  publication_ticket: string;
  status: {
    status_name: string;
  };
};

export default function BookListProgress({ books }: { books: Book[] }) {
  const [showAll, setShowAll] = useState(false);
  const visibleBooks = showAll ? books : books.slice(0, 6);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleBooks.map((book) => (
          <div
            key={book.id}
            className="group bg-white rounded-lg shadow-lg hover:shadow-2xl border border-slate-200/50 overflow-hidden transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-2 bg-yellow-400"></div>
            <div className="p-8">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-100 to-indigo-100 rounded-xl">
                    <svg
                      className="w-6 h-6 text-yellow-600"
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
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-black">
                    {book.status?.status_name}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {book.publication_title}
                </h3>
                <div className="text-sm text-slate-500">
                  Kode Buku: #{book.publication_ticket}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {books.length > 6 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="px-6 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all text-sm font-semibold"
          >
            {showAll ? "Tampilkan Sedikit" : "Tampilkan Semua"}
          </button>
        </div>
      )}
    </>
  );
}
