"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle as AlertCircleIcon } from "lucide-react";
import { Acara, BracketRoundData, Round, StatsData, Pertandingan } from "@/utils";
import { LoadingBracket } from "@/components/admin/bracket/LoadingBracket";
import { BracketHeader } from "@/components/admin/bracket/BracketHeader";
import { EmptyBracket } from "@/components/admin/bracket/EmpatyBracket";
import { BracketRound } from "@/components/admin/bracket/BracketRound";
import { BracketStats } from "@/components/admin/bracket/BracketStats";
import { BracketLegend } from "@/components/admin/bracket/BracketLagend";

type PertandinganWithBye = Pertandingan & {
  is_bye?: boolean;
};

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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBracketData = async () => {
    try {
      setLoading(true);
      setError(null);

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

      const { data: timData, error: timError } = await supabase
        .from("tim")
        .select("id, nama, status")
        .eq("acara_id", acaraId);

      const totalTeams = timData?.length || 0;

      const { data: roundsData, error: roundsError } = await supabase
        .from("round")
        .select("*")
        .eq("acara_id", acaraId)
        .order("urutan", { ascending: true });

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
        });
        return;
      }

      const { data: matchesData, error: matchesError } = await supabase
        .from("pertandingan")
        .select("*")
        .eq("acara_id", acaraId)
        .order("round_id", { ascending: true });

      if (matchesError) {
        console.error("Error fetching matches:", matchesError);
        return;
      }

      const roundsWithMatches: BracketRoundData[] = [];

      for (const round of roundsData) {
        const roundMatches = (matchesData || []).filter(
          (m) => m.round_id === round.id
        );

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

        roundsWithMatches.push({
          round: {
            ...round,
            min_tim: round.min_tim ?? 2,
            max_tim: round.max_tim ?? 2,
          },
          matches: enrichedMatches,
        });
      }

      if (roundsWithMatches.length > 0) {
        const lastRound = roundsWithMatches[roundsWithMatches.length - 1];
        const lastRoundMatches = lastRound.matches;

        const allMatchesCompleted = lastRoundMatches.every(
          (m) => m.status === "selesai" || (m as PertandinganWithBye).is_bye
        );

        const winnersFromLastRound = lastRoundMatches
          .filter((m) => m.pemenang_id || (m as PertandinganWithBye).is_bye)
          .map((m) => 
            (m as PertandinganWithBye).is_bye 
              ? m.tim_a_id 
              : m.pemenang_id
          )
          .filter(Boolean) as string[];

        if (allMatchesCompleted && winnersFromLastRound.length > 1) {
          const nextRoundUrutan = lastRound.round.urutan + 1;
          const currentTime = new Date().toISOString();

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
            dibuat_pada: currentTime,
            min_tim: 2,
            max_tim: 2,
          };

          const placeholderMatches: Pertandingan[] = [];
          for (let i = 0; i < Math.ceil(winnersFromLastRound.length / 2); i++) {
            const timAId = winnersFromLastRound[i * 2];
            const timBId = winnersFromLastRound[i * 2 + 1];

            const placeholderMatch: Pertandingan = {
              id: `placeholder-match-${nextRoundUrutan}-${i}`,
              acara_id: acaraId,
              round_id: placeholderRound.id,
              tim_a_id: timAId,
              tim_b_id: timBId,
              status: "dijadwalkan",
              skor_tim_a: undefined,
              skor_tim_b: undefined,
              pemenang_id: undefined,
              is_bye: false,
              tanggal_pertandingan: undefined,
              waktu_pertandingan: undefined,
              lokasi_lapangan: undefined,
              url_lokasi_maps: undefined,
              durasi_pertandingan: undefined,
              dibuat_pada: currentTime,
              tim_a: timAId ? timData?.find((t) => t.id === timAId) : undefined,
              tim_b: timBId ? timData?.find((t) => t.id === timBId) : undefined,
              round: placeholderRound,
              acara: acaraData,
            };

            placeholderMatches.push(placeholderMatch);
          }

          roundsWithMatches.push({
            round: placeholderRound,
            matches: placeholderMatches,
            isPlaceholder: true,
          });
        }
      }

      setBracketRounds(roundsWithMatches);

      const totalMatches = roundsWithMatches.reduce(
        (sum, round) => sum + round.matches.length,
        0
      );

      const completedMatches = roundsWithMatches.reduce(
        (sum, round) =>
          sum + round.matches.filter((m) => m.status === "selesai").length,
        0
      );

      setStats({
        rounds: roundsWithMatches.length,
        totalMatches,
        completedMatches,
        totalTeams,
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

  const handleCreateMatch = (acaraId: string) => {
    router.push(`/admin/pertandingan?acara=${acaraId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <LoadingBracket />
        </div>
      </div>
    );
  }

  if (error || !acara) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>
              {error || "Acara tidak ditemukan"}
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/pertandingan/bracket")}>
            Kembali ke Daftar Bracket
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <BracketHeader
          acara={acara}
          onBack={() => router.push("/bracket")}
          onRefresh={fetchBracketData}
          loading={loading}
        />

        {bracketRounds.length === 0 ? (
          <EmptyBracket acaraId={acaraId} onCreateMatch={handleCreateMatch} />
        ) : (
          <>
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              {bracketRounds.map((bracketRound, index) => (
                <BracketRound
                  key={bracketRound.round.id}
                  bracketRound={bracketRound}
                  hasNextRound={index < bracketRounds.length - 1}
                />
              ))}
            </div>

            <BracketStats stats={stats} />

            <BracketLegend />
          </>
        )}
      </div>
    </div>
  );
}