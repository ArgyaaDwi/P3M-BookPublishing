import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import SidebarItem from "@/components/sidebar/SidebarItem";
import { getSession } from "@/lib/session";
import { UserProvider } from "@/context/UserContext";
import {
  LayoutDashboard,
  Files,
  Users,
  UserRoundPen,
  Receipt,
  GraduationCap,
  CircleUserRound,
  KeyRound,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
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
        <Sidebar title="Dashboard Admin" user={user}>
          <p className="pl-1 text-gray-400 text-xs font-thin">Menu</p>

          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            text="Dashboard"
            url="/admin/dashboard"
          />
          <p className="pl-1 text-gray-400 text-xs font-thin">Kelola</p>
          <SidebarItem
            icon={<UserRoundPen size={20} />}
            text="Penerbit"
            url="/admin/publisher"
          />
          <SidebarItem
            icon={<GraduationCap size={20} />}
            text="Program Studi"
            url="/admin/major"
          />
          <SidebarItem
            icon={<Users size={20} />}
            text="Dosen"
            url="/admin/lecturer"
          />

          <SidebarItem
            icon={<Files size={20} />}
            text="Ajuan"
            url="/admin/proposal"
          />
          <SidebarItem
            icon={<Receipt size={20} />}
            text="Invoice"
            url="/admin/invoice"
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
            url="/admin/profile/change-password"
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
