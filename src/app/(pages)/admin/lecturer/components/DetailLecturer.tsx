"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Pencil, Lock } from "lucide-react";
import { Lecturer } from "@/types/lecturerTypes";
import { formatDate } from "@/utils/dateFormatter";

export default function DetailLecturer() {
  const router = useRouter();
  const { id } = useParams();
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  useEffect(() => {
    const getLecturerById = async () => {
      try {
        const response = await fetch(`/api/admin/lecturers/${id}`);
        const result = await response.json();
        if (result.status === "success") {
          setLecturer(result.data);
        } else {
          console.error("Failed to fetch lecturer detail:", result.error);
        }
      } catch (error) {
        console.error("Error fetching lecturer detail:", error);
      }
    };
    getLecturerById();
  }, [id]);

  if (!lecturer) {
    return <div>Loading...</div>;
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
            onClick={() => router.push(`/admin/lecturer/update/${lecturer.id}`)}
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
          <p className="text-gray-600 text-xl font-semibold mb-4">Dosen</p>
          <p className="text-black mb-2 ">Nama: {lecturer.name}</p>
          <p className="text-black mb-2 ">
            NIDN: {lecturer.nidn ? lecturer.nidn : "-"}
          </p>
          <p className="text-black mb-2 ">
            Jurusan: {lecturer.major?.major_name || "-"}
          </p>
          <p className="text-black mb-2 ">Email: {lecturer.email}</p>
          <p className="text-black mb-2 ">
            No. Telephone:{" "}
            {lecturer.phone_number ? `0${lecturer.phone_number}` : "-"}
          </p>
          <p className="text-black mb-2 ">
            Alamat: {lecturer.address ? lecturer.address : "-"}
          </p>
          <br />
          <br />
          <br />
          <p className="text-black ">
            Tanggal Bergabung: {formatDate(lecturer.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
