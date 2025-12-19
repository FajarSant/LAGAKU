"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Trophy, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "../ui/card";

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

export default function MatchesList({ selectedStatus, page, setPage }: MatchesListProps) {
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

      // Query dasar
      let query = supabase
        .from('pertandingan')
        .select(`
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
        `, { count: 'exact' })
        .order('tanggal_pertandingan', { ascending: true })
        .order('waktu_pertandingan', { ascending: true })
        .range(from, to);

      // Filter berdasarkan status
      if (selectedStatus !== 'semua') {
        query = query.eq('status', selectedStatus);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching matches:', error);
        return;
      }

      setMatches(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error:', error);
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
          label: "BERLANGSUNG"
        };
      case "dijadwalkan":
        return {
          color: "text-blue-400",
          bg: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
          border: "border-blue-500/30",
          icon: "⏰",
          label: "DIJADWALKAN"
        };
      case "selesai":
        return {
          color: "text-green-400",
          bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
          border: "border-green-500/30",
          icon: "🏆",
          label: "SELESAI"
        };
      default:
        return {
          color: "text-gray-400",
          bg: "bg-gray-500/20",
          border: "border-gray-500/30",
          icon: "📅",
          label: status.toUpperCase()
        };
    }
  };

  // Fungsi untuk format tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Daftar nama hari dalam bahasa Indonesia
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    
    // Daftar nama bulan dalam bahasa Indonesia
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

  // Fungsi untuk cek apakah tanggal adalah hari ini
  const isToday = (dateString: string) => {
    const today = new Date();
    const matchDate = new Date(dateString);
    
    return today.getDate() === matchDate.getDate() &&
           today.getMonth() === matchDate.getMonth() &&
           today.getFullYear() === matchDate.getFullYear();
  };

  // Fungsi untuk format tanggal relatif
  const getRelativeDate = (dateString: string) => {
    if (isToday(dateString)) {
      return "Hari Ini";
    }
    return formatDate(dateString);
  };

  // Fungsi untuk menentukan pemenang
  const getWinnerInfo = (match: Match) => {
    if (!match.pemenang_id) return null;
    
    if (match.pemenang_id === match.tim_a.id) {
      return { isWinner: true, team: "A" };
    } else if (match.tim_b && match.pemenang_id === match.tim_b.id) {
      return { isWinner: true, team: "B" };
    }
    return null;
  };

  // Total halaman
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-700 rounded w-2/3 mb-6"></div>
            <div className="h-32 bg-gray-700 rounded mb-4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">
          {selectedStatus === "semua" ? "Semua Pertandingan" : 
           selectedStatus === "berlangsung" ? "Pertandingan Berlangsung" :
           selectedStatus === "dijadwalkan" ? "Pertandingan Dijadwalkan" : "Pertandingan Selesai"}
        </h3>
        <div className="text-gray-400">
          <span className="font-medium">{totalCount}</span> pertandingan ditemukan
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700">
          <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-gray-500" />
          </div>
          <h4 className="text-xl font-bold mb-2">Tidak ada pertandingan</h4>
          <p className="text-gray-400">Tidak ada pertandingan dengan status "{selectedStatus}" saat ini.</p>
          <button 
            onClick={fetchMatches}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
          >
            Refresh
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const statusConfig = getStatusConfig(match.status);
              const relativeDate = getRelativeDate(match.tanggal_pertandingan);
              const winnerInfo = getWinnerInfo(match);
              
              return (
                <Card key={match.id} className="group relative overflow-hidden bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02]">
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full ${statusConfig.bg} border ${statusConfig.border}`}>
                    <span className={`text-sm font-medium ${statusConfig.color}`}>
                      {statusConfig.icon} {statusConfig.label}
                    </span>
                  </div>

                  {/* Date Badge */}
                  {isToday(match.tanggal_pertandingan) && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                      <span className="text-sm font-medium text-green-400">HARI INI</span>
                    </div>
                  )}

                  {/* Winner Crown */}
                  {winnerInfo && (
                    <div className="absolute top-16 right-4">
                      <div className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full flex items-center">
                        <Trophy className="w-3 h-3 text-yellow-400 mr-1" />
                        <span className="text-xs font-medium text-yellow-300">PEMENANG</span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Turnamen Info */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold mb-1">{match.acara.nama}</h4>
                      <div className="flex items-center text-sm text-gray-400">
                        <Trophy className="w-4 h-4 mr-2" />
                        {match.round.nama}
                      </div>
                    </div>

                    {/* Teams & Score */}
                    <div className="space-y-4 mb-6">
                      {/* Team A */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            winnerInfo?.team === 'A' 
                              ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 ring-2 ring-yellow-400' 
                              : 'bg-gradient-to-br from-blue-500 to-blue-600'
                          }`}>
                            <span className={`font-bold ${winnerInfo?.team === 'A' ? 'text-black' : 'text-white'}`}>
                              {winnerInfo?.team === 'A' ? '👑' : 'A'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold">{match.tim_a.nama}</p>
                            <p className="text-sm text-gray-400">{match.tim_a.jurusan || 'Tim A'}</p>
                          </div>
                        </div>
                        {match.skor_tim_a !== null && (
                          <div className={`px-3 py-1 rounded-lg ${
                            winnerInfo?.team === 'A' 
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                              : 'bg-gray-700'
                          }`}>
                            <span className="font-bold">{match.skor_tim_a}</span>
                          </div>
                        )}
                      </div>

                      {/* VS Line */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-3 py-1 bg-gray-800 text-gray-400 text-sm rounded-lg">VS</span>
                        </div>
                      </div>

                      {/* Team B */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            winnerInfo?.team === 'B' 
                              ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 ring-2 ring-yellow-400' 
                              : 'bg-gradient-to-br from-red-500 to-red-600'
                          }`}>
                            <span className={`font-bold ${winnerInfo?.team === 'B' ? 'text-black' : 'text-white'}`}>
                              {winnerInfo?.team === 'B' ? '👑' : 'B'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold">{match.tim_b?.nama || "BYE"}</p>
                            <p className="text-sm text-gray-400">{match.tim_b?.jurusan || "Tunggu lawan"}</p>
                          </div>
                        </div>
                        {match.tim_b && match.skor_tim_b !== null && (
                          <div className={`px-3 py-1 rounded-lg ${
                            winnerInfo?.team === 'B' 
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                              : 'bg-gray-700'
                          }`}>
                            <span className="font-bold">{match.skor_tim_b}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="space-y-3 border-t border-gray-700 pt-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className={isToday(match.tanggal_pertandingan) ? "text-green-400 font-medium" : ""}>
                          {relativeDate}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        {match.waktu_pertandingan}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="truncate">{match.lokasi_lapangan || 'Lokasi belum ditentukan'}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex space-x-3">
                      <button 
                        onClick={() => {
                          // Navigasi ke detail pertandingan
                          console.log('View match details:', match.id);
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
                      >
                        Lihat Detail
                      </button>
                      
                      {match.url_lokasi_maps && (
                        <a
                          href={match.url_lokasi_maps}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition flex items-center justify-center"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      
                      {match.status === "berlangsung" && (
                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium animate-pulse">
                          LIVE
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {matches.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex space-x-2">
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
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition ${
                        page === pageNum
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                          : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <div className="text-sm text-gray-400 ml-4">
                Halaman {page} dari {totalPages}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}