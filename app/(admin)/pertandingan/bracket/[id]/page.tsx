"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, ArrowLeft, RefreshCw, ChevronRight, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Acara {
  id: string;
  nama: string;
  deskripsi?: string;
}

interface Tim {
  id: string;
  nama: string;
  status: string;
}

interface Round {
  id: string;
  nama: string;
  urutan: number;
  acara_id: string;
  dibuat_pada: string;
}

interface Pertandingan {
  id: string;
  acara_id: string;
  round_id: string;
  tim_a_id: string | null;
  tim_b_id: string | null;
  status: string;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  pemenang_id: string | null;
  is_bye: boolean;
  tanggal_pertandingan: string | null;
  waktu_pertandingan: string | null;
  tim_a?: Tim;
  tim_b?: Tim;
  round?: Round;
}

interface BracketRound {
  round: Round;
  matches: Pertandingan[];
  isPlaceholder?: boolean;
}

// ==================== BracketHeader Component ====================
function BracketHeader({ acara, onBack, onRefresh }: { 
  acara: Acara; 
  onBack: () => void; 
  onRefresh: () => void; 
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          size="sm"
          className="h-8 px-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Kembali</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={onRefresh}
          size="sm"
          className="h-8"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h1 className="text-2xl font-bold">{acara.nama}</h1>
        </div>
        
        {acara.deskripsi && (
          <p className="text-gray-600">{acara.deskripsi}</p>
        )}
      </div>
    </div>
  );
}

