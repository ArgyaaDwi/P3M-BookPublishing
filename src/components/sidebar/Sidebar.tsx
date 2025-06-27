"use client";
import { Menu, ChevronFirst, LogOut } from "lucide-react";
import { createContext, useState } from "react";
import Image from "next/image";

interface SidebarContextType {
  expanded: boolean;
}
const SidebarContext = createContext<SidebarContextType | null>(null);
interface SidebarProps {
  title: string;
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
    role: string;
  } | null;
}

export default function Sidebar({ title, children, user }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/v1/logout", {
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
  return (
    <aside className={` h-screen transition-all ${expanded ? "w-64" : "w-16"}`}>
      {" "}
      <nav className=" h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center mb-5">
          <Image
            src="/assets/images/pensHD.png"
            alt="Logo"
            width={56}
            height={56}
            className={`overflow-hidden transition-all ${
              expanded ? "w-14" : "w-0"
            }`}
          />
          {expanded && (
            <p className="ml-3 font-medium text-md text-primary">{title}</p>
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
              {/* <h4 className="font-semibold text-black">{user?.name || ""}</h4>
              <span className="text-xs text-gray-600">{user?.email || ""}</span> */}
              <h4 className="font-semibold text-black truncate max-w-[120px] overflow-hidden whitespace-nowrap">{user?.name || ""}</h4>
              {/* <span className="text-xs text-gray-600 truncate max-w-[10px] overflow-hidden whitespace-nowrap">{user?.email || ""}</span> */}
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
