// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useParams } from "next/navigation";
// import { Pencil, Lock } from "lucide-react";
// import { Publisher } from "@/types/publisherTypes";
// import { formatDate } from "@/utils/dateFormatter";

// interface DetailPublisherProps {
//   detPublisher: Publisher;
// }

// export default function DetailPublisher({
//   detPublisher,
// }: DetailPublisherProps) {
//   const router = useRouter();
//   const { id } = useParams();
//   const [publisher, setPublisher] = useState<Publisher | null>(null);
//   useEffect(() => {
//     const getPublisherById = async () => {
//       try {
//         const response = await fetch(`/api/admin/lecturers/${id}`);
//         const result = await response.json();
//         if (result.status === "success") {
//           setPublisher(result.data);
//         } else {
//           console.error("Failed to fetch lecturer detail:", result.error);
//         }
//       } catch (error) {
//         console.error("Error fetching lecturer detail:", error);
//       }
//     };
//     getPublisherById();
//   }, [id]);

//   if (!detPublisher) {
//     return (
//       <div className="flex flex-col items-center">
//         <svg
//           aria-hidden="true"
//           className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-300 fill-primary"
//           viewBox="0 0 100 101"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
//             fill="currentColor"
//           />
//           <path
//             d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
//             fill="currentFill"
//           />
//         </svg>
//         <span className="text-black font-medium mt-2">Loading...</span>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="bg-white rounded-lg mt-3 overflow-hidden px-4 pb-4 flex flex-row items-start">
//         <div className="flex flex-col items-center mr-6">
//           <img
//             src="/assets/images/vader.jpeg"
//             alt="User Avatar"
//             className="w-42 h-42 rounded-md object-cover mb-4"
//           />
//           <button
//             className="bg-white border border-blue-500 text-blue-500 px-4 py-2 rounded-md mb-2 hover:bg-blue-900 hover:text-white w-full flex items-center justify-center gap-2"
//             onClick={() =>
//               router.push(`/admin/publisher/update/${publisher.id}`)
//             }
//           >
//             <Pencil className="w-5 h-5" />
//             Edit Data
//           </button>
//           <button className="bg-white border border-gray-500 text-gray-500 px-4 py-2 rounded-md hover:bg-gray-600 hover:text-white w-full flex items-center justify-center gap-2">
//             <Lock className="w-5 h-5" />
//             Ganti Password
//           </button>
//         </div>
//         <div className="bg-white rounded-lg shadow-md p-4 flex-1">
//           <p className="text-gray-600 text-xl font-semibold mb-4">Penerbit</p>
//           <p className="text-black mb-2 ">Nama: {publisher.name}</p>
//           <p className="text-black mb-2 ">Email: {publisher.email}</p>
//           <p className="text-black mb-2 ">
//             No. Telephone:{" "}
//             {publisher.phone_number ? `0${publisher.phone_number}` : "-"}
//           </p>
//           <p className="text-black mb-2 ">
//             Alamat: {publisher.address ? publisher.address : "-"}
//           </p>
//           <br />
//           <br />
//           <br />
//           <p className="text-black ">
//             Tanggal Bergabung: {formatDate(publisher.createdAt)}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

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
        const response = await fetch(`/api/admin/publishers/${id}`);
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
    <div>
      <div className="bg-white rounded-lg mt-3 overflow-hidden px-4 pb-4 flex flex-row items-start">
        <div className="flex flex-col items-center mr-6">
          <img
            src="/assets/images/vader.jpeg"
            alt="User Avatar"
            className="w-42 h-42 rounded-md object-cover mb-4"
          />
          <button
            className="bg-white border border-blue-500 text-blue-500 px-4 py-2 rounded-md mb-2 hover:bg-blue-900 hover:text-white w-full flex items-center justify-center gap-2"
            onClick={() =>
              router.push(`/admin/publisher/update/${publisher.id}`)
            }
          >
            <Pencil className="w-5 h-5" />
            Edit Data
          </button>
          <button className="bg-white border border-gray-500 text-gray-500 px-4 py-2 rounded-md hover:bg-gray-600 hover:text-white w-full flex items-center justify-center gap-2">
            <Lock className="w-5 h-5" />
            Ganti Password
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex-1">
          <p className="text-gray-600 text-xl font-semibold mb-4">Penerbit</p>
          <p className="text-black mb-2 ">Nama: {publisher.name}</p>
          <p className="text-black mb-2 ">Email: {publisher.email}</p>
          <p className="text-black mb-2 ">
            No. Telephone:{" "}
            {publisher.phone_number ? `0${publisher.phone_number}` : "-"}
          </p>
          <p className="text-black mb-2 ">
            Alamat: {publisher.address ? publisher.address : "-"}
          </p>
          <br />
          <br />
          <br />
          <p className="text-black ">
            Tanggal Bergabung: {formatDate(publisher.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
