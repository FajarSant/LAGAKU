"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// ====== TYPE DEFINISI ======
interface RecentMatch {
  id: string;
  tanggal_pertandingan: string;
  acara: {
    id: string;
    nama: string;
  }[] | null;
}

export default function AdminDashboard() {
  const supabase = createClient();

  const [totalAcara, setTotalAcara] = useState<number>(0);
  const [totalTim, setTotalTim] = useState<number>(0);
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);
  const [loading, setLoading] = useState(true);

  // ======= LOAD DATA DASHBOARD =======
  const loadDashboard = async () => {
    setLoading(true);

    // --- total acara ---
    const { count: acaraCount } = await supabase
      .from("acara")
      .select("*", { count: "exact", head: true });

    // --- total tim ---
    const { count: timCount } = await supabase
      .from("tim")
      .select("*", { count: "exact", head: true });

    // --- pertandingan terbaru ---
    const { data: pertandingan } = await supabase
      .from("pertandingan")
      .select("id, tanggal_pertandingan, acara ( id, nama )")
      .order("tanggal_pertandingan", { ascending: false })
      .limit(5);

    setTotalAcara(acaraCount || 0);
    setTotalTim(timCount || 0);

    // Sesuaikan agar acara berupa array (Supabase memang return array)
    const normalize = (pertandingan || []).map((item: any) => ({
      id: item.id,
      tanggal_pertandingan: item.tanggal_pertandingan,
      acara: item.acara ? [item.acara] : null,
    }));

    setRecentMatches(normalize);
    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard Admin</h1>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Total Acara</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {loading ? "..." : totalAcara}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Total Tim</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {loading ? "..." : totalTim}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Total Pertandingan Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {loading ? "..." : recentMatches.length}
          </CardContent>
        </Card>
      </div>

      {/* ===== TABLE PERTANDINGAN TERBARU ===== */}
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
                  <TableCell>{row.acara?.[0]?.nama ?? "-"}</TableCell>
                  <TableCell>
                    {new Date(row.tanggal_pertandingan).toLocaleDateString(
                      "id-ID",
                      { day: "2-digit", month: "long", year: "numeric" }
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* BUTTON */}
      <div className="flex justify-end">
        <Button onClick={loadDashboard}>Refresh</Button>
      </div>
    </div>
  );
}
