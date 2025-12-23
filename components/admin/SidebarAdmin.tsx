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
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { useState, useEffect } from "react";

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
  { title: "Pengaturan", url: "/pengaturan", icon: FiSettings },
];

//
// ===============================
// MAIN SIDEBAR COMPONENT
// ===============================
//

export function SidebarAdmin() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check initial theme
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  };

  const renderMenu = (items: MenuItem[]) =>
    items.map((item) => {
      const Icon = item.icon;
      const active = pathname === item.url || pathname.startsWith(item.url + "/");

      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton 
            asChild 
            isActive={active}
            className="group relative transition-all duration-200"
          >
            <Link href={item.url}>
              {/* Active linear background */}
              {active && (
                <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-primary/5 rounded-lg dark:from-primary/20 dark:to-primary/10" />
              )}
              {/* Hover effect */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent to-primary/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200" />
              
              <Icon 
                size={18} 
                className={`relative z-10 transition-colors duration-200 ${
                  active 
                    ? "text-primary" 
                    : "text-muted-foreground group-hover:text-foreground"
                }`} 
              />
              <span className={`relative z-10 transition-colors duration-200 ${
                active 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground group-hover:text-foreground"
              }`}>
                {item.title}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

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
        <div className="px-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl blur-md opacity-50 dark:from-blue-600 dark:to-cyan-600" />
              <div className="relative w-10 h-10 bg-linear-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center dark:from-blue-500 dark:to-cyan-600">
                <FiCalendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent">
                LIGAKU
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">Tournament Manager</p>
            </div>
          </div>
        </div>

        {/* MENU UTAMA */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>{renderMenu(menuUtama)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* SISTEM PERTANDINGAN */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
            Sistem Pertandingan
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>{renderMenu(menuPertandingan)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* MANAJEMEN */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
            Manajemen
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>{renderMenu(menuManajemen)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* PENGATURAN */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
            Pengaturan
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>{renderMenu(menuPengaturan)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Theme Toggle */}
        <div className="px-4 mt-8">
          <div className="p-4 bg-linear-to-br from-secondary/50 to-secondary/30 rounded-xl border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-foreground">Tema</p>
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-background border border-border hover:bg-secondary transition-colors"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <FiMoon className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <FiSun className="w-4 h-4 text-yellow-500" />
                )}
              </button>
            </div>
            <div className="flex gap-2">
              <div className={`flex-1 p-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                theme === 'light' 
                  ? 'bg-primary/10 border-primary/20 text-primary' 
                  : 'bg-secondary/30 border-border/50 text-muted-foreground'
              }`}>
                <FiSun className="w-3 h-3" />
                <span className="text-xs">Terang</span>
              </div>
              <div className={`flex-1 p-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                theme === 'dark' 
                  ? 'bg-primary/10 border-primary/20 text-primary' 
                  : 'bg-secondary/30 border-border/50 text-muted-foreground'
              }`}>
                <FiMoon className="w-3 h-3" />
                <span className="text-xs">Gelap</span>
              </div>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}