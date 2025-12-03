"use client";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FiUser, FiLogOut } from "react-icons/fi";

interface AdminNavbarProps {
  title: string;
  user: {
    name: string;
    email: string;
    avatar_url?: string | null;
  };
  onLogout: () => void;
  onProfile: () => void;
}

export default function AdminNavbar({
  title,
  user,
  onLogout,
  onProfile,
}: AdminNavbarProps) {
  const avatar =
    user.avatar_url && user.avatar_url.trim() !== "" ? user.avatar_url : null;

  const fallbackInitial = user.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-background shadow-sm sticky top-0 z-30">
      {/* Sidebar Trigger */}
      <SidebarTrigger />

      {/* Title */}
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer">
          {/* Avatar menggunakan Next/Image + AvatarFallback */}
          <Avatar className="w-10 h-10 overflow-hidden">
            {avatar ? (
              <Image
                src={avatar}
                alt={user.name}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <AvatarFallback>{fallbackInitial}</AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          {/* User Info */}
          <div className="px-4 py-2 border-b">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          {/* Profile */}
          <DropdownMenuItem onClick={onProfile} className="gap-2 cursor-pointer">
            <FiUser /> Profil
          </DropdownMenuItem>

          {/* Logout */}
          <DropdownMenuItem
            onClick={onLogout}
            className="gap-2 text-red-600 cursor-pointer"
          >
            <FiLogOut /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
