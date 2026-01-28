"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

/* ================================
   TYPE DATA HASIL NORMALISASI
================================ */
type PesertaType = {
  id: string;
  nama_pemain: string;
  nim?: string;
  tim?: {
    nama: string;
    jurusan?: string;
    angkatan?: string;
    nomor_hp?: string;
    acara?: {
      nama: string;
    } | null;
  } | null;
};

export default function AdminPesertaPage() {
  const supabase = createClient();
  const [peserta, setPeserta] = useState<PesertaType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPeserta();
  }, []);

  /* ================================
      LOAD DATA DARI SUPABASE
   ================================ */
  const loadPeserta = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("anggota_tim")
      .select(`
        id,
        nama_pemain,
        nim,
        tim:tim_id (
          nama,
          jurusan,
          angkatan,
          nomor_hp,
          acara:acara_id (
            nama
          )
        )
      `)
      .order("nama_pemain");

    if (!error && data) {
      // NORMALISASI DATA (tim[] → tim object)
      const normalize = data.map((row: any) => {
        const timObj = Array.isArray(row.tim) ? row.tim[0] : row.tim;

        return {
          id: row.id,
          nama_pemain: row.nama_pemain,
          nim: row.nim || null,
          tim: timObj
            ? {
                nama: timObj.nama,
                jurusan: timObj.jurusan,
                angkatan: timObj.angkatan,
                nomor_hp: timObj.nomor_hp,
                acara: Array.isArray(timObj.acara)
                  ? timObj.acara[0] || null
                  : timObj.acara || null,
              }
            : null,
        } as PesertaType;
      });

      setPeserta(normalize);
    }

    setLoading(false);
  };

  const filtered = peserta.filter((p) =>
    p.nama_pemain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Data Peserta Lomba</h1>

      <Card className="p-4">
        <Input
          placeholder="Cari nama peserta..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </Card>

      <Card className="p-4">
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Pemain</TableHead>
                  <TableHead>NIM</TableHead>
                  <TableHead>Tim</TableHead>
                  <TableHead>Jurusan</TableHead>
                  <TableHead>Angkatan</TableHead>
                  <TableHead>Nomor HP</TableHead>
                  <TableHead>Acara</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nama_pemain}</TableCell>
                    <TableCell>{item.nim ?? "-"}</TableCell>
                    <TableCell>{item.tim?.nama ?? "-"}</TableCell>
                    <TableCell>{item.tim?.jurusan ?? "-"}</TableCell>
                    <TableCell>{item.tim?.angkatan ?? "-"}</TableCell>
                    <TableCell>{item.tim?.nomor_hp ?? "-"}</TableCell>
                    <TableCell>{item.tim?.acara?.nama ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
