import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import SidebarItem from "@/components/sidebar/SidebarItem";
import { LayoutDashboard, Files } from "lucide-react";

interface PublisherLayout {
  children: React.ReactNode;
}

export default function PublisherLayout({ children }: PublisherLayout) {
  return (
    <main className="flex h-screen">
      <Sidebar title="Dashboard Penerbit">
      <p className="pl-1 text-gray-400 text-xs font-thin">Dashboard</p>
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          url="/publisher/dashboard"
        />
        <p className="pl-1 text-gray-400 text-xs font-thin">Kelola</p>
        <SidebarItem
          icon={<Files size={20} />}
          text="Ajuan"
          url="/publisher/proposal"
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
