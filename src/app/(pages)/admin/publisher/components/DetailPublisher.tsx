"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Pencil, Lock } from "lucide-react";
import { Publisher } from "@/types/publisherTypes";
import { formatDate } from "@/utils/dateFormatter";

export default function DetailPublisher() {
  const router = useRouter();
  const { id } = useParams();
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPublisherById = async () => {
      try {
        const response = await fetch(`/api/v1/admin/publishers/${id}`);
        const result = await response.json();
        if (result.status === "success") {
          setPublisher(result.data);
        } else {
          console.error("Failed to fetch publisher detail:", result.error);
        }
      } catch (error) {
        console.error("Error fetching publisher detail:", error);
      } finally {
        setLoading(false);
      }
    };
    getPublisherById();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <svg
          aria-hidden="true"
          className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-300 fill-primary"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="text-black font-medium mt-2">Loading...</span>
      </div>
    );
  }

  if (!publisher) {
    return <p className="text-center text-red-500">Data tidak ditemukan.</p>;
  }

  return (
    // <div>
    //   <div className="bg-white rounded-lg mt-3 overflow-hidden px-4 pb-4 flex flex-row items-start">
    //     <div className="flex flex-col items-center mr-6">
    //       <Image
    //         src="/assets/images/vader.jpeg"
    //         alt="User Avatar"
    //         width={168}
    //         height={168}
    //         className="rounded-md object-cover mb-4"
    //       />
    //       <button
    //         className="bg-white border border-blue-500 text-blue-500 px-4 py-2 rounded-md mb-2 hover:bg-blue-900 hover:text-white w-full flex items-center justify-center gap-2"
    //         onClick={() =>
    //           router.push(`/admin/publisher/update/${publisher.id}`)
    //         }
    //       >
    //         <Pencil className="w-5 h-5" />
    //         Edit Data
    //       </button>
    //       <button className="bg-white border border-gray-500 text-gray-500 px-4 py-2 rounded-md hover:bg-gray-600 hover:text-white w-full flex items-center justify-center gap-2">
    //         <Lock className="w-5 h-5" />
    //         Ganti Password
    //       </button>
    //     </div>
    //     <div className="bg-white rounded-lg shadow-md p-4 flex-1">
    //       <p className="text-gray-600 text-xl font-semibold mb-4">Penerbit</p>
    //       <p className="text-black mb-2 ">Nama: {publisher.name}</p>
    //       <p className="text-black mb-2 ">Email: {publisher.email}</p>
    //       <p className="text-black mb-2 ">
    //         No. Telephone:{" "}
    //         {publisher.phone_number ? `0${publisher.phone_number}` : "-"}
    //       </p>
    //       <p className="text-black mb-2 ">
    //         Alamat: {publisher.address ? publisher.address : "-"}
    //       </p>
    //       <br />
    //       <br />
    //       <br />
    //       <p className="text-black ">
    //         Tanggal Bergabung: {formatDate(publisher.createdAt)}
    //       </p>
    //     </div>
    //   </div>
    // </div>
    <div className="mt-6">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 flex flex-col lg:flex-row items-start gap-8">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="relative">
                <Image
                  src="/assets/images/user_img.png"
                  alt="User Avatar"
                  width={168}
                  height={168}
                  className="rounded-xl object-cover shadow-lg border-4 border-white  p-3"
                />
              </div>
            </div>
            <div className="mt-6 space-y-3 w-full min-w-[200px]">
              <button
                className="group w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-3"
                onClick={() =>
                  router.push(`/admin/publisher/update/${publisher.id}`)
                }
              >
                <Pencil className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Edit Data
              </button>

              <button className="group w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-md flex items-center justify-center gap-3">
                <Lock className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Ganti Password
              </button>
            </div>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                <h2 className="text-2xl font-bold text-primary">
                  Informasi Penerbit
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left */}
              <div className="space-y-4">
                <div className="group">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Nama Lengkap
                  </label>
                  <p className="text-lg font-semibold text-gray-800 mt-1 group-hover:text-blue-600 transition-colors duration-200">
                    {publisher.name}
                  </p>
                </div>

                <div className="group">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <p className="text-lg text-gray-800 mt-1 group-hover:text-blue-600 transition-colors duration-200">
                    {publisher.email}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="space-y-4">
                <div className="group">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    No. Telepon
                  </label>
                  <p className="text-lg text-gray-800 mt-1 group-hover:text-blue-600 transition-colors duration-200">
                    {publisher.phone_number ? (
                      `0${publisher.phone_number}`
                    ) : (
                      <span className="text-gray-400 italic">Belum diisi</span>
                    )}
                  </p>
                </div>

                <div className="group">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Alamat
                  </label>
                  <p className="text-lg text-gray-800 mt-1 group-hover:text-blue-600 transition-colors duration-200">
                    {publisher.address ? (
                      publisher.address
                    ) : (
                      <span className="text-gray-400 italic">Belum diisi</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Bergabung Sejak
                  </label>
                  <p className="text-lg font-semibold text-gray-800">
                    {formatDate(publisher.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
