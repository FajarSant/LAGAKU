"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Users, Trophy, TrendingUp, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [stats, setStats] = useState({
    totalAcara: 0,
    totalTim: 0,
    totalPeserta: 0,
    jumlahBerlangsung: 0,
  });
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    setRefreshing(true);

    try {
      const [acaraRes, timRes, pesertaRes, berlangsungRes, pertandinganRes] =
        await Promise.all([
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

      setStats({
        totalAcara: acaraRes.count || 0,
        totalTim: timRes.count || 0,
        totalPeserta: pesertaRes.count || 0,
        jumlahBerlangsung: berlangsungRes.count || 0,
      });

      const normalized = (pertandinganRes.data || []).map((item: any) => ({
        id: item.id,
        tanggal_pertandingan: item.tanggal_pertandingan,
        acara: item.acara || null,
      }));

      setRecentMatches(normalized);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const statCards = [
    {
      title: "Total Acara",
      value: stats.totalAcara,
      icon: <Trophy className="h-5 w-5" />,
      description: "Jumlah acara tersedia",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Tim",
      value: stats.totalTim,
      icon: <Users className="h-5 w-5" />,
      description: "Tim terdaftar",
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      title: "Total Peserta",
      value: stats.totalPeserta,
      icon: <Users className="h-5 w-5" />,
      description: "Peserta aktif",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Sedang Berlangsung",
      value: stats.jumlahBerlangsung,
      icon: <TrendingUp className="h-5 w-5" />,
      description: "Pertandingan aktif",
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
          <p className="text-muted-foreground mt-2">
            Ringkasan statistik dan aktivitas terbaru
          </p>
        </div>
        <Button
          onClick={loadDashboard}
          disabled={loading || refreshing}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Memperbarui..." : "Refresh"}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="border shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">{stat.value}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Matches Table */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Pertandingan Terbaru
          </CardTitle>
          <CardDescription>
            5 pertandingan terakhir yang dijadwalkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Acara</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-6 w-16 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : recentMatches.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Tidak ada data pertandingan
                    </TableCell>
                  </TableRow>
                ) : (
                  recentMatches.map((row) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {row.acara?.nama ?? "-"}
                      </TableCell>
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
                      <TableCell className="text-right">
                        <Badge variant="outline" className="font-normal">
                          Terjadwal
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {recentMatches.length > 0 && !loading && (
            <div className="mt-4 text-sm text-muted-foreground text-center">
              Menampilkan {recentMatches.length} pertandingan terbaru
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
    </div>
  );
}
