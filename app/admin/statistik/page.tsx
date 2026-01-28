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
  Trophy,
  Users,
  Gamepad2,
  Target,
  Zap,
  Calendar,
  School,
  Medal,
  Crown,
  RefreshCw,
  Activity,
  Clock,
  CheckCircle,
  User,
  UsersRound,
  Award,
  TrendingUp,
  Shield,
} from "lucide-react";

interface TournamentStats {
  id: string;
  nama: string;
  total_tim: number;
  total_pertandingan: number;
  tim_aktif: number;
  peserta_count: number;
  status: "berlangsung" | "selesai" | "akan_datang";
}

interface TeamStats {
  id: string;
  nama: string;
  total_menang: number;
  total_kalah: number;
  total_pertandingan: number;
  win_rate: number;
  jurusan: string;
}

interface PlayerStats {
  id: string;
  nama: string;
  nim: string;
  program_studi: string;
  total_tim: number;
  sebagai_ketua: number;
}

interface MatchStats {
  total: number;
  selesai: number;
  berlangsung: number;
  dijadwalkan: number;
}

export default function StatisticsPage() {
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Data states
  const [tournamentStats, setTournamentStats] = useState<TournamentStats[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [matchStats, setMatchStats] = useState<MatchStats>({
    total: 0,
    selesai: 0,
    berlangsung: 0,
    dijadwalkan: 0,
  });
  
  // Summary stats
  const [summary, setSummary] = useState({
    totalTournaments: 0,
    totalTeams: 0,
    totalPlayers: 0,
    totalMatches: 0,
    winRateAverage: 0,
  });

  const loadStatistics = async () => {
    setRefreshing(true);
    setLoading(true);

    try {
      // Load all statistics in parallel
      await Promise.all([
        loadTournamentStats(),
        loadTeamStats(),
        loadPlayerStats(),
        loadMatchStats(),
        loadSummaryStats(),
      ]);
      
      console.log("✅ Data statistik berhasil dimuat");
    } catch (error) {
      console.error("❌ Error loading statistics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadTournamentStats = async () => {
    try {
      const { data: tournaments, error } = await supabase
        .from("acara")
        .select(`
          id,
          nama,
          status,
          tanggal_mulai_pertandingan,
          tim:tim(
            id,
            anggota_tim(count)
          )
        `)
        .order("tanggal_mulai_pertandingan", { ascending: false })
        .limit(5);

      if (error) throw error;

      const tournamentStatsData = await Promise.all(
        (tournaments || []).map(async (tournament: any) => {
          // Get match count for this tournament
          const { count: matchCount } = await supabase
            .from("pertandingan")
            .select("*", { count: "exact", head: true })
            .eq("acara_id", tournament.id);

          const teams = tournament.tim || [];
          const totalParticipants = teams.reduce((sum: number, team: any) => 
            sum + (team.anggota_tim?.[0]?.count || 0), 0);

          return {
            id: tournament.id,
            nama: tournament.nama,
            total_tim: teams.length,
            total_pertandingan: matchCount || 0,
            tim_aktif: teams.length,
            peserta_count: totalParticipants,
            status: tournament.status || "selesai",
          };
        })
      );

      setTournamentStats(tournamentStatsData);
    } catch (error) {
      console.error("Error loading tournament stats:", error);
      throw error;
    }
  };

  const loadTeamStats = async () => {
    try {
      const { data: teams, error } = await supabase
        .from("tim")
        .select(`
          id,
          nama,
          jurusan,
          pertandingan_tim_a:pertandingan!pertandingan_tim_a_id_fkey(
            pemenang_id
          ),
          pertandingan_tim_b:pertandingan!pertandingan_tim_b_id_fkey(
            pemenang_id
          )
        `)
        .limit(10);

      if (error) throw error;

      const teamStatsData = (teams || []).map((team: any) => {
        const matchesAsA = team.pertandingan_tim_a || [];
        const matchesAsB = team.pertandingan_tim_b || [];
        const allMatches = [...matchesAsA, ...matchesAsB];
        
        const wins = allMatches.filter((m: any) => m.pemenang_id === team.id).length;
        const losses = allMatches.filter((m: any) => 
          m.pemenang_id && m.pemenang_id !== team.id
        ).length;
        const totalMatches = allMatches.length;
        const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

        return {
          id: team.id,
          nama: team.nama,
          total_menang: wins,
          total_kalah: losses,
          total_pertandingan: totalMatches,
          win_rate: Math.round(winRate),
          jurusan: team.jurusan || "Tidak ada",
        };
      });

      // Sort by win rate
      teamStatsData.sort((a, b) => b.win_rate - a.win_rate);
      setTeamStats(teamStatsData);
    } catch (error) {
      console.error("Error loading team stats:", error);
      throw error;
    }
  };

  const loadPlayerStats = async () => {
    try {
      const { data: players, error } = await supabase
        .from("pengguna")
        .select(`
          id,
          nama,
          nim,
          program_studi,
          anggota_tim:anggota_tim(
            tim_id,
            role
          )
        `)
        .eq("peran", "mahasiswa")
        .limit(10);

      if (error) throw error;

      const playerStatsData = (players || []).map((player: any) => {
        const teams = player.anggota_tim || [];
        const ketuaCount = teams.filter((t: any) => t.role === "ketua").length;

        return {
          id: player.id,
          nama: player.nama,
          nim: player.nim || "Tidak ada",
          program_studi: player.program_studi || "Tidak ada",
          total_tim: teams.length,
          sebagai_ketua: ketuaCount,
        };
      });

      // Sort by total teams
      playerStatsData.sort((a, b) => b.total_tim - a.total_tim);
      setPlayerStats(playerStatsData);
    } catch (error) {
      console.error("Error loading player stats:", error);
      throw error;
    }
  };

  const loadMatchStats = async () => {
    try {
      const { data: matches, error } = await supabase
        .from("pertandingan")
        .select("id, status")
        .limit(100);

      if (error) throw error;

      const matchData = matches || [];

      setMatchStats({
        total: matchData.length,
        selesai: matchData.filter(m => m.status === "selesai").length,
        berlangsung: matchData.filter(m => m.status === "berlangsung").length,
        dijadwalkan: matchData.filter(m => m.status === "dijadwalkan").length,
      });
    } catch (error) {
      console.error("Error loading match stats:", error);
      throw error;
    }
  };

  const loadSummaryStats = async () => {
    try {
      const [
        { count: tournamentCount },
        { count: teamCount },
        { count: playerCount },
        { count: matchCount },
      ] = await Promise.all([
        supabase.from("acara").select("*", { count: "exact", head: true }),
        supabase.from("tim").select("*", { count: "exact", head: true }),
        supabase.from("pengguna").select("*", { count: "exact", head: true }).eq("peran", "mahasiswa"),
        supabase.from("pertandingan").select("*", { count: "exact", head: true }),
      ]);

      // Calculate average win rate
      const winRates = teamStats.map(team => team.win_rate).filter(rate => rate > 0);
      const avgWinRate = winRates.length > 0 
        ? Math.round(winRates.reduce((a, b) => a + b, 0) / winRates.length)
        : 0;

      setSummary({
        totalTournaments: tournamentCount || 0,
        totalTeams: teamCount || 0,
        totalPlayers: playerCount || 0,
        totalMatches: matchCount || 0,
        winRateAverage: avgWinRate,
      });
    } catch (error) {
      console.error("Error loading summary stats:", error);
      throw error;
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  const renderStatCard = (title: string, value: number, icon: React.ReactNode, color: string, description?: string) => (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16 mb-2" />
        ) : (
          <>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderProgressBar = (percentage: number, color: string) => (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${color} transition-all duration-500`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "Tidak ada data";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard Statistik
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Analisis performa turnamen dan tim secara real-time
            </p>
          </div>
          
          <Button
            onClick={loadStatistics}
            disabled={loading || refreshing}
            variant="default"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Memuat..." : "Refresh Data"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {renderStatCard(
          "Turnamen",
          summary.totalTournaments,
          <Trophy className="h-4 w-4 text-white" />,
          "bg-linear-to-br from-amber-500 to-yellow-500",
          "Total turnamen"
        )}
        
        {renderStatCard(
          "Tim",
          summary.totalTeams,
          <UsersRound className="h-4 w-4 text-white" />,
          "bg-linear-to-br from-blue-500 to-cyan-500",
          "Tim terdaftar"
        )}
        
        {renderStatCard(
          "Pemain",
          summary.totalPlayers,
          <Users className="h-4 w-4 text-white" />,
          "bg-linear-to-br from-green-500 to-emerald-500",
          "Total pemain"
        )}
        
        {renderStatCard(
          "Pertandingan",
          summary.totalMatches,
          <Gamepad2 className="h-4 w-4 text-white" />,
          "bg-linear-to-br from-purple-500 to-pink-500",
          "Total pertandingan"
        )}
        
        {renderStatCard(
          "Win Rate",
          summary.winRateAverage,
          <Target className="h-4 w-4 text-white" />,
          "bg-linear-to-br from-red-500 to-orange-500",
          "Rata-rata kemenangan"
        )}
      </div>

      {/* Match Status */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Status Pertandingan
          </CardTitle>
          <CardDescription>
            Distribusi status pertandingan saat ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-linear-to-r from-green-500/10 to-green-500/5 rounded-lg border border-green-200 dark:border-green-900">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {matchStats.selesai}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Selesai</div>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <div className="p-4 bg-linear-to-r from-amber-500/10 to-amber-500/5 rounded-lg border border-amber-200 dark:border-amber-900">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {matchStats.berlangsung}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Berlangsung</div>
                </div>
                <Zap className="h-8 w-8 text-amber-500" />
              </div>
            </div>
            
            <div className="p-4 bg-linear-to-r from-blue-500/10 to-blue-500/5 rounded-lg border border-blue-200 dark:border-blue-900">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {matchStats.dijadwalkan}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Dijadwalkan</div>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Teams & Players */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Teams */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-amber-500" />
              Top 5 Tim Terbaik
            </CardTitle>
            <CardDescription>
              Tim dengan win rate tertinggi
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : teamStats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Tidak ada data tim
              </div>
            ) : (
              <div className="space-y-3">
                {teamStats.slice(0, 5).map((team, index) => (
                  <div 
                    key={team.id} 
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div className={`hrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-linear-to-br from-amber-500 to-yellow-500 text-white' :
                      index === 1 ? 'bg-linear-to-br from-gray-400 to-gray-300 text-white' :
                      index === 2 ? 'bg-linear-to-br from-amber-700 to-amber-600 text-white' :
                      'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <div className="grow">
                      <div className="font-medium">{team.nama}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {team.jurusan}
                      </div>
                      <div className="mt-1">
                        {renderProgressBar(team.win_rate, 
                          team.win_rate >= 70 ? 'bg-green-500' : 
                          team.win_rate >= 50 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className={`text-lg font-bold ${
                        team.win_rate >= 70 ? 'text-green-600' :
                        team.win_rate >= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {team.win_rate}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {team.total_pertandingan} match
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Players */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-500" />
              Top 5 Pemain Aktif
            </CardTitle>
            <CardDescription>
              Pemain dengan partisipasi tertinggi
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : playerStats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Tidak ada data pemain
              </div>
            ) : (
              <div className="space-y-3">
                {playerStats.slice(0, 5).map((player, index) => (
                  <div key={player.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-linear-to-br from-purple-500 to-pink-500' :
                      index === 1 ? 'bg-linear-to-br from-blue-500 to-cyan-500' :
                      index === 2 ? 'bg-linear-to-br from-green-500 to-emerald-500' :
                      'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <User className={`h-4 w-4 ${
                        index < 3 ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                      }`} />
                    </div>
                    
                    <div className="grow">
                      <div className="font-medium">{player.nama}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {player.program_studi}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-lg">{player.total_tim}</div>
                        <div className="text-xs text-gray-500">Tim</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{player.sebagai_ketua}</div>
                        <div className="text-xs text-gray-500">Ketua</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tournament List */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daftar Turnamen Terbaru
          </CardTitle>
          <CardDescription>
            Statistik turnamen yang sedang berlangsung dan sudah selesai
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : tournamentStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data turnamen
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Turnamen</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Tim</TableHead>
                    <TableHead className="text-right">Pertandingan</TableHead>
                    <TableHead className="text-right">Peserta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tournamentStats.map((tournament) => (
                    <TableRow key={tournament.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            tournament.status === "berlangsung" ? 'bg-green-100 dark:bg-green-900/30' :
                            tournament.status === "akan_datang" ? 'bg-blue-100 dark:bg-blue-900/30' :
                            'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            <Trophy className={`h-4 w-4 ${
                              tournament.status === "berlangsung" ? 'text-green-600' :
                              tournament.status === "akan_datang" ? 'text-blue-600' :
                              'text-gray-600'
                            }`} />
                          </div>
                          <span>{tournament.nama}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          tournament.status === "berlangsung" ? "default" :
                          tournament.status === "akan_datang" ? "outline" :
                          "secondary"
                        } className={
                          tournament.status === "berlangsung" ? "bg-green-500 hover:bg-green-600" :
                          tournament.status === "akan_datang" ? "border-blue-500 text-blue-500" :
                          ""
                        }>
                          {tournament.status === "berlangsung" ? "Berlangsung" :
                           tournament.status === "akan_datang" ? "Akan Datang" :
                           "Selesai"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-medium">{tournament.total_tim}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-medium">{tournament.total_pertandingan}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{tournament.peserta_count}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Trend Partisipasi</div>
                <div className="text-2xl font-bold text-green-600 flex items-center gap-1">
                  +12% <TrendingUp className="h-5 w-5" />
                </div>
                <div className="text-sm text-gray-500 mt-1">Bulan ini</div>
              </div>
              <div className="flex items-end h-10 gap-0.5">
                {[30, 45, 50, 55, 60, 65, 70].map((value, index) => (
                  <div
                    key={index}
                    className="w-2 bg-green-500 rounded-t transition-all duration-300 hover:opacity-80"
                    style={{ height: `${(value / 70) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Jurusan Teraktif</div>
                <div className="text-xl font-bold">Informatika</div>
                <div className="text-sm text-gray-500 mt-1">15 tim aktif</div>
              </div>
              <School className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Turnamen Aktif</div>
                <div className="text-2xl font-bold">
                  {tournamentStats.filter(t => t.status === "berlangsung").length}
                </div>
                <div className="text-sm text-gray-500 mt-1">Sedang berlangsung</div>
              </div>
              <Award className="h-10 w-10 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Data diperbarui: {new Date().toLocaleString('id-ID')}</span>
        </div>
      </div>
    </div>
  );
}