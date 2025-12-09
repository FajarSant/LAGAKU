"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FiPlus, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ===============================
// TYPE DEFINISI
// ===============================
interface FunMatchType {
  id: string;
  status: string;
  tanggal_pertandingan: string | null;
  waktu_pertandingan: string | null;
  lokasi_lapangan: string | null;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  tim_a: { id: string; nama: string } | null;
  tim_b: { id: string; nama: string } | null;
  acara: { id: string; nama: string } | null;
}

export default function FunMatchPage() {
  const supabase = createClient();
  const [data, setData] = useState<FunMatchType[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<FunMatchType | null>(null);

  // ===============================
  // GET FUN MATCH
  // ===============================
  const fetchFunMatch = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("pertandingan")
      .select(`
        id,
        status,
        tanggal_pertandingan,
        waktu_pertandingan,
        lokasi_lapangan,
        skor_tim_a,
        skor_tim_b,
        tim_a:tim_a_id!inner ( id, nama ),
        tim_b:tim_b_id!inner ( id, nama ),
        acara:acara_id!inner ( id, nama )
      `)
      .order("tanggal_pertandingan", { ascending: true });

    if (error) {
      console.error("Error mengambil fun match:", error);
      setLoading(false);
      return;
    }

    setData(
      (data as any[]).map((item) => ({
        ...item,
        tim_a: item.tim_a && Array.isArray(item.tim_a) ? item.tim_a[0] : item.tim_a,
        tim_b: item.tim_b && Array.isArray(item.tim_b) ? item.tim_b[0] : item.tim_b,
        acara: item.acara && Array.isArray(item.acara) ? item.acara[0] : item.acara,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchFunMatch();
  }, []);

  // ===============================
  // OPEN MODAL DETAIL
  // ===============================
  const openDetail = (item: FunMatchType) => {
    setSelected(item);
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Fun Match</h1>

        <Button asChild>
          <Link href="/pertandingan/fun-match/tambah">
            <FiPlus className="mr-2" size={16} /> Tambah Pertandingan
          </Link>
        </Button>
      </div>

      {/* LIST CARD */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Daftar Fun Match</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500 text-sm">Memuat data...</p>
          ) : data.length === 0 ? (
            <p className="text-gray-500 text-sm">Belum ada data fun match.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Acara</TableHead>
                    <TableHead>Tim A</TableHead>
                    <TableHead>Tim B</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.acara?.nama || "-"}</TableCell>

                      <TableCell>{item.tim_a?.nama || "-"}</TableCell>
                      <TableCell>{item.tim_b?.nama || "-"}</TableCell>

                      <TableCell>
                        {item.tanggal_pertandingan
                          ? new Date(item.tanggal_pertandingan).toLocaleDateString()
                          : "-"}
                      </TableCell>

                      <TableCell>{item.waktu_pertandingan || "-"}</TableCell>

                      <TableCell>{item.lokasi_lapangan || "-"}</TableCell>

                      <TableCell className="capitalize">{item.status}</TableCell>

                      <TableCell className="text-right space-x-2">
                        {/* DETAIL */}
                        <Button size="icon" variant="secondary" onClick={() => openDetail(item)}>
                          <FiEye size={16} />
                        </Button>

                        {/* EDIT */}
                        <Button size="icon" variant="outline" asChild>
                          <Link href={`/pertandingan/fun-match/edit/${item.id}`}>
                            <FiEdit size={16} />
                          </Link>
                        </Button>

                        {/* DELETE */}
                        <Button size="icon" variant="destructive">
                          <FiTrash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* =============================== */}
      {/* MODAL DETAIL PERTANDINGAN */}
      {/* =============================== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Pertandingan</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              {/* ACARA */}
              <div>
                <p className="text-sm text-muted-foreground">Acara</p>
                <p className="font-medium">{selected.acara?.nama}</p>
              </div>

              {/* TIM A - TIM B */}
              <div>
                <p className="text-sm text-muted-foreground">Tim</p>
                <p className="font-medium">
                  {selected.tim_a?.nama} vs {selected.tim_b?.nama}
                </p>
              </div>

              {/* SCOREBOARD */}
              <div className="mt-3 p-4 border rounded-lg">
                <p className="font-semibold mb-2">Skor Pertandingan</p>

                <div className="flex items-center justify-between text-center">
                  <div className="flex-1">
                    <p className="font-medium">{selected.tim_a?.nama}</p>
                    <p className="text-3xl font-bold">
                      {selected.skor_tim_a ?? 0}
                    </p>
                  </div>

                  <div className="px-4 text-xl font-bold">VS</div>

                  <div className="flex-1">
                    <p className="font-medium">{selected.tim_b?.nama}</p>
                    <p className="text-3xl font-bold">
                      {selected.skor_tim_b ?? 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* TANGGAL, WAKTU, LOKASI */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal</p>
                  <p>
                    {selected.tanggal_pertandingan
                      ? new Date(selected.tanggal_pertandingan).toLocaleDateString()
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Waktu</p>
                  <p>{selected.waktu_pertandingan || "-"}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Lokasi</p>
                  <p>{selected.lokasi_lapangan || "-"}</p>
                </div>
              </div>

              {/* STATUS */}
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="capitalize font-medium">{selected.status}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
