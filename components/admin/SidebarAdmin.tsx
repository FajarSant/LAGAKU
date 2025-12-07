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
  FiAward,
  FiLayers,
  FiActivity,
  FiCrosshair,
  FiGrid,
  FiTarget,
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

const menuUtama: MenuItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: FiHome },
  { title: "Acara", url: "/acara", icon: FiCalendar },
  { title: "Tim", url: "/tim", icon: FiLayers },
  { title: "Tipe Olahraga", url: "/tipe-olahraga", icon: FiActivity },
  { title: "Peserta", url: "/peserta", icon: FiUserCheck },
];

const menuPertandingan: MenuItem[] = [
  { title: "Semua Pertandingan", url: "/pertandingan", icon: FiAward },
  { title: "Fun Match", url: "/pertandingan/fun-match", icon: FiTarget },
  { title: "Cup / Liga", url: "/pertandingan/cup-liga", icon: FiGrid },
  { title: "Sistem Gugur (Bracket)", url: "/pertandingan/bracket", icon: FiCrosshair },
];

const menuManajemen: MenuItem[] = [
  { title: "Pengguna", url: "/pengguna", icon: FiUsers },
  { title: "Statistik", url: "/statistik", icon: FiBarChart2 },
];

const menuPengaturan: MenuItem[] = [
  { title: "Settings", url: "/settings", icon: FiSettings },
];

//
// ===============================
// MAIN COMPONENT
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

        {/* PERTANDINGAN */}
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
