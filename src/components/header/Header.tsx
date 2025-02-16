"use client";

import { useState, useEffect } from "react";
import ModalUser from "../ModalUser";

const Header = () => {
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State modal

  const user = {
    name: "Argya Dwi",
    email: "argyaawokawok@gmail.com",
    avatarUrl:
      "https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=User",
    role: "Admin P3M",
  };

  useEffect(() => {
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
    {/* // <header className="flex justify-between items-center bg-white shadow-md p-4 fixed w-full top-0 z-50 sm:pl-16"> */}
      <div className="text-gray-700 font-medium">
        {isLoading ? "Memuat....." : currentDate}
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden md:block text-gray-800 font-normal">
          {user.name}
        </span>
        <img
          src="/assets/images/user_img.png"
          alt="User Avatar"
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={toggleModal}
        />
      </div>
      <ModalUser isOpen={isModalOpen} onClose={toggleModal} user={user} />
    </header>
  );
};

export default Header;
