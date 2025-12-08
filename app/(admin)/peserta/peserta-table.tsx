"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface Tim {
  id: string;
  nama: string;
  jurusan: string | null;
  angkatan: string | null;
  nomor_hp: string | null;
  jumlah_pemain: number;
  acara: { nama: string } | null;
}

export default function PesertaTable({ tim }: { tim: Tim[] }) {
  const [open, setOpen] = useState(false);
  const [anggota, setAnggota] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [namaTim, setNamaTim] = useState("");

  const supabase = createClient();

  const loadAnggota = async (timId: string, timName: string) => {
    setLoading(true);
    setNamaTim(timName);
    const { data } = await supabase
      .from("anggota_tim")
      .select("nama_pemain, nim")
      .eq("tim_id", timId)
      .order("nama_pemain");

    setAnggota(data || []);
    setOpen(true);
    setLoading(false);
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-3 text-left">Nama Tim</th>
            <th className="p-3 text-left">Jurusan</th>
            <th className="p-3 text-left">Angkatan</th>
            <th className="p-3 text-left">No HP</th>
            <th className="p-3 text-left">Jumlah Pemain</th>
            <th className="p-3 text-left">Acara</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {tim.length > 0 ? (
            tim.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{t.nama}</td>
                <td className="p-3">{t.jurusan || "-"}</td>
                <td className="p-3">{t.angkatan || "-"}</td>
                <td className="p-3">{t.nomor_hp || "-"}</td>
                <td className="p-3">{t.jumlah_pemain}</td>
                <td className="p-3">{t.acara?.nama || "Tidak Ada Acara"}</td>
                <td className="p-3">
                  <Button size="sm" onClick={() => loadAnggota(t.id, t.nama)}>
                    Lihat Anggota
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-3 text-center" colSpan={7}>
                Tidak ada peserta ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Anggota */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Anggota Tim: {namaTim}</DialogTitle>
          </DialogHeader>

          {loading ? (
            <p>Memuat...</p>
          ) : anggota.length > 0 ? (
            <ul className="space-y-2 mt-2">
              {anggota.map((a, i) => (
                <li key={i} className="border p-2 rounded">
                  <strong>{a.nama_pemain}</strong>
                  <div className="text-xs text-gray-500">NIM: {a.nim || "-"}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm mt-2">Belum ada anggota tim.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
