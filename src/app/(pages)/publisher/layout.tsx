import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import SidebarItem from "@/components/sidebar/SidebarItem";
import { getSession } from "@/lib/session";
import {
  LayoutDashboard,
  Files,
  Receipt,
  CircleUserRound,
  KeyRound,
} from "lucide-react";
import { UserProvider } from "@/context/UserContext";

interface PublisherLayout {
  children: React.ReactNode;
}

export default async function PublisherLayout({ children }: PublisherLayout) {
  const session = await getSession();
  const user = session
    ? {
        id: session.id as string,
        name: session.name as string,
        email: session.email as string,
        avatarUrl: session.avatarUrl as string,
        role: session.role as string,
        phone_number: session.phone_number as string,
        address: session.address as string,
        nidn: session.nidn as string,
        createdAt: session.createdAt as string,
        updatedAt: session.updatedAt as string,
      }
    : null;
  return (
    <UserProvider value={user}>
      <main className="flex h-screen">
        <Sidebar title="Dashboard Penerbit" user={user}>
          <p className="pl-1 text-gray-400 text-xs font-thin">Menu</p>
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
          <SidebarItem
            icon={<Receipt size={20} />}
            text="Invoice"
            url="/publisher/invoice"
          />
          <p className="pl-1 text-gray-400 text-xs font-thin">Setting</p>
          <SidebarItem
            icon={<CircleUserRound size={20} />}
            text="Profil Saya"
            url="/admin/profile"
          />
          <SidebarItem
            icon={<KeyRound size={20} />}
            text="Ganti Password"
            url="/admin/lecturer"
          />
        </Sidebar>
        <div className="flex-1 flex flex-col h-screen">
          <Header user={user} />
          <div className="flex-1 overflow-y-auto bg-backgroundDash p-4">
            {children}
          </div>
          <Footer />
        </div>
      </main>
    </UserProvider>
  );
}
