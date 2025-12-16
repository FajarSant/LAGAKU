"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

import { Match } from "@/types/type";
import BracketHeader from "@/components/admin/bracket/BracketHeader";
import BracketRound from "@/components/admin/bracket/BracketRound";
import BracketStats from "@/components/admin/bracket/BracketStats";

export default function SimpleBracketPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const acaraId = params.id as string;

  const [acara, setAcara] = useState<any>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (acaraId) {
      fetchData();
    }
  }, [acaraId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get acara
      const { data: acaraData } = await supabase
        .from("acara")
        .select("*")
        .eq("id", acaraId)
        .single();
      
      if (!acaraData) {
        console.error("Acara tidak ditemukan");
        return;
      }
      
      setAcara(acaraData);

      // Get matches dengan cara yang lebih reliable
      const { data: matchesData, error } = await supabase
        .from("pertandingan")
        .select(`
          id,
          status,
          skor_tim_a,
          skor_tim_b,
          tim_a_id,
          tim_b_id,
          round_id
        `)
        .eq("acara_id", acaraId)
        .order("round_id", { ascending: true });

      if (error) {
        console.error("Error fetching matches:", error);
        return;
      }

      if (!matchesData || matchesData.length === 0) {
        setMatches([]);
        return;
      }

      // Get semua ID yang diperlukan
      const timIds = Array.from(new Set([
        ...matchesData.map(m => m.tim_a_id),
        ...matchesData.map(m => m.tim_b_id)
      ].filter(Boolean)));

      const roundIds = Array.from(new Set(
        matchesData.map(m => m.round_id).filter(Boolean)
      ));

      // Get tim data
      const { data: timData } = await supabase
        .from("tim")
        .select("id, nama")
        .in("id", timIds);

      // Get round data
      const { data: roundData } = await supabase
        .from("round")
        .select("id, nama, urutan")
        .in("id", roundIds);

      // Transform data
      const transformedMatches: Match[] = matchesData.map(match => {
        const timA = timData?.find(t => t.id === match.tim_a_id);
        const timB = timData?.find(t => t.id === match.tim_b_id);
        const round = roundData?.find(r => r.id === match.round_id);

        return {
          id: match.id,
          status: match.status,
          skor_tim_a: match.skor_tim_a,
          skor_tim_b: match.skor_tim_b,
          tim_a: timA ? { nama: timA.nama } : null,
          tim_b: timB ? { nama: timB.nama } : null,
          round: round ? { 
            nama: round.nama, 
            urutan: round.urutan 
          } : { nama: "Unknown", urutan: 0 }
        };
      });

      setMatches(transformedMatches);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group matches by round
  const groupedMatches = matches.reduce((acc, match) => {
    const roundName = match.round.nama;
    if (!acc[roundName]) {
      acc[roundName] = [];
    }
    acc[roundName].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  // Sort rounds by urutan
  const rounds = Object.entries(groupedMatches)
    .map(([name, matches]) => ({
      name,
      urutan: matches[0].round.urutan,
      matches
    }))
    .sort((a, b) => a.urutan - b.urutan);

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
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <BracketHeader
        acara={acara}
        onBack={() => router.push("/admin/bracket")}
        onRefresh={fetchData}
      />

      {matches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Belum ada pertandingan</p>
            <p className="text-sm text-gray-500 mt-1">
              Generate pertandingan terlebih dahulu
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex overflow-x-auto gap-6 pb-4">
            {rounds.map((round) => (
              <BracketRound
                key={round.name}
                name={round.name}
                urutan={round.urutan}
                matches={round.matches}
              />
            ))}
          </div>

          <BracketStats
            rounds={rounds.length}
            matches={matches.length}
          />
        </>
      )}
    </div>
  );
}