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
import { FiUser, FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { useState, useEffect } from "react";

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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const avatar =
    user.avatar_url && user.avatar_url.trim() !== "" ? user.avatar_url : null;

  const fallbackInitial = user.name?.charAt(0)?.toUpperCase() || "?";

  useEffect(() => {
    // Check initial theme
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  };

  return (
    <header className="w-full border-b bg-white dark:bg-gray-900 px-4 py-2 flex items-center shadow-sm">
      <div className="flex flex-1 items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-9 w-9 p-2 hover:bg-secondary rounded-lg transition-colors" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Admin Dashboard
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background hover:bg-secondary transition-colors"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <FiMoon className="h-4 w-4 text-muted-foreground" />
            ) : (
              <FiSun className="h-4 w-4 text-yellow-500" />
            )}
          </button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar className="h-9 w-9 cursor-pointer overflow-hidden border transition-all hover:scale-105">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="text-sm font-medium">
                    {fallbackInitial}
                  </AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 border bg-background shadow-lg"
            >
              {/* User Info */}
              <div className="px-3 py-2.5">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>

              <div className="border-t" />

              {/* Theme Toggle in Dropdown */}
              <DropdownMenuItem
                onClick={toggleTheme}
                className="cursor-pointer px-3 py-2.5"
              >
                <div className="mr-2 flex h-5 w-5 items-center justify-center">
                  {theme === "light" ? (
                    <FiMoon className="h-3.5 w-3.5" />
                  ) : (
                    <FiSun className="h-3.5 w-3.5 text-yellow-500" />
                  )}
                </div>
                <span className="text-sm">
                  {theme === "light" ? "Dark" : "Light"} Mode
                </span>
              </DropdownMenuItem>

              {/* Profile */}
              <DropdownMenuItem
                onClick={onProfile}
                className="cursor-pointer px-3 py-2.5"
              >
                <FiUser className="mr-2 h-3.5 w-3.5" />
                <span className="text-sm">Profil</span>
              </DropdownMenuItem>

              <div className="border-t" />

              {/* Logout */}
              <DropdownMenuItem
                onClick={onLogout}
                className="cursor-pointer px-3 py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <FiLogOut className="mr-2 h-3.5 w-3.5" />
                <span className="text-sm">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}