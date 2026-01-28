"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiUserCheck,
  FiBarChart2,
  FiSettings,
  FiLayers,
  FiCrosshair,
  FiGrid,
} from "react-icons/fi";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

//
// ===============================
// MENU DEFINISI
// ===============================
//

// MENU UTAMA
const menuUtama: MenuItem[] = [
  { title: "Statistik", url: "/admin/dashboard", icon: FiBarChart2 },
  { title: "Acara", url: "/admin/acara", icon: FiCalendar },
  { title: "Tim", url: "/admin/tim", icon: FiLayers },
  { title: "Peserta", url: "/admin/peserta", icon: FiUserCheck },
];

// SISTEM PERTANDINGAN (berdasarkan tipe_acara)
const menuPertandingan: MenuItem[] = [
  { title: "Semua Pertandingan", url: "/admin/pertandingan", icon: FiGrid },
  { title: "Bracket Pertandingan", url: "/admin/bracket", icon: FiCrosshair },
];

// MANAJEMEN
// const menuManajemen: MenuItem[] = [
//   { title: "Pengguna", url: "/admin/pengguna", icon: FiUsers },
// ];

// PENGATURAN
const menuPengaturan: MenuItem[] = [
  // { title: "Pengaturan", url: "/pengaturan", icon: FiSettings },
];

//
// ===============================
// MAIN SIDEBAR COMPONENT
// ===============================
//

export function SidebarAdmin() {
  const pathname = usePathname();

  // Komponen Menu Item yang lebih sederhana
  const MenuItem = ({ item }: { item: MenuItem }) => {
    const Icon = item.icon;
    const active = pathname === item.url || pathname.startsWith(item.url + "/");

    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={active}
          className="group relative transition-all duration-200 hover:bg-secondary/50"
        >
          <Link href={item.url} className="group/link">
            {/* Active linear background */}
            {active && (
              <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-primary/5 rounded-lg dark:from-primary/20 dark:to-primary/10" />
            )}
            {/* Hover effect - hanya muncul saat item dihover */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent to-primary/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200" />

            <div className="relative z-10 flex items-center gap-3">
              <Icon
                size={18}
                className={`transition-colors duration-200 ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground group-hover/link:text-foreground"
                }`}
              />
              <span
                className={`transition-colors duration-200 ${
                  active
                    ? "text-primary font-medium"
                    : "text-muted-foreground group-hover/link:text-foreground"
                }`}
              >
                {item.title}
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar
      className={`
        bg-linear-to-b from-background via-background to-background/95
        border-r border-border/50
        backdrop-blur-sm
        dark:bg-linear-to-b dark:from-gray-900/95 dark:via-gray-900/95 dark:to-gray-900/90
      `}
      collapsible="icon"
    >
      <SidebarContent className="py-6">
        {/* Logo/Brand */}
        <div className="px-2 mb-8">
          <div className="flex items-center gap-3 group/logo hover:opacity-90 transition-opacity">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl blur-md opacity-50 dark:from-blue-600 dark:to-cyan-600" />
              <div className="relative w-8 h-8 bg-linear-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center dark:from-blue-500 dark:to-cyan-600">
                <FiCalendar className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent">
                LIGAKU
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tournament Manager
              </p>
            </div>
          </div>
        </div>

        {/* MENU UTAMA */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-1">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-0.5">
            <SidebarMenu>
              {menuUtama.map((item) => (
                <MenuItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* SISTEM PERTANDINGAN */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-1">
            Sistem Pertandingan
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-0.5">
            <SidebarMenu>
              {menuPertandingan.map((item) => (
                <MenuItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* MANAJEMEN */}
        {/* <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-1">
            Manajemen
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-0.5">
            <SidebarMenu>
              {menuManajemen.map((item) => (
                <MenuItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}

        {/* PENGATURAN */}
        {/* <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-1">
            Pengaturan
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-0.5">
            <SidebarMenu>
              {menuPengaturan.map((item) => (
                <MenuItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>
    </Sidebar>
  );
}