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
  FiActivity,
  FiCrosshair,
  FiGrid,
  FiShuffle,
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
  { title: "Dashboard", url: "/dashboard", icon: FiHome },
  { title: "Acara", url: "/acara", icon: FiCalendar },
  { title: "Tim", url: "/tim", icon: FiLayers },
  { title: "Tipe Olahraga", url: "/tipe-olahraga", icon: FiActivity },
  { title: "Peserta", url: "/peserta", icon: FiUserCheck },
];

// SISTEM PERTANDINGAN (berdasarkan tipe_acara)
const menuPertandingan: MenuItem[] = [
  { title: "Semua Pertandingan", url: "/pertandingan", icon: FiGrid },
  { title: "Sistem Gugur (Bracket)", url: "/pertandingan/bracket", icon: FiCrosshair },
  { title: "Sistem Kompetisi", url: "/pertandingan/kompetisi", icon: FiGrid },
  { title: "Sistem Campuran", url: "/pertandingan/campuran", icon: FiShuffle },
];

// MANAJEMEN
const menuManajemen: MenuItem[] = [
  { title: "Pengguna", url: "/pengguna", icon: FiUsers },
  { title: "Statistik", url: "/statistik", icon: FiBarChart2 },
];

// PENGATURAN
const menuPengaturan: MenuItem[] = [
  { title: "Settings", url: "/settings", icon: FiSettings },
];

//
// ===============================
// MAIN SIDEBAR COMPONENT
// ===============================
//

export function SidebarAdmin() {
  const pathname = usePathname();

  const renderMenu = (items: MenuItem[]) =>
    items.map((item) => {
      const Icon = item.icon;
      const active = pathname.startsWith(item.url);

      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={active}>
            <Link href={item.url}>
              <Icon size={18} />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar>
      <SidebarContent>

        {/* MENU UTAMA */}
        <SidebarGroup>
          <SidebarGroupLabel>LIGAKU — Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenu(menuUtama)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* SISTEM PERTANDINGAN */}
        <SidebarGroup>
          <SidebarGroupLabel>Sistem Pertandingan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenu(menuPertandingan)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* MANAJEMEN */}
        <SidebarGroup>
          <SidebarGroupLabel>Manajemen</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenu(menuManajemen)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* PENGATURAN */}
        <SidebarGroup>
          <SidebarGroupLabel>Pengaturan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenu(menuPengaturan)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
}
