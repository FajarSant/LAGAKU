"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
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

interface RecentMatch {
  id: string;
  tanggal_pertandingan: string;
  acara: {
    id: string;
    nama: string;
  } | null;
}

export default function AdminDashboard() {
  const supabase = createClient();

  const [totalAcara, setTotalAcara] = useState(0);
  const [totalTim, setTotalTim] = useState(0);
  const [totalPeserta, setTotalPeserta] = useState(0);
  const [jumlahBerlangsung, setJumlahBerlangsung] = useState(0);
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);
  const [loading, setLoading] = useState(true);

  // ===================== LOAD DASHBOARD ======================
  const loadDashboard = async () => {
    setLoading(true);

    // Parallel requests agar jauh lebih cepat
    const [
      acaraRes,
      timRes,
      pesertaRes,
      berlangsungRes,
      pertandinganRes,
    ] = await Promise.all([
      supabase.from("acara").select("*", { count: "exact", head: true }),
      supabase.from("tim").select("*", { count: "exact", head: true }),
      supabase.from("peserta").select("*", { count: "exact", head: true }),
      supabase
        .from("pertandingan")
        .select("*", { count: "exact", head: true })
        .eq("status", "berlangsung"),
      supabase
        .from("pertandingan")
        .select("id, tanggal_pertandingan, acara ( id, nama )")
        .order("tanggal_pertandingan", { ascending: false })
        .limit(5),
    ]);

    setTotalAcara(acaraRes.count || 0);
    setTotalTim(timRes.count || 0);
    setTotalPeserta(pesertaRes.count || 0);
    setJumlahBerlangsung(berlangsungRes.count || 0);

    const normalized = (pertandinganRes.data || []).map((item: any) => ({
      id: item.id,
      tanggal_pertandingan: item.tanggal_pertandingan,
      acara: item.acara || null,
    }));

    setRecentMatches(normalized);

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard Admin</h1>

      {/* ================== SUMMARY CARDS ================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Total Acara</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {loading ? "..." : totalAcara}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Total Tim</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {loading ? "..." : totalTim}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Total Peserta</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {loading ? "..." : totalPeserta}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Pertandingan Berlangsung</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {loading ? "..." : jumlahBerlangsung}
          </CardContent>
        </Card>
      </div>

      {/* ================== TABEL PERTANDINGAN TERBARU ================== */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Pertandingan Terbaru</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Acara</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMatches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-6">
                    Tidak ada data
                  </TableCell>
                </TableRow>
              )}

              {recentMatches.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.acara?.nama ?? "-"}</TableCell>
                  <TableCell>
                    {new Date(row.tanggal_pertandingan).toLocaleDateString(
                      "id-ID",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ================== BUTTON ================== */}
      <div className="flex justify-end">
        <Button onClick={loadDashboard} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>
    </div>
  );
}
