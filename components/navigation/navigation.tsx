"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

import {
  Home,
  Calendar,
  Users,
  LogOut,
  User as UserIcon,
  Trophy,
  LogIn,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    load();
  }, []);

  const username =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "";

  const avatarUrl = user?.user_metadata?.avatar_url || "/avatar.png";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const isActive = (path: string) =>
    pathname === path ? "text-primary font-semibold" : "text-gray-600";

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      {/* DESKTOP NAV */}
      <div className="hidden md:flex items-center justify-between px-6 h-16">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Trophy className="h-6 w-6 text-primary" />
          LigaKu
        </Link>

        {/* CENTER MENU */}
        <div className="flex items-center gap-8 text-sm font-medium">
          <Link href="/" className={`flex items-center gap-1 hover:text-primary transition ${isActive("/")}`}>
            <Home className="h-4 w-4" /> Home
          </Link>

          <Link href="/jadwal" className={`flex items-center gap-1 hover:text-primary transition ${isActive("/jadwal")}`}>
            <Calendar className="h-4 w-4" /> Jadwal
          </Link>

          <Link href="/match" className={`flex items-center gap-1 hover:text-primary transition ${isActive("/match")}`}>
            <Trophy className="h-4 w-4" /> Pertandingan
          </Link>

          <Link href="/register-tim" className={`flex items-center gap-1 hover:text-primary transition ${isActive("/register-tim")}`}>
            <Users className="h-4 w-4" /> Register Tim
          </Link>
        </div>

        {/* RIGHT SIDE (LOGIN / USER) */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{username.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{username}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex gap-2 items-center" asChild>
                <Link href="/profile">
                  <UserIcon className="h-4 w-4" /> Profil
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                className="flex gap-2 items-center text-red-500 cursor-pointer"
              >
                <LogOut className="h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg"
          >
            <LogIn className="h-4 w-4" /> Login
          </Link>
        )}
      </div>

      {/* MOBILE TOP BAR */}
      <div className="md:hidden px-4 flex justify-between items-center h-16">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <Trophy className="h-6 w-6 text-primary" /> LigaKu
        </Link>

        {/* If not logged in → show login */}
        {!user ? (
          <Link
            href="/login"
            className="flex items-center gap-1 text-primary font-semibold"
          >
            <LogIn className="h-5 w-5" /> Login
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{username.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{username}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex gap-2 items-center">
                  <UserIcon className="h-4 w-4" /> Profil
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                className="flex gap-2 items-center text-red-500 cursor-pointer"
              >
                <LogOut className="h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">
        <Link href="/" className={`flex flex-col items-center text-xs ${isActive("/")}`}>
          <Home className="h-5 w-5" /> Home
        </Link>

        <Link href="/jadwal" className={`flex flex-col items-center text-xs ${isActive("/jadwal")}`}>
          <Calendar className="h-5 w-5" /> Jadwal
        </Link>

        <Link href="/match" className={`flex flex-col items-center text-xs ${isActive("/match")}`}>
          <Trophy className="h-5 w-5" /> Match
        </Link>

        <Link href="/register-tim" className={`flex flex-col items-center text-xs ${isActive("/register-tim")}`}>
          <Users className="h-5 w-5" /> Register
        </Link>
      </div>
    </nav>
  );
}
