"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Trophy,
  TrendingUp,
  RefreshCw,
  UserPlus,
  Award,
  MapPin,
  Clock,
  BarChart3,
  Activity,
  CalendarDays,
  UsersRound,
  Target,
  TrendingDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface RecentMatch {
  id: string;
  tanggal_pertandingan: string;
  waktu_pertandingan: string;
  status: 'dijadwalkan' | 'berlangsung' | 'selesai';
  lokasi_lapangan: string;
  acara: {
    id: string;
    nama: string;
  } | null;
}

interface RecentTeam {
  id: string;
  nama: string;
  jurusan: string;
  status: 'aktif' | 'gugur';
  acara: {
    id: string;
    nama: string;
  } | null;
  dibuat_pada: string;
}

interface RecentEvent {
  id: string;
  nama: string;
  tanggal_mulai_pertandingan: string;
  tanggal_selesai_pertandingan: string;
  status: 'aktif' | 'selesai' | 'akan_datang';
}

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    totalAcara: 0,
    totalTim: 0,
    totalAnggotaTim: 0,
    pertandinganBerlangsung: 0,
    pertandinganSelesai: 0,
    pertandinganDijadwalkan: 0,
    totalRound: 0,
    pesertaAktif: 0,
  });
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);
  const [recentTeams, setRecentTeams] = useState<RecentTeam[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    setRefreshing(true);

    try {
      // Fetch semua data secara paralel
      const [
        acaraRes, 
        timRes, 
        anggotaTimRes, 
        roundRes,
        pertandinganBerlangsungRes,
        pertandinganSelesaiRes,
        pertandinganDijadwalkanRes,
        penggunaRes,
        pertandinganRes,
        timTerbaruRes,
        acaraTerbaruRes
      ] = await Promise.all([
        supabase.from("acara").select("*", { count: "exact", head: true }),
        supabase.from("tim").select("*", { count: "exact", head: true }),
        supabase.from("anggota_tim").select("*", { count: "exact", head: true }),
        supabase.from("round").select("*", { count: "exact", head: true }),
        supabase
          .from("pertandingan")
          .select("*", { count: "exact", head: true })
          .eq("status", "berlangsung"),
        supabase
          .from("pertandingan")
          .select("*", { count: "exact", head: true })
          .eq("status", "selesai"),
        supabase
          .from("pertandingan")
          .select("*", { count: "exact", head: true })
          .eq("status", "dijadwalkan"),
        supabase
          .from("pengguna")
          .select("*", { count: "exact", head: true })
          .eq("peran", "mahasiswa"),
        supabase
          .from("pertandingan")
          .select(`
            id, 
            tanggal_pertandingan,
            waktu_pertandingan,
            status,
            lokasi_lapangan,
            acara ( id, nama )
          `)
          .order("tanggal_pertandingan", { ascending: false })
          .limit(5),
        supabase
          .from("tim")
          .select(`
            id,
            nama,
            jurusan,
            status,
            dibuat_pada,
            acara ( id, nama )
          `)
          .order("dibuat_pada", { ascending: false })
          .limit(5),
        supabase
          .from("acara")
          .select(`
            id,
            nama,
            tanggal_mulai_pertandingan,
            tanggal_selesai_pertandingan
          `)
          .order("tanggal_mulai_pertandingan", { ascending: false })
          .limit(5)
      ]);

      // Set stats
      setStats({
        totalAcara: acaraRes.count || 0,
        totalTim: timRes.count || 0,
        totalAnggotaTim: anggotaTimRes.count || 0,
        pertandinganBerlangsung: pertandinganBerlangsungRes.count || 0,
        pertandinganSelesai: pertandinganSelesaiRes.count || 0,
        pertandinganDijadwalkan: pertandinganDijadwalkanRes.count || 0,
        totalRound: roundRes.count || 0,
        pesertaAktif: penggunaRes.count || 0,
      });

      // Normalize recent matches
      const normalizedMatches = (pertandinganRes.data || []).map((item: any) => ({
        id: item.id,
        tanggal_pertandingan: item.tanggal_pertandingan,
        waktu_pertandingan: item.waktu_pertandingan,
        status: item.status,
        lokasi_lapangan: item.lokasi_lapangan,
        acara: item.acara || null,
      }));

      // Normalize recent teams
      const normalizedTeams = (timTerbaruRes.data || []).map((item: any) => ({
        id: item.id,
        nama: item.nama,
        jurusan: item.jurusan || "Tidak ada jurusan",
        status: item.status,
        acara: item.acara || null,
        dibuat_pada: item.dibuat_pada,
      }));

      // Normalize recent events dengan status
      const now = new Date();
      const normalizedEvents = (acaraTerbaruRes.data || []).map((item: any) => {
        const startDate = new Date(item.tanggal_mulai_pertandingan);
        const endDate = new Date(item.tanggal_selesai_pertandingan);
        
        let status: 'aktif' | 'selesai' | 'akan_datang';
        if (now >= startDate && now <= endDate) {
          status = 'aktif';
        } else if (now > endDate) {
          status = 'selesai';
        } else {
          status = 'akan_datang';
        }

        return {
          id: item.id,
          nama: item.nama,
          tanggal_mulai_pertandingan: item.tanggal_mulai_pertandingan,
          tanggal_selesai_pertandingan: item.tanggal_selesai_pertandingan,
          status
        };
      });

      setRecentMatches(normalizedMatches);
      setRecentTeams(normalizedTeams);
      setRecentEvents(normalizedEvents);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const statCards = [
    {
      title: "Total Acara",
      value: stats.totalAcara,
      icon: <Trophy className="h-5 w-5" />,
      description: "Turnamen tersedia",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      trend: stats.totalAcara > 0 ? "positive" : "neutral",
    },
    {
      title: "Total Tim",
      value: stats.totalTim,
      icon: <UsersRound className="h-5 w-5" />,
      description: "Tim terdaftar",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      trend: stats.totalTim > 0 ? "positive" : "neutral",
    },
    {
      title: "Anggota Tim",
      value: stats.totalAnggotaTim,
      icon: <UserPlus className="h-5 w-5" />,
      description: "Total pemain",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      trend: stats.totalAnggotaTim > 0 ? "positive" : "neutral",
    },
    {
      title: "Peserta Aktif",
      value: stats.pesertaAktif,
      icon: <Users className="h-5 w-5" />,
      description: "Mahasiswa terdaftar",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      trend: stats.pesertaAktif > 0 ? "positive" : "neutral",
    },
    {
      title: "Babak Turnamen",
      value: stats.totalRound,
      icon: <Target className="h-5 w-5" />,
      description: "Total round/babak",
      color: "bg-gradient-to-br from-red-500 to-red-600",
      trend: stats.totalRound > 0 ? "positive" : "neutral",
    },
    {
      title: "Pertandingan",
      value: stats.pertandinganBerlangsung + stats.pertandinganDijadwalkan + stats.pertandinganSelesai,
      icon: <Activity className="h-5 w-5" />,
      description: "Total pertandingan",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      trend: "positive",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'selesai':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Selesai</Badge>;
      case 'berlangsung':
        return <Badge variant="default" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 animate-pulse"><Activity className="w-3 h-3 mr-1" /> Berlangsung</Badge>;
      case 'dijadwalkan':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"><Clock className="w-3 h-3 mr-1" /> Dijadwalkan</Badge>;
      case 'aktif':
        return <Badge variant="default" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200"><TrendingUp className="w-3 h-3 mr-1" /> Aktif</Badge>;
      case 'akan_datang':
        return <Badge variant="default" className="bg-sky-100 text-sky-800 hover:bg-sky-100 border-sky-200"><CalendarDays className="w-3 h-3 mr-1" /> Akan Datang</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTeamStatusBadge = (status: string) => {
    switch (status) {
      case 'aktif':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Aktif</Badge>;
      case 'gugur':
        return <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Gugur</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string, timeString?: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    
    if (timeString) {
      const time = new Date(`2000-01-01T${timeString}`);
      return `${date.toLocaleDateString("id-ID", options)} • ${time.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    
    return date.toLocaleDateString("id-ID", options);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header dengan gradient */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard Admin
                </h1>
                <p className="text-muted-foreground mt-2">
                  Ringkasan statistik dan aktivitas terbaru sistem turnamen
                </p>
              </div>
            </div>
            
            {/* Quick stats summary */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="font-medium">{stats.pertandinganSelesai} pertandingan selesai</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                <span className="font-medium">{stats.pertandinganBerlangsung} pertandingan aktif</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="font-medium">{stats.pertandinganDijadwalkan} pertandingan terjadwal</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={loadDashboard}
            disabled={loading || refreshing}
            className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Memperbarui..." : "Refresh Data"}
          </Button>
        </div>
      </div>

      {/* Stats Grid dengan gradient */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 ${stat.color} opacity-80`}></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color} text-white shadow-md`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16 mb-2" />
              ) : (
                <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  {stat.value.toLocaleString()}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              {stat.trend === "positive" && stat.value > 0 && (
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>Aktif</span>
                </div>
              )}
              {stat.trend === "neutral" && stat.value === 0 && (
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <AlertCircle className="w-3 h-3" />
                  <span>Belum ada data</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row dengan 3 cards: Pertandingan, Tim, Acara */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Matches Card */}
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle>Pertandingan Terbaru</CardTitle>
                  <CardDescription>5 pertandingan terakhir</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="font-normal">
                {recentMatches.length} items
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))
              ) : recentMatches.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Tidak ada data pertandingan</p>
                </div>
              ) : (
                recentMatches.map((match) => (
                  <div key={match.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium truncate">{match.acara?.nama || "Turnamen"}</div>
                      <div className="ml-2 flex-shrink-0">
                        {getStatusBadge(match.status)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      <span>{formatDateTime(match.tanggal_pertandingan, match.waktu_pertandingan)}</span>
                    </div>
                    {match.lokasi_lapangan && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{match.lokasi_lapangan}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            {recentMatches.length > 0 && !loading && (
              <div className="p-4 border-t text-center">
                <Button variant="ghost" size="sm" className="w-full">
                  Lihat Semua Pertandingan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Teams Card */}
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <UsersRound className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle>Tim Terbaru</CardTitle>
                  <CardDescription>5 tim terakhir terdaftar</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="font-normal">
                {recentTeams.length} items
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))
              ) : recentTeams.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <UsersRound className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Tidak ada data tim</p>
                </div>
              ) : (
                recentTeams.map((team) => (
                  <div key={team.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium truncate">{team.nama}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {team.jurusan}
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        {getTeamStatusBadge(team.status)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="truncate">{team.acara?.nama || "Umum"}</span>
                      <span>{formatDate(team.dibuat_pada)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            {recentTeams.length > 0 && !loading && (
              <div className="p-4 border-t text-center">
                <Button variant="ghost" size="sm" className="w-full">
                  Lihat Semua Tim
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Events Card */}
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle>Acara Terbaru</CardTitle>
                  <CardDescription>5 acara terakhir</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="font-normal">
                {recentEvents.length} items
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))
              ) : recentEvents.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Tidak ada data acara</p>
                </div>
              ) : (
                recentEvents.map((event) => (
                  <div key={event.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-medium truncate">{event.nama}</div>
                      <div className="ml-2 flex-shrink-0">
                        {getStatusBadge(event.status)}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        <span>Mulai: {formatDate(event.tanggal_mulai_pertandingan)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Selesai: {formatDate(event.tanggal_selesai_pertandingan)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {recentEvents.length > 0 && !loading && (
              <div className="p-4 border-t text-center">
                <Button variant="ghost" size="sm" className="w-full">
                  Lihat Semua Acara
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Overview */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5" />
            Overview Statistik Pertandingan
          </CardTitle>
          <CardDescription>
            Ringkasan status pertandingan dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/10 dark:to-green-800/10 p-6 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold text-green-800 dark:text-green-300">Selesai</div>
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-4xl font-bold text-green-700 dark:text-green-300">
                  {stats.pertandinganSelesai}
                </div>
              )}
              <div className="text-sm text-green-600 dark:text-green-400 mt-2">
                Pertandingan telah diselesaikan
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/10 dark:to-amber-800/10 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold text-amber-800 dark:text-amber-300">Berlangsung</div>
                <Activity className="h-8 w-8 text-amber-600 dark:text-amber-400 animate-pulse" />
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-4xl font-bold text-amber-700 dark:text-amber-300">
                  {stats.pertandinganBerlangsung}
                </div>
              )}
              <div className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                Pertandingan sedang aktif
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-800/10 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold text-blue-800 dark:text-blue-300">Dijadwalkan</div>
                <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-4xl font-bold text-blue-700 dark:text-blue-300">
                  {stats.pertandinganDijadwalkan}
                </div>
              )}
              <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                Pertandingan akan datang
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Akses cepat ke fitur admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <Users className="h-6 w-6 text-blue-600" />
              <span>Kelola Tim</span>
              <span className="text-xs text-muted-foreground font-normal">Lihat & edit tim</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 hover:bg-green-50 dark:hover:bg-green-900/20">
              <Calendar className="h-6 w-6 text-green-600" />
              <span>Jadwal Pertandingan</span>
              <span className="text-xs text-muted-foreground font-normal">Atur jadwal</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20">
              <Trophy className="h-6 w-6 text-purple-600" />
              <span>Buat Acara Baru</span>
              <span className="text-xs text-muted-foreground font-normal">Turnamen baru</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/20">
              <BarChart3 className="h-6 w-6 text-orange-600" />
              <span>Lihat Laporan</span>
              <span className="text-xs text-muted-foreground font-normal">Analisis data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}