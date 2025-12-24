"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, RefreshCw, ArrowLeft, TrendingUp } from "lucide-react";

interface Acara {
  id: string;
  nama: string;
  deskripsi?: string;
}

interface Tim {
  id: string;
  nama: string;
  status?: string;
}

interface Round {
  id: string;
  nama: string;
  urutan: number;
  acara_id: string;
  dibuat_pada: string;
  min_tim?: number;
  max_tim?: number;
}

interface Pertandingan {
  id: string;
  status: string;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  tim_a_id: string | null;
  tim_b_id: string | null;
  round_id: string;
  acara_id: string;
  pemenang_id: string | null;
  is_bye: boolean;
  tanggal_pertandingan: string | null;
  waktu_pertandingan: string | null;
  tim_a?: Tim;
  tim_b?: Tim;
  round?: Round;
}

interface BracketRoundData {
  round: Round;
  matches: Pertandingan[];
  isPlaceholder?: boolean;
  completedPercentage: number;
}

interface StatsData {
  rounds: number;
  totalMatches: number;
  completedMatches: number;
  totalTeams: number;
  byeMatches: number;
  progressPercentage: number;
}

export default function BracketPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const acaraId = params.id as string;

  const [acara, setAcara] = useState<Acara | null>(null);
  const [bracketRounds, setBracketRounds] = useState<BracketRoundData[]>([]);
  const [stats, setStats] = useState<StatsData>({
    rounds: 0,
    totalMatches: 0,
    completedMatches: 0,
    totalTeams: 0,
    byeMatches: 0,
    progressPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBracketData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch acara details
      const { data: acaraData, error: acaraError } = await supabase
        .from("acara")
        .select("*")
        .eq("id", acaraId)
        .single();

      if (acaraError || !acaraData) {
        setError("Acara tidak ditemukan");
        return;
      }
      setAcara(acaraData);

      // 2. Fetch teams for this acara
      const { data: timData, error: timError } = await supabase
        .from("tim")
        .select("id, nama, status")
        .eq("acara_id", acaraId);

      const totalTeams = timData?.length || 0;

      // 3. Fetch rounds for this acara
      const { data: roundsData, error: roundsError } = await supabase
        .from("round")
        .select("*")
        .eq("acara_id", acaraId)
        .order("urutan", { ascending: false }); // Urutkan descending untuk mendapatkan round terbaru di atas

      if (roundsError) {
        console.error("Error fetching rounds:", roundsError);
        setBracketRounds([]);
        return;
      }

      if (!roundsData || roundsData.length === 0) {
        setBracketRounds([]);
        setStats({
          rounds: 0,
          totalMatches: 0,
          completedMatches: 0,
          totalTeams,
          byeMatches: 0,
          progressPercentage: 0,
        });
        return;
      }

      // 4. Fetch matches for this acara
      const { data: matchesData, error: matchesError } = await supabase
        .from("pertandingan")
        .select("*")
        .eq("acara_id", acaraId)
        .order("round_id", { ascending: false });

      if (matchesError) {
        console.error("Error fetching matches:", matchesError);
        return;
      }

      // 5. Process bracket rounds
      const roundsWithMatches: BracketRoundData[] = [];

      for (const round of roundsData) {
        const roundMatches = (matchesData || []).filter(
          (m) => m.round_id === round.id
        );

        // Enrich matches with team data
        const enrichedMatches = roundMatches.map((match) => ({
          ...match,
          tim_a: match.tim_a_id
            ? timData?.find((t) => t.id === match.tim_a_id)
            : undefined,
          tim_b: match.tim_b_id
            ? timData?.find((t) => t.id === match.tim_b_id)
            : undefined,
          round: {
            ...round,
            min_tim: round.min_tim ?? 2,
            max_tim: round.max_tim ?? 2,
          },
        }));

        // Calculate completion percentage for this round
        const completedMatches = enrichedMatches.filter((m) => m.status === "selesai").length;
        const completionPercentage = enrichedMatches.length > 0 
          ? Math.round((completedMatches / enrichedMatches.length) * 100)
          : 0;

        roundsWithMatches.push({
          round: {
            ...round,
            min_tim: round.min_tim ?? 2,
            max_tim: round.max_tim ?? 2,
          },
          matches: enrichedMatches,
          completedPercentage: completionPercentage,
        });
      }

      // 6. Generate placeholder round if last round is completed
      if (roundsWithMatches.length > 0) {
        // Urutkan berdasarkan urutan descending (round terbaru di atas)
        roundsWithMatches.sort((a, b) => b.round.urutan - a.round.urutan);

        const lastRound = roundsWithMatches[0]; // Sekarang ini adalah round dengan urutan tertinggi
        const lastRoundMatches = lastRound.matches;

        const allMatchesCompleted = lastRoundMatches.every(
          (m) => m.status === "selesai" || m.is_bye
        );

        const winnersFromLastRound = lastRoundMatches
          .filter((m) => m.pemenang_id || m.is_bye)
          .map((m) => (m.is_bye ? m.tim_a_id : m.pemenang_id))
          .filter(Boolean) as string[];

        if (allMatchesCompleted && winnersFromLastRound.length > 1) {
          const nextRoundUrutan = lastRound.round.urutan + 1;

          const placeholderRound: Round = {
            id: `placeholder-${nextRoundUrutan}`,
            nama:
              winnersFromLastRound.length === 1
                ? "Final"
                : winnersFromLastRound.length === 2
                ? "Semifinal"
                : winnersFromLastRound.length === 4
                ? "Quarterfinal"
                : `Round ${nextRoundUrutan}`,
            urutan: nextRoundUrutan,
            acara_id: acaraId,
            dibuat_pada: new Date().toISOString(),
            min_tim: 2,
            max_tim: 2,
          };

          const placeholderMatches = [];
          for (let i = 0; i < Math.ceil(winnersFromLastRound.length / 2); i++) {
            const timAId = winnersFromLastRound[i * 2];
            const timBId = winnersFromLastRound[i * 2 + 1];

            placeholderMatches.push({
              id: `placeholder-match-${nextRoundUrutan}-${i}`,
              acara_id: acaraId,
              round_id: placeholderRound.id,
              tim_a_id: timAId || null,
              tim_b_id: timBId || null,
              status: "dijadwalkan",
              skor_tim_a: null,
              skor_tim_b: null,
              pemenang_id: null,
              is_bye: false,
              tanggal_pertandingan: null,
              waktu_pertandingan: null,
              tim_a: timAId ? timData?.find((t) => t.id === timAId) : undefined,
              tim_b: timBId ? timData?.find((t) => t.id === timBId) : undefined,
              round: placeholderRound,
            });
          }

          // Tambahkan placeholder round di posisi atas
          roundsWithMatches.unshift({
            round: placeholderRound,
            matches: placeholderMatches,
            isPlaceholder: true,
            completedPercentage: 0,
          });
        }
      }

      // 7. Calculate statistics
      const totalMatches = roundsWithMatches.reduce(
        (sum, round) => sum + round.matches.length,
        0
      );

      const completedMatches = roundsWithMatches.reduce(
        (sum, round) =>
          sum + round.matches.filter((m) => m.status === "selesai").length,
        0
      );

      const byeMatches = roundsWithMatches.reduce(
        (sum, round) =>
          sum + round.matches.filter((m) => m.is_bye || !m.tim_b_id || !m.tim_a_id).length,
        0
      );

      const progressPercentage = totalMatches > 0 
        ? Math.round((completedMatches / totalMatches) * 100)
        : 0;

      setBracketRounds(roundsWithMatches);
      setStats({
        rounds: roundsWithMatches.length,
        totalMatches,
        completedMatches,
        totalTeams,
        byeMatches,
        progressPercentage,
      });
    } catch (error) {
      console.error("Error fetching bracket data:", error);
      setError("Terjadi kesalahan saat memuat data bracket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (acaraId) {
      fetchBracketData();
    }
  }, [acaraId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "selesai":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "berlangsung":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      case "dijadwalkan":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const getMatchResult = (match: Pertandingan) => {
    if (match.status !== "selesai") return null;
    
    if (match.is_bye) {
      return (
        <Badge 
          variant="outline" 
          className="bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
        >
          BYE
        </Badge>
      );
    }
    
    if (match.skor_tim_a !== null && match.skor_tim_b !== null) {
      if (match.skor_tim_a > match.skor_tim_b) {
        return <Badge className="bg-green-600 dark:bg-green-700">Tim A Menang</Badge>;
      } else if (match.skor_tim_b > match.skor_tim_a) {
        return <Badge className="bg-green-600 dark:bg-green-700">Tim B Menang</Badge>;
      } else {
        return <Badge className="bg-yellow-600 dark:bg-yellow-700">Seri</Badge>;
      }
    }
    
    return null;
  };

  const getTeamInfo = (match: Pertandingan, isTeamA: boolean) => {
    const isBye = match.is_bye;
    const hasTeamA = !!match.tim_a_id;
    const hasTeamB = !!match.tim_b_id;
    
    // Jika BYE dan ini Tim B, maka tampilkan "BYE"
    if (isBye && !isTeamA) {
      return {
        name: "BYE",
        displayName: "BYE",
        isBye: true,
        color: "text-gray-600 dark:text-gray-400",
        bgColor: "bg-gray-100 dark:bg-gray-800",
        darkBgColor: "dark:bg-gray-800",
        italic: true
      };
    }
    
    // Jika BYE dan ini Tim A, tampilkan nama tim
    if (isBye && isTeamA && hasTeamA) {
      return {
        name: match.tim_a?.nama || "Tim A",
        displayName: match.tim_a?.nama || "Tim A",
        isBye: false,
        color: "text-blue-700 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        darkBgColor: "dark:bg-blue-900/30",
        italic: false
      };
    }
    
    // Jika tidak ada tim B (BYE)
    if (!hasTeamB && !isTeamA) {
      return {
        name: "BYE",
        displayName: "BYE",
        isBye: true,
        color: "text-gray-600 dark:text-gray-400",
        bgColor: "bg-gray-100 dark:bg-gray-800",
        darkBgColor: "dark:bg-gray-800",
        italic: true
      };
    }
    
    // Jika tidak ada tim A (BYE)
    if (!hasTeamA && isTeamA) {
      return {
        name: "BYE",
        displayName: "BYE",
        isBye: true,
        color: "text-gray-600 dark:text-gray-400",
        bgColor: "bg-gray-100 dark:bg-gray-800",
        darkBgColor: "dark:bg-gray-800",
        italic: true
      };
    }
    
    // Tim normal
    const team = isTeamA ? match.tim_a : match.tim_b;
    const teamColor = isTeamA 
      ? "text-blue-700 dark:text-blue-400" 
      : "text-red-700 dark:text-red-400";
    const teamBgColor = isTeamA 
      ? "bg-blue-100 dark:bg-blue-900/30" 
      : "bg-red-100 dark:bg-red-900/30";
    const darkBgColor = isTeamA 
      ? "dark:bg-blue-900/30" 
      : "dark:bg-red-900/30";
    
    return {
      name: team?.nama || (isTeamA ? "Tim A" : "Tim B"),
      displayName: team?.nama || (isTeamA ? "Tim A" : "Tim B"),
      isBye: false,
      color: teamColor,
      bgColor: teamBgColor,
      darkBgColor: darkBgColor,
      italic: false
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Memuat data bracket...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !acara) {
    return (
      <div className="p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Acara tidak ditemukan"}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/pertandingan")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-8 bg-background dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => router.push("/pertandingan")}
            className="p-0 h-auto hover:bg-transparent dark:hover:bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="text-sm">Kembali</span>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Bracket Pertandingan
          </h1>
          <div>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
              {acara.nama}
            </h2>
            {acara.deskripsi && (
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                {acara.deskripsi}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            ID: {acara.id.substring(0, 8)}...
          </div>
          <Button 
            onClick={fetchBracketData} 
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-700"
          >
            <RefreshCw className="mr-2 h-3 w-3" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {stats.totalMatches > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Progress Tournament
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {stats.progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
            <div 
              className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${stats.progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.rounds}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Babak</p>
              </div>
              <div className="text-blue-500 dark:text-blue-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg md:text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.totalMatches}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Pertandingan</p>
              </div>
              <div className="text-green-500 dark:text-green-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg md:text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.completedMatches}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Selesai</p>
              </div>
              <div className="text-purple-500 dark:text-purple-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg md:text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.totalTeams}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Tim</p>
              </div>
              <div className="text-orange-500 dark:text-orange-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg md:text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {stats.byeMatches}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">BYE</p>
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bracket Table View - Urutan: Round terakhir (urutan tertinggi) di atas */}
      {bracketRounds.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Belum ada bracket pertandingan
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Mulai dengan membuat pertandingan untuk acara ini
            </p>
            <Button 
              onClick={() => router.push(`/pertandingan/tambah?acara=${acaraId}`)}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Buat Pertandingan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {bracketRounds.map((bracketRound, index) => {
            const isLatestRound = index === 0;
            
            return (
              <div key={bracketRound.round.id} className="space-y-3">
                {/* Round Header dengan indikator round terbaru */}
                <div className={`flex items-center justify-between p-4 rounded-lg ${
                  isLatestRound 
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 dark:border-blue-400" 
                    : "bg-gray-50 dark:bg-gray-900/50"
                }`}>
                  <div className="flex items-center gap-3">
                    {isLatestRound && (
                      <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded">
                        TERBARU
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          isLatestRound 
                            ? "bg-blue-600 dark:bg-blue-500 text-white" 
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        } text-xs font-bold`}>
                          {bracketRound.round.urutan}
                        </span>
                        {bracketRound.round.nama}
                        {bracketRound.isPlaceholder && (
                          <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            Akan Datang
                          </Badge>
                        )}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {bracketRound.matches.length} pertandingan
                        </p>
                        <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 dark:bg-green-400 rounded-full"
                            style={{ width: `${bracketRound.completedPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {bracketRound.completedPercentage}% selesai
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`${
                        isLatestRound 
                          ? "border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300" 
                          : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Babak {bracketRound.round.urutan}
                    </Badge>
                  </div>
                </div>

                {/* Matches Table */}
                <Card className="border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                            <TableHead className="w-12 text-gray-700 dark:text-gray-300 font-semibold">No</TableHead>
                            <TableHead className="w-1/4 text-gray-700 dark:text-gray-300 font-semibold">Tim A</TableHead>
                            <TableHead className="w-1/4 text-gray-700 dark:text-gray-300 font-semibold">Tim B</TableHead>
                            <TableHead className="w-1/6 text-center text-gray-700 dark:text-gray-300 font-semibold">Skor</TableHead>
                            <TableHead className="w-1/6 text-gray-700 dark:text-gray-300 font-semibold">Status</TableHead>
                            <TableHead className="w-1/6 text-gray-700 dark:text-gray-300 font-semibold">Hasil</TableHead>
                            <TableHead className="w-1/6 text-right text-gray-700 dark:text-gray-300 font-semibold">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bracketRound.matches.map((match, matchIndex) => {
                            const teamAInfo = getTeamInfo(match, true);
                            const teamBInfo = getTeamInfo(match, false);
                            
                            return (
                              <TableRow 
                                key={match.id} 
                                className={`hover:bg-gray-50 dark:hover:bg-gray-900/30 border-b border-gray-100 dark:border-gray-800 ${
                                  matchIndex === bracketRound.matches.length - 1 ? 'border-b-0' : ''
                                }`}
                              >
                                <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                  {matchIndex + 1}
                                </TableCell>
                                
                                {/* Tim A */}
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${teamAInfo.bgColor} ${teamAInfo.darkBgColor}`}>
                                      <span className={`text-sm font-medium ${teamAInfo.color}`}>
                                        {teamAInfo.displayName.charAt(0)}
                                      </span>
                                    </div>
                                    <div className="min-w-0">
                                      <span className={`font-medium truncate block ${teamAInfo.color} ${teamAInfo.italic ? 'italic' : ''}`}>
                                        {teamAInfo.displayName}
                                      </span>
                                      {teamAInfo.isBye && match.is_bye && (
                                        <Badge 
                                          variant="outline" 
                                          className="mt-0.5 text-[10px] bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                                        >
                                          BYE
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                
                                {/* Tim B */}
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${teamBInfo.bgColor} ${teamBInfo.darkBgColor}`}>
                                      <span className={`text-sm font-medium ${teamBInfo.color}`}>
                                        {teamBInfo.displayName.charAt(0)}
                                      </span>
                                    </div>
                                    <div className="min-w-0">
                                      <span className={`font-medium truncate block ${teamBInfo.color} ${teamBInfo.italic ? 'italic' : ''}`}>
                                        {teamBInfo.displayName}
                                      </span>
                                      {teamBInfo.isBye && !match.is_bye && (
                                        <Badge 
                                          variant="outline" 
                                          className="mt-0.5 text-[10px] bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                                        >
                                          BYE
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                
                                {/* Skor */}
                                <TableCell className="text-center">
                                  <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
                                    {match.skor_tim_a ?? "-"}
                                    <span className="mx-2 text-gray-400 dark:text-gray-500">:</span>
                                    {match.skor_tim_b ?? "-"}
                                  </div>
                                  {(teamAInfo.isBye || teamBInfo.isBye) && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                      {teamAInfo.isBye ? "Tim A BYE" : teamBInfo.isBye ? "Tim B BYE" : "BYE"}
                                    </div>
                                  )}
                                </TableCell>
                                
                                {/* Status */}
                                <TableCell>
                                  <Badge className={`${getStatusColor(match.status)} text-xs font-medium`}>
                                    {match.status}
                                  </Badge>
                                </TableCell>
                                
                                {/* Hasil */}
                                <TableCell>
                                  {getMatchResult(match)}
                                </TableCell>
                                
                                {/* Aksi */}
                                <TableCell className="text-right">
                                  <div className="flex justify-end">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => router.push(`/pertandingan/edit/${match.id}`)}
                                      disabled={match.id.includes('placeholder')}
                                      className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                      Edit
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Legenda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                Selesai
              </Badge>
              <span className="text-xs text-gray-600 dark:text-gray-400">Pertandingan sudah selesai</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                Berlangsung
              </Badge>
              <span className="text-xs text-gray-600 dark:text-gray-400">Pertandingan sedang berlangsung</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
                Dijadwalkan
              </Badge>
              <span className="text-xs text-gray-600 dark:text-gray-400">Pertandingan akan datang</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-xs font-medium text-blue-700 dark:text-blue-400">A</span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Tim A (Home)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">B</span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Tim BYE</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}