// ==================== MatchCard Component ====================
function MatchCard({ match }: { match: Pertandingan }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "selesai":
        return "bg-green-100 text-green-800 border-green-200";
      case "berlangsung":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "dijadwalkan":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isTeamAWinner = match.status === "selesai" && 
                       match.skor_tim_a !== null && 
                       match.skor_tim_b !== null && 
                       match.skor_tim_a > match.skor_tim_b;

  const isTeamBWinner = match.status === "selesai" && 
                       match.skor_tim_a !== null && 
                       match.skor_tim_b !== null && 
                       match.skor_tim_b > match.skor_tim_a;

  const isByeMatch = match.is_bye;

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${
      match.status === "selesai" ? "border-green-200" : ""
    } ${isByeMatch ? "border-dashed" : ""}`}>
      <CardContent className="p-4">
        {/* Status */}
        <div className="mb-3 flex items-center justify-between">
          <Badge className={`text-xs ${getStatusColor(match.status)} border`}>
            {match.status}
            {isByeMatch && " (BYE)"}
          </Badge>
        </div>

        {/* Teams */}
        <div className="space-y-3">
          {/* Team A */}
          <div className={`flex justify-between items-center p-2 rounded ${
            isTeamAWinner ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200" :
            "bg-gray-50"
          }`}>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {match.tim_a?.nama || "TBD"}
              </span>
              {isByeMatch && match.status === "selesai" && (
                <Crown className="h-3 w-3 text-amber-500" />
              )}
            </div>
            <span className={`font-bold text-lg ${
              isTeamAWinner ? "text-green-700" : ""
            }`}>
              {match.skor_tim_a ?? "-"}
            </span>
          </div>

          {/* VS Separator */}
          <div className="text-center text-xs text-gray-500">VS</div>

          {/* Team B - hanya muncul jika bukan BYE */}
          {!isByeMatch ? (
            <div className={`flex justify-between items-center p-2 rounded ${
              isTeamBWinner ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200" :
              "bg-gray-50"
            }`}>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {match.tim_b?.nama || "TBD"}
                </span>
              </div>
              <span className={`font-bold text-lg ${
                isTeamBWinner ? "text-green-700" : ""
              }`}>
                {match.skor_tim_b ?? "-"}
              </span>
            </div>
          ) : (
            <div className="text-center text-xs text-gray-400 italic py-2">
              Bye - Tim langsung lolos
            </div>
          )}
        </div>

        {/* Winner announcement */}
        {match.status === "selesai" && !isByeMatch &&
          match.skor_tim_a !== null &&
          match.skor_tim_b !== null && (
            <div className="mt-3 pt-3 border-t border-green-200">
              {isTeamAWinner && match.tim_a ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-green-600 font-medium">
                    🏆 {match.tim_a.nama} menang
                  </p>
                  <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                    Lolos ke round berikutnya
                  </Badge>
                </div>
              ) : isTeamBWinner && match.tim_b ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-green-600 font-medium">
                    🏆 {match.tim_b.nama} menang
                  </p>
                  <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                    Lolos ke round berikutnya
                  </Badge>
                </div>
              ) : null}
            </div>
          )}
          
        {/* Bye match info */}
        {isByeMatch && match.status === "selesai" && match.tim_a && (
          <div className="mt-3 pt-3 border-t border-amber-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-amber-600 font-medium">
                ⚡ {match.tim_a.nama} mendapat BYE
              </p>
              <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800">
                Langsung lolos
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ==================== BracketRound Component ====================
function BracketRound({ 
  round, 
  matches, 
  isPlaceholder = false,
  isFinalRound = false,
  hasNextRound = false
}: { 
  round: Round; 
  matches: Pertandingan[]; 
  isPlaceholder?: boolean;
  isFinalRound?: boolean;
  hasNextRound?: boolean;
}) {
  // Format nama round
  const getRoundDisplayName = (nama: string, urutan: number, matchCount: number) => {
    if (matchCount === 1) return "Final";
    if (matchCount === 2) return "Semifinal";
    if (matchCount === 4) return "Quarterfinal";
    if (nama.toLowerCase().includes("final")) return nama;
    return `Round ${urutan}`;
  };

  const displayName = getRoundDisplayName(round.nama, round.urutan, matches.length);
  const byeMatches = matches.filter(m => m.is_bye);
  const normalMatches = matches.filter(m => !m.is_bye);

  return (
    <div className={`min-w-[320px] flex-shrink-0 relative ${
      isPlaceholder ? "opacity-75" : ""
    }`}>
      {/* Round Header */}
      <div className="mb-4 pb-3 border-b sticky top-0 bg-white z-20">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{displayName}</h3>
            {isFinalRound && (
              <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">
                FINAL
              </Badge>
            )}
            {isPlaceholder && (
              <Badge variant="outline" className="text-xs">
                Preview
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            R{round.urutan}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{normalMatches.length} match</span>
          {byeMatches.length > 0 && (
            <span className="text-amber-600">
              {byeMatches.length} bye
            </span>
          )}
        </div>
      </div>

      {/* Matches */}
      <div className="space-y-4">
        {normalMatches.map((match, index) => (
          <div key={match.id} className="relative">
            <MatchCard match={match} />
            
            {/* Arrow untuk next round */}
            {hasNextRound && index < normalMatches.length - 1 && (
              <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </div>
            )}
          </div>
        ))}
        
        {/* Bye matches section */}
        {byeMatches.length > 0 && (
          <div className="pt-4 border-t">
            <div className="text-xs text-gray-500 mb-2">Tim dengan BYE:</div>
            <div className="space-y-2">
              {byeMatches.map((match) => (
                <div key={match.id} className="bg-amber-50 border border-amber-200 rounded p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown className="h-3 w-3 text-amber-500" />
                      <span className="text-sm font-medium">{match.tim_a?.nama}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      BYE
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Final badge */}
      {isFinalRound && matches.length > 0 && !isPlaceholder && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            🏆 JUARA
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== BracketStats Component ====================
function BracketStats({ rounds, totalMatches, completedMatches }: { 
  rounds: number; 
  totalMatches: number;
  completedMatches: number;
}) {
  const completionPercentage = totalMatches > 0 
    ? Math.round((completedMatches / totalMatches) * 100)
    : 0;

  return (
    <div className="border-t pt-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{rounds}</div>
          <div className="text-sm text-gray-600">Total Babak</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{totalMatches}</div>
          <div className="text-sm text-gray-600">Total Pertandingan</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{completedMatches}</div>
          <div className="text-sm text-gray-600">Selesai</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
          <div className="text-sm text-blue-600">Progress</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress Turnamen</span>
          <span className="font-medium">{completionPercentage}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ==================== Main Bracket Page ====================
export default function SimpleBracketPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const acaraId = params.id as string;

  const [acara, setAcara] = useState<Acara | null>(null);
  const [bracketRounds, setBracketRounds] = useState<BracketRound[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBracketData = async () => {
    try {
      setLoading(true);

      // 1. Fetch acara
      const { data: acaraData, error: acaraError } = await supabase
        .from("acara")
        .select("*")
        .eq("id", acaraId)
        .single();

      if (acaraError || !acaraData) {
        console.error("Acara tidak ditemukan");
        return;
      }
      setAcara(acaraData);

      // 2. Fetch rounds dengan urutan
      const { data: roundsData, error: roundsError } = await supabase
        .from("round")
        .select("*")
        .eq("acara_id", acaraId)
        .order("urutan", { ascending: true });

      if (roundsError) {
        console.error("Error fetching rounds:", roundsError);
        return;
      }

      if (!roundsData || roundsData.length === 0) {
        setBracketRounds([]);
        return;
      }

      // 3. Fetch semua pertandingan untuk acara ini
      const { data: matchesData, error: matchesError } = await supabase
        .from("pertandingan")
        .select("*")
        .eq("acara_id", acaraId)
        .order("round_id", { ascending: true });

      if (matchesError) {
        console.error("Error fetching matches:", matchesError);
        return;
      }

      // 4. Fetch data tim untuk semua pertandingan
      const timIds = new Set<string>();
      matchesData?.forEach(match => {
        if (match.tim_a_id) timIds.add(match.tim_a_id);
        if (match.tim_b_id) timIds.add(match.tim_b_id);
      });

      const { data: timData, error: timError } = await supabase
        .from("tim")
        .select("*")
        .in("id", Array.from(timIds));

      if (timError) {
        console.error("Error fetching teams:", timError);
        return;
      }

      // 5. Process bracket rounds
      const roundsWithMatches: BracketRound[] = [];

      for (const round of roundsData) {
        const roundMatches = matchesData?.filter(m => m.round_id === round.id) || [];
        
        // Enrich matches with team data
        const enrichedMatches = roundMatches.map(match => ({
          ...match,
          tim_a: match.tim_a_id ? timData?.find(t => t.id === match.tim_a_id) : undefined,
          tim_b: match.tim_b_id ? timData?.find(t => t.id === match.tim_b_id) : undefined,
          round: round
        }));

        roundsWithMatches.push({
          round,
          matches: enrichedMatches
        });
      }

      // 6. Generate placeholder round jika ada round terakhir selesai
      if (roundsWithMatches.length > 0) {
        const lastRound = roundsWithMatches[roundsWithMatches.length - 1];
        const lastRoundMatches = lastRound.matches;
        
        // Cek apakah semua match di round terakhir sudah selesai
        const allMatchesCompleted = lastRoundMatches.every(m => 
          m.status === "selesai" || m.is_bye
        );
        
        // Hitung pemenang dari round terakhir
        const winnersFromLastRound = lastRoundMatches
          .filter(m => m.pemenang_id || m.is_bye)
          .map(m => m.is_bye ? m.tim_a_id : m.pemenang_id)
          .filter(Boolean) as string[];
        
        // Jika ada pemenang dan belum ada round berikutnya
        if (allMatchesCompleted && winnersFromLastRound.length > 1) {
          const nextRoundUrutan = lastRound.round.urutan + 1;
          
          // Buat placeholder round
          const placeholderRound: Round = {
            id: `placeholder-${nextRoundUrutan}`,
            nama: winnersFromLastRound.length === 1 ? "Final" : 
                  winnersFromLastRound.length === 2 ? "Semifinal" : 
                  winnersFromLastRound.length === 4 ? "Quarterfinal" : 
                  `Round ${nextRoundUrutan}`,
            urutan: nextRoundUrutan,
            acara_id: acaraId,
            dibuat_pada: new Date().toISOString()
          };
          
          // Buat placeholder matches
          const placeholderMatches: Pertandingan[] = [];
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
              tim_a: timAId ? timData?.find(t => t.id === timAId) : undefined,
              tim_b: timBId ? timData?.find(t => t.id === timBId) : undefined,
              round: placeholderRound
            });
          }
          
          roundsWithMatches.push({
            round: placeholderRound,
            matches: placeholderMatches,
            isPlaceholder: true
          });
        }
      }

      setBracketRounds(roundsWithMatches);

    } catch (error) {
      console.error("Error fetching bracket data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (acaraId) {
      fetchBracketData();
    }
  }, [acaraId]);

  // Hitung statistik
  const totalMatches = bracketRounds.reduce((sum, round) => 
    sum + round.matches.length, 0
  );
  
  const completedMatches = bracketRounds.reduce((sum, round) => 
    sum + round.matches.filter(m => m.status === "selesai").length, 0
  );

  if (loading) {
    return (
      <div className="p-6 text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Memuat bracket...</p>
      </div>
    );
  }

  if (!acara) {
    return (
      <div className="p-6 text-center py-12">
        <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">Acara tidak ditemukan</p>
        <Button onClick={() => router.push("/admin/pertandingan")}>
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <BracketHeader
        acara={acara}
        onBack={() => router.push("/admin/pertandingan")}
        onRefresh={fetchBracketData}
      />

      {bracketRounds.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Belum ada bracket untuk acara ini</p>
            <p className="text-sm text-gray-500 mt-1">
              Generate pertandingan terlebih dahulu
            </p>
            <Button 
              onClick={() => router.push(`/admin/pertandingan/tambah?acara=${acaraId}`)}
              className="mt-4"
            >
              Generate Bracket
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex overflow-x-auto gap-6 pb-4">
            {bracketRounds.map((bracketRound, index) => {
              const isFinalRound = bracketRound.matches.length === 1 && 
                                  bracketRound.matches.every(m => !m.is_bye);
              const hasNextRound = index < bracketRounds.length - 1;
              
              return (
                <BracketRound
                  key={bracketRound.round.id}
                  round={bracketRound.round}
                  matches={bracketRound.matches}
                  isPlaceholder={bracketRound.isPlaceholder || false}
                  isFinalRound={isFinalRound}
                  hasNextRound={hasNextRound}
                />
              );
            })}
          </div>

          <BracketStats
            rounds={bracketRounds.length}
            totalMatches={totalMatches}
            completedMatches={completedMatches}
          />
          
          {/* Info Legend */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-3">Informasi Bracket</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></div>
                    <span>Match selesai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div>
                    <span>Match dijadwalkan</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    <span>Tim dengan BYE (langsung lolos)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <span>Babak final</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}