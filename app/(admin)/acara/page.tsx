"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import Swal from "sweetalert2";

interface Acara {
  id: string;
  nama: string;
  tipe: string | null;
  lokasi: string | null;
  url_lokasi_maps: string | null;
  dibuat_pada: string;
}

export default function AcaraPage() {
  const supabase = createClient();
  const [acara, setAcara] = useState<Acara[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const { data } = await supabase
      .from("acara")
      .select("id, nama, tipe, lokasi, url_lokasi_maps, dibuat_pada")
      .order("dibuat_pada", { ascending: false });

    setAcara(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Hapus Acara?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch(`/api/acara/hapus/${id}`, { method: "DELETE" });

    if (res.ok) {
      Swal.fire("Berhasil", "Acara berhasil dihapus", "success");
      loadData();
    } else {
      Swal.fire("Gagal", "Terjadi kesalahan saat menghapus", "error");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Daftar Acara</h1>

        <Link href="/acara/tambah">
          <Button className="flex items-center gap-2">
            <FiPlus size={16} />
            Tambah Acara
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Google Maps</TableHead>
              <TableHead>Dibuat Pada</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Memuat...
                </TableCell>
              </TableRow>
            ) : acara.length ? (
              acara.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.nama}</TableCell>
                  <TableCell>{row.tipe || "-"}</TableCell>
                  <TableCell>{row.lokasi || "-"}</TableCell>
                  <TableCell>
                    {row.url_lokasi_maps ? (
                      <a
                        href={row.url_lokasi_maps}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Lihat Maps
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(row.dibuat_pada).toLocaleDateString("id-ID")}
                  </TableCell>

                  <TableCell className="text-right flex justify-end gap-2">
                    <Link href={`/acara/edit/${row.id}`}>
                      <Button variant="outline" size="sm">
                        <FiEdit size={15} />
                      </Button>
                    </Link>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(row.id)}
                    >
                      <FiTrash2 size={15} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Tidak ada data acara.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
