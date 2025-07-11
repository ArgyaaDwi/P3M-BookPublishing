"use client";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/BreadCrumb";
import { Mail, Phone, MapPin, Calendar, Edit, History } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { formatDate } from "@/utils/dateFormatter";
type Activity = {
  id: string;
  publication: {
    publication_title: string;
  };
  publication_notes: string;
  createdAt: string;
};
export default function ProfilePage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  
  useEffect(() => {
    const fetchActivities = async () => {
      const res = await fetch("/api/v1/proposals/log-activities/recent");
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    };
    fetchActivities();
  }, []);

  const user = useUser();
  if (!user) {
    return <div>Loading...</div>;
  }
  const breadcrumbItems = [
    {
      name: "Dashboard",
      url: "/admin/dashboard",
    },
    {
      name: "Profil",
      url: "/admin/profile",
    },
  ];

  // Data dummy untuk profil pengguna

  return (
    <div className="mx-auto">
      <Breadcrumb title="Halaman Profil" breadcrumbItems={breadcrumbItems} />

      {/* Header Profil */}
      <div className="bg-white rounded-lg mt-3 overflow-hidden shadow-md">
        <div className="h-40 relative bg-gray-200 overflow-hidden">
          <Image
            src="/assets/images/Gedung-PENS.jpg"
            alt="Cover Photo"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary bg-opacity-70"></div>
        </div>

        <div className="px-6 pb-6 relative">
          <div className="relative -mt-16 mb-6 flex justify-center">
            <div className="relative">
              <Image
                src="/assets/images/user_img.png"
                alt="Foto Profil"
                width={128}
                height={128}
                className="rounded-full border-4 border-white shadow-md object-cover"
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-blue-600 font-medium">{user.role}</p>
            <Link
              href="/admin/profile/update"
              className="mt-4 bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 inline-flex items-center"
            >
              <Edit size={14} className="mr-2" />
              <span>Edit Profil</span>
            </Link>
            <p className="mt-2 text-gray-600 font-medium text-sm">
              Terakhir diperbarui: {formatDate(user.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Informasi Kontak */}
        <div className="bg-white rounded-lg shadow-md p-6 order-2 md:order-1 md:col-span-1">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
            Informasi Kontak
          </h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-50 p-2 rounded-lg mr-3">
                <Mail size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-50 p-2 rounded-lg mr-3">
                <Phone size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Telepon</p>
                <p className="text-gray-800">{user.phone_number}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-50 p-2 rounded-lg mr-3">
                <MapPin size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Alamat</p>
                <p className="text-gray-800">{user.address}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-50 p-2 rounded-lg mr-3">
                <Calendar size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal Bergabung</p>
                <p className="text-gray-800">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4 pb-2 border-b">
            Media Sosial
          </h2>
          <div className="flex gap-3">
            <a href="#" className="bg-blue-50 p-2 rounded-lg hover:bg-blue-100">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="#" className="bg-blue-50 p-2 rounded-lg hover:bg-blue-100">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="bg-blue-50 p-2 rounded-lg hover:bg-blue-100">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>

        {/* Detail Profil */}
        <div className="bg-white rounded-lg shadow-md p-6 order-1 md:order-2 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b flex justify-between items-center">
            <span> Riwayat Aktivitas</span>
          </h2>

          <div className="space-y-6">
            {/* <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">Bio</h3>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Accusantium, sequi. Soluta molestiae quos quae temporibus.
              </p>
            </div> */}

            <div>
              {/* <h3 className="text-md font-medium text-gray-700 mb-3">
                Riwayat Aktivitas
              </h3> */}
              <div className="space-y-3">
                {activities.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 p-3 rounded-lg border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                          <History size={16} />
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">
                            {item.publication.publication_title}
                          </p>
                          <p className="text-gray-600 text-sm mt-1">
                            {item.publication_notes}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(item.createdAt), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
