"use client";
import { useState } from "react";
import ModalUser from "../ModalUser";
import Image from "next/image";
interface UserType {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

interface HeaderProps {
  user: UserType | null;
}

const Header = ({ user }: HeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const currentDate = now.toLocaleDateString("id-ID", options);

  const handleAvatarClick = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!user) {
    return (
      <header className="flex justify-between items-center bg-white shadow-md p-4 relative">
        <div className="text-gray-700 font-medium">{currentDate}</div>
        <div className="text-gray-500">Tidak ada user</div>
      </header>
    );
  }

  return (
    <header className="flex justify-between items-center bg-white shadow-md p-4 relative">
      <div className="text-gray-700 font-medium">{currentDate}</div>
      <div className="flex items-center gap-2 relative">
        <span className="hidden md:block text-gray-800 font-normal">
          {user.name}
        </span>
        <div className="relative">
          <Image
            src={user.avatarUrl || "/assets/images/user_img.png"}
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full cursor-pointer"
            onClick={handleAvatarClick}
          />
          {isModalOpen && (
            <ModalUser
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              user={{
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl || "/assets/images/user_img.png",
                role: user.role,
              }}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
