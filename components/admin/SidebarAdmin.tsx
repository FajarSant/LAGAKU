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
  FiBarChart2,
  FiSettings,
  FiAward,
} from "react-icons/fi";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const items: MenuItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: FiHome },
  { title: "Acara", url: "/acara", icon: FiCalendar },
  { title: "Peserta", url: "/peserta", icon: FiUsers },
  { title: "Pertandingan", url: "/pertandingan", icon: FiAward },
  { title: "Statistik", url: "/statistik", icon: FiBarChart2 },
  { title: "Pengguna", url: "/pengguna", icon: FiUsers },
  { title: "Settings", url: "/settings", icon: FiSettings },
];

export function SidebarAdmin() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sistem Pertandingan</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
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
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
