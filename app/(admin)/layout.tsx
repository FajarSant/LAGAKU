"use client";

import { SidebarAdmin } from "@/components/admin/SidebarAdmin";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { useAdminUser } from "@/hooks/useAdminUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout, isLoading, isAdmin } = useAdminUser();

  const goToProfile = () => router.push("/profile");

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        console.log('No user, redirecting to login');
        router.push("/login");
      } else if (!isAdmin) {
        console.log('Not admin, redirecting to unauthorized');
        router.push("/unauthorized");
      }
    }
  }, [user, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Akses Ditolak</h1>
          <p className="text-muted-foreground mb-6">
            Anda tidak memiliki izin untuk mengakses halaman admin.
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <SidebarAdmin />
      
      <div className="flex flex-col flex-1 min-h-screen w-full lg:ml-[--sidebar-width]">
        <AdminNavbar
          title="Dashboard Admin"
          user={{
            name: user.name,
            email: user.email,
            avatar_url: user.avatar_url || null
          }}
          onLogout={logout}
          onProfile={goToProfile}
        />

        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}