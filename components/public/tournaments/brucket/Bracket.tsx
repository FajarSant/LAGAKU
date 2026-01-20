"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { Trophy, Users, Calendar, Clock, MapPin, ChevronRight, RefreshCw } from "lucide-react";

interface Match {
  id: string;
  round_id: string;
  tim_a_id: string;
  tim_b_id: string | null;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  pemenang_id: string | null;
  status: 'dijadwalkan' | 'berlangsung' | 'selesai';
  tanggal_pertandingan: string | null;
  waktu_pertandingan: string | null;
  lokasi_lapangan: string | null;
  tim_a?: {
    id: string;
    nama: string;
    jurusan: string | null;
  };
  tim_b?: {
    id: string;
    nama: string;
    jurusan: string | null;
  };
  round?: {
    id: string;
    nama: string;
    urutan: number;
  };
}

interface RoundMatches {
  roundName: string;
  roundOrder: number;
  matches: Match[];
}

interface BracketProps {
  eventId: string;
}

export default function Bracket({ eventId }: BracketProps) {
  const [rounds, setRounds] = useState<RoundMatches[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState("");

  useEffect(() => {
    fetchBracketData();
  }, [eventId]);

  const fetchBracketData = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Get event name
      const { data: eventData } = await supabase
        .from("acara")
        .select("nama")
        .eq("id", eventId)
        .single();

      if (eventData) {
        setEventName(eventData.nama);
      }

      // Get all rounds for this event
      const { data: roundsData } = await supabase
        .from("round")
        .select("id, nama, urutan")
        .eq("acara_id", eventId)
        .order("urutan", { ascending: true });

      if (!roundsData) return;

      // Get matches for each round
      const roundsWithMatches = await Promise.all(
        roundsData.map(async (round) => {
          const { data: matchesData } = await supabase
            .from("pertandingan")
            .select(`
              *,
              tim_a:tim_a_id(id, nama, jurusan),
              tim_b:tim_b_id(id, nama, jurusan)
            `)
            .eq("acara_id", eventId)
            .eq("round_id", round.id)
            .order("tanggal_pertandingan", { ascending: true });

          return {
            roundName: round.nama,
            roundOrder: round.urutan,
            matches: matchesData || [],
          };
        })
      );

      setRounds(roundsWithMatches);
    } catch (error) {
      console.error("Error fetching bracket data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "dijadwalkan":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs">Dijadwalkan</Badge>;
      case "berlangsung":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs animate-pulse">Berlangsung</Badge>;
      case "selesai":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 text-xs">Selesai</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "-";
    return timeString.substring(0, 5);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-32 w-48" />
            <Skeleton className="h-32 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  if (rounds.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Belum ada bracket turnamen
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Turnamen belum memiliki pertandingan yang terjadwal
        </p>
        <Button
          variant="outline"
          onClick={fetchBracketData}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bracket Turnamen
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{eventName}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchBracketData}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Bracket Visualization */}
      <div className="relative">
        {/* Connecting lines container */}
        <div className="absolute inset-0 pointer-events-none">
          {rounds.slice(0, -1).map((round, roundIndex) =>
            round.matches.map((match, matchIndex) => (
              <div key={`line-${roundIndex}-${matchIndex}`}>
                {/* Line from match to next round */}
                {matchIndex % 2 === 0 && (
                  <>
                    {/* Horizontal line */}
                    <div
                      className="absolute border-t-2 border-gray-300 dark:border-gray-600"
                      style={{
                        left: `${(roundIndex + 1) * 25 - 12}%`,
                        top: `calc(${(matchIndex * 2 + 1) * 50}px + 48px)`,
                        width: "6%",
                      }}
                    />
                    {/* Vertical line */}
                    <div
                      className="absolute border-l-2 border-gray-300 dark:border-gray-600"
                      style={{
                        left: `${(roundIndex + 1) * 25 - 6}%`,
                        top: `calc(${(matchIndex * 2 + 1) * 50}px + 48px)`,
                        height: "100px",
                      }}
                    />
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Rounds */}
        <div className="flex gap-8 overflow-x-auto pb-4">
          {rounds.map((round, roundIndex) => (
            <div
              key={round.roundName}
              className="flex-shrink-0"
              style={{ width: "24%" }}
            >
              {/* Round Header */}
              <div className="mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {round.roundName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {round.matches.length} Pertandingan
                </p>
              </div>

              {/* Matches */}
              <div className="space-y-2">
                {round.matches.map((match, matchIndex) => (
                  <Card
                    key={match.id}
                    className={`border ${
                      match.status === "berlangsung"
                        ? "border-green-200 dark:border-green-800"
                        : match.status === "selesai"
                        ? "border-blue-200 dark:border-blue-800"
                        : "border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    <CardContent className="p-4">
                      {/* Match Header */}
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(match.status)}
                          {match.tanggal_pertandingan && (
                            <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(match.tanggal_pertandingan)}
                            </span>
                          )}
                        </div>
                        {match.waktu_pertandingan && (
                          <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(match.waktu_pertandingan)}
                          </span>
                        )}
                      </div>

                      {/* Teams */}
                      <div className="space-y-2">
                        {/* Team A */}
                        <div
                          className={`flex justify-between items-center p-2 rounded ${
                            match.pemenang_id === match.tim_a_id
                              ? "bg-green-50 dark:bg-green-900/20"
                              : "bg-gray-50 dark:bg-gray-800/50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="font-medium">
                              {match.tim_a?.nama || "Tim A"}
                            </span>
                            {match.tim_a?.jurusan && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({match.tim_a.jurusan})
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-lg">
                            {match.skor_tim_a !== null ? match.skor_tim_a : "-"}
                          </span>
                        </div>

                        {/* Team B */}
                        {match.tim_b ? (
                          <div
                            className={`flex justify-between items-center p-2 rounded ${
                              match.pemenang_id === match.tim_b_id
                                ? "bg-green-50 dark:bg-green-900/20"
                                : "bg-gray-50 dark:bg-gray-800/50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              <span className="font-medium">
                                {match.tim_b.nama}
                              </span>
                              {match.tim_b.jurusan && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  ({match.tim_b.jurusan})
                                </span>
                              )}
                            </div>
                            <span className="font-bold text-lg">
                              {match.skor_tim_b !== null ? match.skor_tim_b : "-"}
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center p-2 rounded bg-yellow-50 dark:bg-yellow-900/20">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                              <span className="font-medium">BYE</span>
                            </div>
                            <span className="font-bold text-lg">-</span>
                          </div>
                        )}
                      </div>

                      {/* Winner */}
                      {match.pemenang_id && (
                        <div className="mt-2 text-center">
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                            Pemenang:{" "}
                            {match.pemenang_id === match.tim_a_id
                              ? match.tim_a?.nama
                              : match.tim_b?.nama}
                          </Badge>
                        </div>
                      )}

                      {/* Location */}
                      {match.lokasi_lapangan && (
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {match.lokasi_lapangan}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Keterangan</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Tim A</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Tim B</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">BYE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Pemenang</span>
          </div>
        </div>
      </div>
    </div>
  );
}