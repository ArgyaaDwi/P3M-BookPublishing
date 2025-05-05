"use client";
import { useContext } from "react";
import { usePathname } from "next/navigation";
import { SidebarContext } from "./Sidebar";
import Link from "next/link";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  url: string;
}

export default function SidebarItem({ icon, text, url }: SidebarItemProps) {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "SidebarItem must be used within a SidebarContext.Provider"
    );
  }
  const { expanded } = context;
  const pathname = usePathname();
  const isActive = pathname === url;
  return (
    <li className="my-1">
      <Link
        href={url}
        className={`relative flex items-center py-2 px-3
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${
            isActive
              ? "bg-primary text-white"
              : "hover:bg-indigo-50 text-gray-600"
          }
        `}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {!expanded && (
          <div
            className={`absolute left-full w-max rounded-md px-2 py-1 ml-6
              bg-indigo-100 text-indigo-800 text-sm
              invisible opacity-20 -translate-x-3 transition-all
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
            `}
          >
            {text}
          </div>
        )}
      </Link>
    </li>
  );
}
