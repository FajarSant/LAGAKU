"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useTheme } from "next-themes";

import {
  Home,
  Calendar,
  Users,
  LogOut,
  User as UserIcon,
  Trophy,
  LogIn,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Settings,
  Bell,
  PlusCircle,
} from "lucide-react";

// shadcn Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface PenggunaProfile {
  id: string;
  nama: string;
  email: string;
  avatar_url?: string | null;
  peran?: string;
}

export default function Navigation() {
  const pathname = usePathname();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PenggunaProfile | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ============================
  // FETCH USER LOGIN
  // ============================
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      setAuthUser(user ?? null);

      if (user) {
        const { data: pengguna } = await supabase
          .from("pengguna")
          .select("id, nama, email, avatar_url, peran")
          .eq("id", user.id)
          .maybeSingle();

        setProfile(pengguna ?? null);
      }
    };

    loadUser();
  }, []);

  // ==================================
  // DATA YANG DIGUNAKAN DI NAVIGASI
  // ==================================
  const username = profile?.nama || authUser?.email?.split("@")[0] || "User";
  const userEmail = profile?.email || authUser?.email || "";
  const userRole = profile?.peran || "mahasiswa";

  const avatarUrl =
    profile?.avatar_url ||
    authUser?.user_metadata?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Navigation items untuk bottom nav
  const bottomNavItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/jschadule", label: "Jadwal", icon: Calendar },
    { href: "/match", label: "Match", icon: Trophy },
     { href: "/my-teams", label: "Tim", icon: Users },
  ];

  // Navigation items untuk desktop menu
  const desktopNavItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/schadule", label: "Jadwal", icon: Calendar },
    { href: "/match", label: "Pertandingan", icon: Trophy },
    { href: "/my-teams", label: "Tim", icon: Users },
    { href: "/tournaments", label: "Turnamen", icon: Trophy },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Main Navigation Bar */}
      <header
        className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-all duration-300 ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo & Desktop Navigation */}
            <div className="flex items-center gap-6 lg:gap-8">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/70">
                  <Trophy className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight hidden sm:inline">
                  LigaKu
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {desktopNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent ${
                      isActive(item.href)
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right: Actions & User Menu */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle - Desktop */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 rounded-full hidden sm:flex"
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {/* Notifications - Desktop */}
              {authUser && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full relative hidden sm:flex"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    variant="destructive"
                  >
                    3
                  </Badge>
                </Button>
              )}

              {/* User Menu - Desktop */}
              {authUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 pl-2 pr-2 rounded-full gap-2 hidden sm:flex"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarUrl} alt={username} />
                        <AvatarFallback className="bg-linear-to-br from-primary to-primary/70 text-white">
                          {username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:flex flex-col items-start">
                        <span className="text-sm font-medium">{username}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {userRole}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50 hidden lg:inline" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {username}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userEmail}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profil Saya</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Pengaturan</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Keluar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost">Masuk</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Daftar</Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Trigger */}
              <div className="flex items-center gap-2 sm:hidden">
                {/* Theme Toggle - Mobile */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-9 w-9 rounded-full"
                  aria-label="Toggle theme"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>

                {/* Mobile User Menu */}
                {authUser ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-9 w-9 rounded-full"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={avatarUrl} alt={username} />
                          <AvatarFallback className="bg-linear-to-br from-primary to-primary/70 text-white">
                            {username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {username}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground capitalize">
                            {userRole}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <UserIcon className="mr-2 h-4 w-4" />
                          <span>Profil Saya</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Keluar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <LogIn className="h-4 w-4" />
                      <span>Masuk</span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50 md:hidden">
        <div className="flex justify-around items-center h-16 px-2">
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 min-w-0 px-2 py-2 transition-all ${
                isActive(item.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div
                className={`p-2 rounded-full ${
                  isActive(item.href) ? "bg-primary/10" : ""
                }`}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium mt-1 truncate w-full text-center">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Spacer untuk bottom navigation */}
      <div className="pb-16 md:pb-0"></div>
    </>
  );
}
