"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface Match {
  id: string;
  status: "dijadwalkan" | "berlangsung" | "selesai";
  tanggal_pertandingan: string;
  waktu_pertandingan: string;
  lokasi_lapangan: string | null;
  url_lokasi_maps: string | null;
  tim_a_id: string;
  tim_b_id: string | null;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  pemenang_id: string | null;
  acara_id: string;
  round_id: string;
  tim_a: {
    id: string;
    nama: string;
    jurusan: string | null;
  };
  tim_b: {
    id: string;
    nama: string;
    jurusan: string | null;
  } | null;
  acara: {
    id: string;
    nama: string;
  };
  round: {
    id: string;
    nama: string;
  };
}

interface MatchesListProps {
  selectedStatus: string;
  page: number;
  setPage: (page: number) => void;
}

const ITEMS_PER_PAGE = 6;

export default function MatchesList({
  selectedStatus,
  page,
  setPage,
}: MatchesListProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchMatches();
  }, [selectedStatus, page]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from("pertandingan")
        .select(
          `
          *,
          tim_a:tim_a_id(
            id,
            nama,
            jurusan
          ),
          tim_b:tim_b_id(
            id,
            nama,
            jurusan
          ),
          acara:acara_id(
            id,
            nama
          ),
          round:round_id(
            id,
            nama
          )
        `,
          { count: "exact" }
        )
        .order("tanggal_pertandingan", { ascending: true })
        .order("waktu_pertandingan", { ascending: true })
        .range(from, to);

      if (selectedStatus !== "semua") {
        query = query.eq("status", selectedStatus);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching matches:", error);
        return;
      }

      setMatches(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "berlangsung":
        return {
          color: "text-red-400",
          bg: "bg-gradient-to-r from-red-500/20 to-orange-500/20",
          border: "border-red-500/30",
          icon: "🔥",
          label: "BERLANGSUNG",
        };
      case "dijadwalkan":
        return {
          color: "text-blue-400",
          bg: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
          border: "border-blue-500/30",
          icon: "⏰",
          label: "DIJADWALKAN",
        };
      case "selesai":
        return {
          color: "text-green-400",
          bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
          border: "border-green-500/30",
          icon: "🏆",
          label: "SELESAI",
        };
      default:
        return {
          color: "text-gray-400",
          bg: "bg-gray-500/20",
          border: "border-gray-500/30",
          icon: "📅",
          label: status.toUpperCase(),
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} ${monthName} ${year}`;
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const matchDate = new Date(dateString);

    return (
      today.getDate() === matchDate.getDate() &&
      today.getMonth() === matchDate.getMonth() &&
      today.getFullYear() === matchDate.getFullYear()
    );
  };

  const getRelativeDate = (dateString: string) => {
    if (isToday(dateString)) {
      return "Hari Ini";
    }
    return formatDate(dateString);
  };

  const getWinnerInfo = (match: Match) => {
    if (!match.pemenang_id) return null;

    if (match.pemenang_id === match.tim_a.id) {
      return { isWinner: true, team: "A" };
    } else if (match.tim_b && match.pemenang_id === match.tim_b.id) {
      return { isWinner: true, team: "B" };
    }
    return null;
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedStatus === "semua"
              ? "Semua Pertandingan"
              : selectedStatus === "berlangsung"
              ? "Pertandingan Berlangsung"
              : selectedStatus === "dijadwalkan"
              ? "Pertandingan Dijadwalkan"
              : "Pertandingan Selesai"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Lacak dan ikuti perkembangan pertandingan
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Users className="w-3 h-3 mr-1" />
          {totalCount} Pertandingan
        </Badge>
      </div>

      {matches.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <CardTitle className="text-xl mb-2">Tidak ada pertandingan</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Tidak ada pertandingan dengan status "{selectedStatus}" saat ini.
            </CardDescription>
            <Button
              onClick={fetchMatches}
              className="mt-4"
              variant="outline"
            >
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const statusConfig = getStatusConfig(match.status);
              const relativeDate = getRelativeDate(match.tanggal_pertandingan);
              const winnerInfo = getWinnerInfo(match);

              return (
                <Card 
                  key={match.id} 
                  className="group hover:shadow-xl transition-all duration-300 hover:border-blue-500/50"
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{match.acara.nama}</CardTitle>
                        <CardDescription className="flex items-center">
                          <Trophy className="w-3 h-3 mr-1" />
                          {match.round.nama}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={statusConfig.bg + " " + statusConfig.border}
                      >
                        <span className={statusConfig.color}>{statusConfig.icon} {statusConfig.label}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4 mb-6">
                      {/* Team A */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            winnerInfo?.team === "A"
                              ? "bg-linear-to-br from-yellow-500 to-yellow-600 ring-2 ring-yellow-400"
                              : "bg-linear-to-br from-blue-500 to-blue-600"
                          }`}>
                            <span className="font-bold text-white">
                              {winnerInfo?.team === "A" ? "👑" : "A"}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold">{match.tim_a.nama}</p>
                            <p className="text-sm text-gray-500">{match.tim_a.jurusan || "Tim A"}</p>
                          </div>
                        </div>
                        {match.skor_tim_a !== null && (
                          <div className={`px-3 py-1 rounded-lg font-bold ${
                            winnerInfo?.team === "A"
                              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}>
                            {match.skor_tim_a}
                          </div>
                        )}
                      </div>

                      {/* VS Line */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm rounded-lg">
                            VS
                          </span>
                        </div>
                      </div>

                      {/* Team B */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            winnerInfo?.team === "B"
                              ? "bg-linear-to-br from-yellow-500 to-yellow-600 ring-2 ring-yellow-400"
                              : "bg-linear-to-br from-red-500 to-red-600"
                          }`}>
                            <span className="font-bold text-white">
                              {winnerInfo?.team === "B" ? "👑" : "B"}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold">{match.tim_b?.nama || "BYE"}</p>
                            <p className="text-sm text-gray-500">{match.tim_b?.jurusan || "Tunggu lawan"}</p>
                          </div>
                        </div>
                        {match.tim_b && match.skor_tim_b !== null && (
                          <div className={`px-3 py-1 rounded-lg font-bold ${
                            winnerInfo?.team === "B"
                              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}>
                            {match.skor_tim_b}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className={isToday(match.tanggal_pertandingan) ? "text-green-600 dark:text-green-400 font-medium" : ""}>
                          {relativeDate}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        {match.waktu_pertandingan}
                      </div>
                      {match.lokasi_lapangan && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="truncate">{match.lokasi_lapangan}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-2">
                      <Button className="flex-1">Lihat Detail</Button>
                      {match.url_lokasi_maps && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={match.url_lokasi_maps} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {match.status === "berlangsung" && (
                        <Button variant="destructive" className="animate-pulse">
                          LIVE
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setPage(Math.max(1, page - 1))}
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={page === pageNum}
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                Halaman {page} dari {totalPages}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}