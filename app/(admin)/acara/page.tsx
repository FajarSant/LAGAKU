"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { FiPlus, FiMapPin, FiEdit, FiTrash } from "react-icons/fi";
import Swal from "sweetalert2";

interface Acara {
  id: string;
  nama: string;
  deskripsi: string | null;
  lokasi: string | null;
  url_lokasi_maps: string | null;
  tipe_olahraga_id: string | null;
  dibuat_pada: string;
}

export default function AcaraPage() {
  const supabase = createClient();
  const [acara, setAcara] = useState<Acara[]>([]);
  const [filtered, setFiltered] = useState<Acara[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAcara = async () => {
    const { data, error } = await supabase
      .from("acara")
      .select("*")
      .order("dibuat_pada", { ascending: false });

    if (!error && data) {
      setAcara(data);
      setFiltered(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAcara();
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(acara.filter((item) => item.nama.toLowerCase().includes(s)));
  }, [search, acara]);

  // ================================
  // HANDLE DELETE
  // ================================
  const handleDelete = async (id: string, nama: string) => {
    const result = await Swal.fire({
      title: `Hapus Acara?`,
      text: `Acara "${nama}" akan dihapus secara permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from("acara").delete().eq("id", id);

      if (!error) {
        Swal.fire("Terhapus!", "Acara berhasil dihapus.", "success");
        fetchAcara();
      } else {
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus.", "error");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Daftar Acara</h1>

        <Button asChild className="gap-2">
          <Link href="/acara/tambah">
            <FiPlus />
            Tambah Acara
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Cari acara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Loading */}
      {loading && <p className="text-muted-foreground">Memuat data...</p>}

      {/* List Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="hover:shadow-lg transition-all border border-neutral-200"
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span className="font-semibold text-lg">{item.nama}</span>
                <Badge
                  variant="secondary"
                  className="capitalize text-xs px-2 py-1"
                >
                  {item.tipe_olahraga_id ? "Olahraga" : "Umum"}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* DESKRIPSI */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.deskripsi || "Tidak ada deskripsi"}
              </p>

              {/* LOKASI */}
              {item.lokasi && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FiMapPin className="text-red-500" />
                  <span>{item.lokasi}</span>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="space-y-2 pt-2">

                {/* DETAIL BUTTON */}
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-lg"
                >
                  <Link href={`/acara/${item.id}`}>Lihat Detail</Link>
                </Button>

                {/* EDIT + DELETE */}
                <div className="flex items-center justify-between gap-2">
                  <Button
                    asChild
                    variant="secondary"
                    className="flex-1 rounded-lg gap-2"
                  >
                    <Link href={`/acara/edit/${item.id}`}>
                      <FiEdit size={18} />
                      Edit
                    </Link>
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1 rounded-lg gap-2"
                    onClick={() => handleDelete(item.id, item.nama)}
                  >
                    <FiTrash size={18} />
                    Hapus
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-muted-foreground mt-10">
          Tidak ada acara ditemukan.
        </p>
      )}
    </div>
  );
}
