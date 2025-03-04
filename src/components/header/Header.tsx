"use client";
import { useState, useEffect } from "react";
import ModalUser from "../ModalUser";

const Header = () => {
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch("/api/session");
        if (!response.ok) {
          throw new Error("Gagal mengambil data sesi");
        }
        const data = await response.json();
        setUser({
          id: data.user_id,
          name: data.name,
          email: data.email,
          avatarUrl: data.avatarUrl || "/assets/images/user_img.png",
          role: data.role || "Pengguna",
        });
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchUserSession();

    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setTimeout(() => {
      setCurrentDate(now.toLocaleDateString("id-ID", options));
      setIsLoading(false);
    }, 500);
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="flex justify-between items-center bg-white shadow-md p-4 relative">
      <div className="text-gray-700 font-medium">
        {isLoading ? "Memuat....." : currentDate}
      </div>
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <span className="hidden md:block text-gray-800 font-normal">
              {user.name} 
            </span>
            <img
              src="/assets/images/user_img.png"
              alt="User Avatar"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={toggleModal}
            />
          </>
        ) : (
          <span className="text-gray-500">Memuat...</span>
        )}
      </div>
      {user && (
        <ModalUser isOpen={isModalOpen} onClose={toggleModal} user={user} />
      )}
    </header>
  );
};

export default Header;
