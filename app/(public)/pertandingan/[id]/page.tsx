"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import type { Pertandingan, Peserta, Acara } from "@/types/db";

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params.id as string;

  const [match, setMatch] = useState<Pertandingan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("pertandingan")
        .select(
          `
            *,
            acara:acara_id(id, nama),
            peserta_tuan_rumah:peserta_tuan_rumah_id(id, nama),
            peserta_tamu:peserta_tamu_id(id, nama)
          `
        )
        .eq("id", matchId)
        .single();

      if (!error && data) {
        setMatch(data as unknown as Pertandingan);
      }

      setLoading(false);
    };

    fetchData();
  }, [matchId]);

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Pertandingan tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="shadow-lg border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            {match.acara?.nama || "Acara Tidak Diketahui"}

            <Badge
              variant={
                match.status === "berlangsung"
                  ? "default"
                  : match.status === "selesai"
                  ? "secondary"
                  : "outline"
              }
            >
              {match.status}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Team Section */}
          <div className="grid grid-cols-3 items-center text-center">
            {/* Home */}
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-lg">
                {match.peserta_tuan_rumah?.nama || "Tuan Rumah"}
              </span>
            </div>

            {/* Score */}
            <div className="text-4xl font-bold">
              {match.skor_tuan_rumah} : {match.skor_tamu}
            </div>

            {/* Away */}
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-lg">
                {match.peserta_tamu?.nama || "Tamu"}
              </span>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Match Details */}
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tanggal</span>
              <span>
                {match.tanggal_pertandingan
                  ? new Date(match.tanggal_pertandingan).toLocaleString()
                  : "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Lokasi</span>
              <span>{match.lokasi_lapangan || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Durasi</span>
              <span>{match.durasi_menit} menit</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Menit Saat Ini</span>
              <span>{match.menit_saat_ini}</span>
            </div>

            <Separator />

            <div className="flex justify-between">
              <span className="text-muted-foreground">Dibuat Pada</span>
              <span>
                {new Date(match.dibuat_pada).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
