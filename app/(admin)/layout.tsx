"use client";

import { SidebarAdmin } from "@/components/admin/SidebarAdmin";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { useAdminUser } from "@/hooks/useAdminUser";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout } = useAdminUser();

  const goToProfile = () => router.push("/profile");

  return (
    <SidebarProvider>
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Content */}
      <div className="flex flex-col flex-1 min-h-screen w-full">
        {/* Navbar */}
        {user && (
          <AdminNavbar
            title="Dashboard Admin"
            user={user}
            onLogout={logout}
            onProfile={goToProfile}
          />
        )}

        {/* Page Content */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </SidebarProvider>
  );
}
