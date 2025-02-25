import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import SidebarItem from "@/components/sidebar/SidebarItem";
import { LayoutDashboard, Files } from "lucide-react";

interface LecturerLayoutProps {
  children: React.ReactNode;
}

export default function LecturerLayout({ children }: LecturerLayoutProps) {
  return (
    <main className="flex h-screen">
      <Sidebar title="Dashboard Dosen">
      <p className="pl-1 text-gray-400 text-xs font-thin">Dashboard</p>
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          url="/lecturer/dashboard"
        />
        <p className="pl-1 text-gray-400 text-xs font-thin">Kelola</p>
        <SidebarItem
          icon={<Files size={20} />}
          text="Ajuan Saya"
          url="/lecturer/proposal"
        />
        
      </Sidebar>
      <div className="flex-1 flex flex-col h-screen">
        <Header />
        <div className="flex-1 overflow-y-auto bg-backgroundDash p-4">{children}</div>
        <Footer />
      </div>
    </main>
  );
}
