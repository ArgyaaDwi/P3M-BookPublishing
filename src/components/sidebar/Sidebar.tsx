"use client";

import { Menu, ChevronFirst, LogOut } from "lucide-react";
import { createContext, useState, useEffect } from "react";
import Image from "next/image";

interface SidebarContextType {
  expanded: boolean;
}
const SidebarContext = createContext<SidebarContextType | null>(null);
interface SidebarProps {
  title: string;
  children: React.ReactNode;
}

export default function Sidebar({ title, children }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatarUrl: string;
    role: string;
  } | null>(null);
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "/login";
      } else {
        console.error("Logout gagal");
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat logout:", error);
    }
  };
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch("/api/session");
        if (!response.ok) {
          throw new Error("Gagal mengambil data sesi");
        }
        const data = await response.json();
        setUser({
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
  }, []);
  return (
    <aside className={` h-screen transition-all ${expanded ? "w-64" : "w-16"}`}>
      {" "}
      <nav className=" h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center mb-5">
          <Image
            src="/assets/images/p3m_logo.png"
            alt="Logo"
            width={56} // sama dengan w-14 (14 * 4 = 56px)
            height={56} // bisa diatur sesuai kebutuhan, atau biarkan proporsional
            className={`overflow-hidden transition-all ${
              expanded ? "w-14 bg-secondary p- rounded-md" : "w-0"
            }`}
          />
          {/* <img
            src="/assets/images/p3m_logo.png"
            className={`overflow-hidden transition-all ${
              expanded ? "w-14 bg-secondary p- rounded-md" : "w-0"
            }`}
            alt="Logo"
          /> */}
          {expanded && (
            <p className="ml-3 font-normal text-md text-black">{title}</p>
          )}
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            {expanded ? <ChevronFirst color="black" /> : <Menu color="black" />}
          </button>
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 ">{children}</ul>
        </SidebarContext.Provider>
        <div className="border-t flex p-3">
          {/* <img
            src="/assets/images/user_img.png"
            alt=""
            className="w-10 h-10 rounded-md"
          /> */}
          <Image
            src="/assets/images/user_img.png"
            alt="Logo"
            width={40}
            height={40}
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
                flex justify-between items-center
                overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
            `}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-black">{user?.name || ""}</h4>
              <span className="text-xs text-gray-600">{user?.email || ""}</span>
            </div>
            <button onClick={handleLogout}>
              <LogOut size={22} color="red" />
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
export { SidebarContext };
