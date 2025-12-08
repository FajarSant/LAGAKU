"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

interface AcaraRel {
  id: string;
  nama: string;
}

interface TimRel {
  id: string;
  nama: string;
}

interface PertandinganRow {
  id: string;
  acara: AcaraRel | null;
  tim_a: TimRel | null;
  tim_b: TimRel | null;
  tanggal_pertandingan: string | null;
  waktu_pertandingan: string | null;
  lokasi_lapangan: string | null;
  status: string;
}

export default function PertandinganSayaPage() {
  const supabase = createClient();

  const [data, setData] = useState<PertandinganRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAcara, setFilterAcara] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [acaraList, setAcaraList] = useState<AcaraRel[]>([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const normalizeRel = (rel: any) => (Array.isArray(rel) ? rel[0] ?? null : rel ?? null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [{ data: acara }, { data: pertandingan }] = await Promise.all([
        supabase.from("acara").select("id,nama").order("nama"),
        supabase
          .from("pertandingan")
          .select(
            `
            id,
            status,
            tanggal_pertandingan,
            waktu_pertandingan,
            lokasi_lapangan,
            acara:acara_id ( id, nama ),
            tim_a:tim_a_id ( id, nama ),
            tim_b:tim_b_id ( id, nama )
          `
          )
          .order("tanggal_pertandingan", { ascending: false }),
      ]);

      if (acara) setAcaraList(acara);

      if (pertandingan) {
        const fixed = pertandingan.map((p: any) => ({
          id: p.id,
          status: p.status,
          tanggal_pertandingan: p.tanggal_pertandingan,
          waktu_pertandingan: p.waktu_pertandingan,
          lokasi_lapangan: p.lokasi_lapangan,
          acara: normalizeRel(p.acara),
          tim_a: normalizeRel(p.tim_a),
          tim_b: normalizeRel(p.tim_b),
        }));

        setData(fixed);
      }
    } catch (err) {
      toast.error("Gagal mengambil data pertandingan.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pertandingan ini?")) return;
    setDeletingId(id);
    const { error } = await supabase.from("pertandingan").delete().eq("id", id);
    setDeletingId(null);
    if (error) {
      toast.error("Gagal menghapus pertandingan.");
      return;
    }
    toast.success("Pertandingan dihapus.");
    fetchAll();
  };

  const filtered = data
    .filter((r) => {
      if (filterAcara !== "all" && r.acara?.id !== filterAcara) return false;
      if (filterStatus !== "all" && r.status !== filterStatus) return false;

      const s = search.toLowerCase();
      if (!s) return true;

      const acaraNama = r.acara?.nama.toLowerCase() ?? "";
      const ta = r.tim_a?.nama.toLowerCase() ?? "";
      const tb = r.tim_b?.nama.toLowerCase() ?? "";

      return acaraNama.includes(s) || ta.includes(s) || tb.includes(s);
    })
    .sort((a, b) => {
      const aName = a.acara?.nama.toLowerCase() ?? "";
      const bName = b.acara?.nama.toLowerCase() ?? "";
      return sortAsc ? aName.localeCompare(bName) : bName.localeCompare(aName);
    });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pertandingan Saya</h1>
          <p className="text-sm text-muted-foreground">
            Daftar pertandingan yang terkait dengan tim Anda
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Cari acara atau tim..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-[200px]"
          />

          <Select value={filterAcara} onValueChange={setFilterAcara}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter acara" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua acara</SelectItem>
              {acaraList.map((ac) => (
                <SelectItem key={ac.id} value={ac.id}>
                  {ac.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              <SelectItem value="dijadwalkan">Dijadwalkan</SelectItem>
              <SelectItem value="berlangsung">Berlangsung</SelectItem>
              <SelectItem value="selesai">Selesai</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => setSortAsc(!sortAsc)}>
            Sort {sortAsc ? "A→Z" : "Z→A"}
          </Button>

          <Link href="/pertandingan/tambah" className="inline-flex">
            <Button>
              <FiPlus className="mr-2" /> Tambah
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pertandingan</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[750px]">
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
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 8 }).map((_, j) => (
                          <TableCell key={j}>
                            <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : filtered.length === 0
                  ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6">
                          Tidak ada pertandingan
                        </TableCell>
                      </TableRow>
                    )
                  : filtered.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.acara?.nama ?? "-"}</TableCell>
                        <TableCell>{p.tim_a?.nama ?? "-"}</TableCell>
                        <TableCell>{p.tim_b?.nama ?? "-"}</TableCell>
                        <TableCell>
                          {p.tanggal_pertandingan
                            ? new Date(p.tanggal_pertandingan).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </TableCell>
                        <TableCell>{p.waktu_pertandingan?.slice(0, 5) ?? "-"}</TableCell>
                        <TableCell>{p.lokasi_lapangan ?? "-"}</TableCell>
                        <TableCell
                          className={`capitalize font-medium ${
                            p.status === "berlangsung"
                              ? "text-green-600"
                              : p.status === "selesai"
                              ? "text-gray-500"
                              : "text-blue-600"
                          }`}
                        >
                          {p.status}
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/pertandingan/edit/${p.id}`}>
                              <Button variant="ghost" size="sm">
                                <FiEdit />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(p.id)}
                              disabled={deletingId === p.id}
                            >
                              {deletingId === p.id ? "Menghapus..." : <FiTrash2 />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
