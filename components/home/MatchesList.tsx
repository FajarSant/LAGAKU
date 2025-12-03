"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Match = {
  id: string;
  tanggal_pertandingan: string | null;
  status: "dijadwalkan" | "berlangsung" | "selesai";
  skor_tuan_rumah: number;
  skor_tamu: number;
  lokasi_lapangan: string | null;
  peserta_tuan_rumah: { id: string; nama: string } | null;
  peserta_tamu: { id: string; nama: string } | null;
};

type Props = {
  selectedStatus: string;
  page: number;
  setPage: (p: number) => void;
};

export default function MatchesList({ selectedStatus, page, setPage }: Props) {
  const supabase = createClient();

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);

  const limit = 5;

  /** Fungsi judul dinamis */
  const getTitle = () => {
    if (selectedStatus === "berlangsung") return "Pertandingan Live";
    if (selectedStatus === "selesai") return "Hasil Pertandingan";
    return "Jadwal Pertandingan";
  };

  /** Fetch data */
  const fetchMatches = async () => {
    setLoading(true);

    const { count } = await supabase
      .from("pertandingan")
      .select("*", { head: true, count: "exact" })
      .eq("status", selectedStatus);

    setTotalRows(count || 0);

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data } = await supabase
      .from("pertandingan")
      .select(
        `
        *,
        peserta_tuan_rumah:peserta_tuan_rumah_id (id, nama),
        peserta_tamu:peserta_tamu_id (id, nama)
      `
      )
      .eq("status", selectedStatus)
      .order("tanggal_pertandingan", { ascending: true })
      .range(start, end);

    setMatches((data as Match[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMatches();
  }, [page, selectedStatus]);

  /** Skeleton */
  if (loading) {
    return (
      <section className="p-6">
        <h2 className="text-center font-bold text-2xl mb-6">{getTitle()}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-5 w-full mb-4" />
              <Skeleton className="h-10 w-20 mb-4" />
              <Skeleton className="h-3 w-28" />
            </Card>
          ))}
        </div>
      </section>
    );
  }

  /** No data */
  if (!loading && totalRows === 0) {
    return (
      <section className="p-6 text-center">
        <h2 className="font-bold text-2xl mb-6">{getTitle()}</h2>
        <p className="text-gray-500 text-xl mt-10">Tidak ada pertandingan</p>
      </section>
    );
  }

  /** MAIN UI */
  return (
    <section className="p-6">
      <h2 className="text-center font-bold text-2xl mb-6">{getTitle()}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {matches.map((m) => (
          <Card key={m.id} className="shadow">
            <CardHeader>
              <p
                className={`text-xs font-semibold ${
                  m.status === "berlangsung"
                    ? "text-red-600"
                    : m.status === "selesai"
                    ? "text-gray-600"
                    : "text-blue-600"
                }`}
              >
                {m.status === "berlangsung"
                  ? "Live"
                  : m.status === "selesai"
                  ? "Selesai"
                  : "Akan Datang"}
              </p>

              <CardTitle className="text-lg">
                {m.peserta_tuan_rumah?.nama || "Tuan Rumah"} vs{" "}
                {m.peserta_tamu?.nama || "Tamu"}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold mb-3">
                {m.status === "dijadwalkan"
                  ? "- vs -"
                  : `${m.skor_tuan_rumah} - ${m.skor_tamu}`}
              </p>

              <p className="text-xs text-gray-500">
                {m.tanggal_pertandingan
                  ? new Date(m.tanggal_pertandingan).toLocaleString()
                  : "TBA"}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Lokasi: {m.lokasi_lapangan || "-"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="mt-6 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={() => page > 1 && setPage(page - 1)}
              />
            </PaginationItem>

            <PaginationItem>
              <span className="px-4 py-2 text-sm text-gray-600">
                Halaman {page}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={() =>
                  page * limit < totalRows && setPage(page + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
}
