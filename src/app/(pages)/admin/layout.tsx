import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import SidebarItem from "@/components/sidebar/SidebarItem";
import { LayoutDashboard, Files, Users, UserRoundPen } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <main className="flex h-screen">
      <Sidebar title="Dashboard Admin">
        <p className="pl-3 text-gray-400 text-xs font-thin">Dashboard</p>
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          url="/admin/dashboard"
        />
        <p className="pl-3 text-gray-400 text-xs font-thin">Kelola</p>
        <SidebarItem
          icon={<Files size={20} />}
          text="Ajuan"
          url="/admin/proposal"
        />
        <SidebarItem
          icon={<Users size={20} />}
          text="Dosen"
          url="/admin/lecturer"
        />
        <SidebarItem
          icon={<UserRoundPen size={20} />}
          text="Penerbit"
          url="/admin/publisher"
        />
      </Sidebar>
      <div className="flex-1 flex flex-col h-screen">
        <Header />
        <div className="flex-1 bg-backgroundDash p-4">{children}</div>
        <Footer />
      </div>
    </main>
  );
}
