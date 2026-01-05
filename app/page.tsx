"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import StatusFilter from "@/components/home/StatusFilter";
import MatchesList from "@/components/home/MatchesList";
import Navigation from "@/components/navigation/navigation";
import FeaturesSection from "@/components/home/FeaturesSection";
import {
  Trophy,
  TrendingUp,
  Users,
  CalendarDays,
  ChevronRight,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  Flame,
  Clock,
  CalendarCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  const [selectedStatus, setSelectedStatus] = useState("berlangsung");
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({
    tournaments: 0,
    matches: 0,
    activeTeams: 0,
    todayMatches: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const supabase = createClient();

      const [tournamentsData, matchesData, teamsData, todayMatchesData] =
        await Promise.all([
          supabase.from("acara").select("id", { count: "exact" }),
          supabase.from("pertandingan").select("id", { count: "exact" }),
          supabase
            .from("tim")
            .select("id", { count: "exact" })
            .eq("status", "aktif"),
          supabase
            .from("pertandingan")
            .select("id", { count: "exact" })
            .eq("tanggal_pertandingan", new Date().toISOString().split("T")[0]),
        ]);

      setStats({
        tournaments: tournamentsData.count || 0,
        matches: matchesData.count || 0,
        activeTeams: teamsData.count || 0,
        todayMatches: todayMatchesData.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
    bgColor,
    textColor,
  }: {
    icon: React.ElementType;
    label: string;
    value: number;
    color: string;
    bgColor: string;
    textColor: string;
  }) => (
    <Card className="relative overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${textColor} mb-2`}>{label}</p>
            {loadingStats ? (
              <Skeleton className="h-8 w-20 bg-gray-200 dark:bg-gray-700" />
            ) : (
              <h3 className={`text-3xl font-bold ${textColor}`}>{value}</h3>
            )}
          </div>
          <div className={`p-3 rounded-full ${bgColor}`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const statsData = [
    {
      icon: Trophy,
      label: "Turnamen",
      value: stats.tournaments,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      textColor: "text-yellow-700 dark:text-yellow-300",
    },
    {
      icon: TrendingUp,
      label: "Pertandingan",
      value: stats.matches,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-700 dark:text-green-300",
    },
    {
      icon: Users,
      label: "Tim Aktif",
      value: stats.activeTeams,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    {
      icon: CalendarDays,
      label: "Hari Ini",
      value: stats.todayMatches,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      textColor: "text-purple-700 dark:text-purple-300",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />

        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 px-4 py-1.5 bg-linear-to-r from-blue-500 to-purple-500 text-white border-0 shadow-md">
                <Zap className="w-3 h-3 mr-1.5" />
                Platform Turnamen Terdepan
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Arena Kompetisi Digital
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Platform turnamen terpadu untuk mengatur, ikuti, dan saksikan
                pertandingan seru dengan teknologi terkini
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  size="lg"
                  className="px-8 py-6 text-base bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Mulai Kompetisi
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-base border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
                >
                  <Target className="mr-2 w-4 h-4" />
                  Lihat Turnamen
                </Button>
              </div>
            </div>

            {/* Stats Grid - Diperbaiki untuk light mode */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {statsData.map((stat, index) => (
                <StatCard
                  key={index}
                  icon={stat.icon}
                  label={stat.label}
                  value={stat.value}
                  color={stat.color}
                  bgColor={stat.bgColor}
                  textColor={stat.textColor}
                />
              ))}
            </div>

            {/* CTA Section */}
            <Card className="border-0 shadow-xl bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div>
                    <CardTitle className="text-xl md:text-2xl mb-2 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                      Siap untuk Kompetisi?
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      Bergabung dengan ratusan tim dan ribuan pemain dalam
                      turnamen seru. Daftar sekarang dan raih kemenangan!
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      size="lg"
                      className="px-6 py-5 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg group"
                    >
                      <Trophy className="mr-2 w-4 h-4 group-hover:animate-bounce" />
                      Daftar Turnamen
                      <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-6 py-5 border-2 border-gray-300 dark:border-gray-600"
                    >
                      Lihat Panduan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg">
          <CardHeader className="pb-4 my-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Pertandingan
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Lacak pertandingan dengan filter status
                </CardDescription>
              </div>
              <Tabs
                value={selectedStatus}
                onValueChange={(v) => {
                  setSelectedStatus(v);
                  setPage(1);
                }}
              >
                <TabsList className="bg-gray-100 dark:bg-gray-800">
                  <TabsTrigger
                    value="berlangsung"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                  >
                    Berlangsung
                  </TabsTrigger>
                  <TabsTrigger
                    value="dijadwalkan"
                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                  >
                    Dijadwalkan
                  </TabsTrigger>
                  <TabsTrigger
                    value="selesai"
                    className="data-[state=active]:bg-gray-500 data-[state=active]:text-white"
                  >
                    Selesai
                  </TabsTrigger>
                  <TabsTrigger
                    value="semua"
                    className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                  >
                    Semua
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Status Filter */}
            <div className="mb-6">
              <StatusFilter
                selectedStatus={selectedStatus}
                setSelectedStatus={(v) => {
                  setSelectedStatus(v);
                  setPage(1);
                }}
              />
            </div>

            {/* Matches List */}
            <div className="mt-6">
              <MatchesList
                selectedStatus={selectedStatus}
                page={page}
                setPage={setPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <FeaturesSection />

      {/* Footer */}
      <footer className="border-t py-10 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/95 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    SportConnect
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Competition Hub
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Platform turnamen olahraga terdepan untuk kompetisi yang adil
                dan transparan dengan teknologi modern.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-gray-900 dark:text-white">
                Navigasi
              </h4>
              <ul className="space-y-2">
                {["Beranda", "Turnamen", "Tim", "Jadwal"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm block py-1"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-gray-900 dark:text-white">
                Kontak
              </h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start py-1">
                  <span className="font-medium mr-2 min-w-16">Email:</span>
                  support@sportconnect.id
                </li>
                <li className="flex items-start py-1">
                  <span className="font-medium mr-2 min-w-16">Telepon:</span>
                  (021) 1234-5678
                </li>
                <li className="flex items-start py-1">
                  <span className="font-medium mr-2 min-w-16">Alamat:</span>
                  Jakarta, Indonesia
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} SportConnect. All rights reserved. |
              Platform Turnamen Modern
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
