"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, CalendarDays, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

// SHADCN TABLE
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LatestMatch {
  id: string;
  tanggal_pertandingan: string | null;
  status: string;
  skor_tuan_rumah: number;
  skor_tamu: number;
  peserta_tuan_rumah: { nama: string };
  peserta_tamu: { nama: string };
}

export default function DashboardAdmin() {
  const supabase = createClient();

  const [totalAcara, setTotalAcara] = useState(0);
  const [totalPeserta, setTotalPeserta] = useState(0);
  const [totalPertandingan, setTotalPertandingan] = useState(0);
  const [totalPengguna, setTotalPengguna] = useState(0);

  const [latestMatches, setLatestMatches] = useState<LatestMatch[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("SEMUA");

  useEffect(() => {
    fetchData();
    fetchLatestMatches();
  }, []);

  // ====================== FETCH STATS ========================
  async function fetchData() {
    const [
      { count: acaraCount },
      { count: pesertaCount },
      { count: pertandinganCount },
      { count: penggunaCount },
    ] = await Promise.all([
      supabase.from("acara").select("*", { count: "exact", head: true }),
      supabase.from("peserta").select("*", { count: "exact", head: true }),
      supabase.from("pertandingan").select("*", { count: "exact", head: true }),
      supabase.from("pengguna").select("*", { count: "exact", head: true }),
    ]);

    setTotalAcara(acaraCount || 0);
    setTotalPeserta(pesertaCount || 0);
    setTotalPertandingan(pertandinganCount || 0);
    setTotalPengguna(penggunaCount || 0);
  }

  // ====================== FETCH LATEST MATCHES ========================
  async function fetchLatestMatches() {
    const { data } = await supabase
      .from("pertandingan")
      .select(`
        id,
        tanggal_pertandingan,
        status,
        skor_tuan_rumah,
        skor_tamu,
        peserta_tuan_rumah:peserta_tuan_rumah_id(nama),
        peserta_tamu:peserta_tamu_id(nama)
      `)
      .order("tanggal_pertandingan", { ascending: false })
      .limit(20);

    const mapped = (data ?? []).map((match) => ({
      ...match,
      peserta_tuan_rumah: match.peserta_tuan_rumah?.[0] ?? { nama: "-" },
      peserta_tamu: match.peserta_tamu?.[0] ?? { nama: "-" },
    }));

    setLatestMatches(mapped);
  }

  // FILTERING
  const filteredMatches =
    filterStatus === "SEMUA"
      ? latestMatches
      : latestMatches.filter((m) => m.status.toLowerCase() === filterStatus.toLowerCase());

  // ====================== UI ========================
  return (
    <div className="space-y-8">
      {/* TITLE */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-muted-foreground text-sm">
          Monitoring data kompetisi secara real-time.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Acara" value={totalAcara} icon={<CalendarDays className="size-5 text-primary" />} />
        <StatsCard title="Total Peserta" value={totalPeserta} icon={<Users className="size-5 text-primary" />} />
        <StatsCard title="Pertandingan" value={totalPertandingan} icon={<Trophy className="size-5 text-primary" />} />
        <StatsCard title="Pengguna" value={totalPengguna} icon={<Activity className="size-5 text-primary" />} />
      </div>

      {/* LATEST MATCHES */}
      <Card className="shadow-sm border">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-lg font-semibold">Pertandingan Terbaru</CardTitle>

          {/* FILTER BUTTONS */}
          <div className="flex flex-wrap gap-2">
            {["SEMUA", "berlangsung", "selesai", "akan datang"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                onClick={() => setFilterStatus(status)}
                className="text-sm"
              >
                {status === "SEMUA"
                  ? "Semua"
                  : status === "berlangsung"
                    ? "Berlangsung"
                    : status === "selesai"
                      ? "Selesai"
                      : "Akan Datang"}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tuan Rumah</TableHead>
                  <TableHead>Skor</TableHead>
                  <TableHead>Tamu</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredMatches.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-4 text-muted-foreground"
                    >
                      Tidak ada data pertandingan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMatches.map((m) => (
                    <TableRow key={m.id} className="hover:bg-muted/40 transition">
                      <TableCell>{m.peserta_tuan_rumah.nama}</TableCell>
                      <TableCell className="font-semibold">
                        {m.skor_tuan_rumah} - {m.skor_tamu}
                      </TableCell>
                      <TableCell>{m.peserta_tamu.nama}</TableCell>
                      <TableCell className="capitalize">{m.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ====================== COMPONENT: StatsCard ========================

function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="shadow-sm border hover:shadow-md transition-all duration-200 rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
