"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Tim {
  id: string;
  nama: string;
  jurusan?: string;
  angkatan?: string;
  nomor_hp?: string;
  jumlah_pemain: number;  // dari anggota_tim
  acara_nama?: string;    // dari relasi acara_id → acara.nama
  dibuat_pada: string;
}

interface TimTableProps {
  data: Tim[];
  onDelete?: (tim: Tim) => void;
  onDetail?: (tim: Tim) => void;
  onEdit?: (tim: Tim) => void;
}

export default function TimTable({ data, onDelete, onDetail, onEdit }: TimTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Nama Tim</TableHead>
          <TableHead>Acara yang Diikuti</TableHead>
          <TableHead>Jurusan</TableHead>
          <TableHead>Angkatan</TableHead>
          <TableHead>Nomor HP</TableHead>
          <TableHead>Jumlah Pemain</TableHead>
          <TableHead>Dibuat Pada</TableHead>
          <TableHead className="text-center">Aksi</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.length === 0 && (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-6 text-gray-500">
              Tidak ada data tim.
            </TableCell>
          </TableRow>
        )}

        {data.map((tim, idx) => (
          <TableRow key={tim.id}>
            <TableCell>{idx + 1}</TableCell>

            <TableCell>{tim.nama}</TableCell>

            {/* ACARA NAMA */}
            <TableCell>{tim.acara_nama || "-"}</TableCell>

            <TableCell>{tim.jurusan || "-"}</TableCell>

            <TableCell>{tim.angkatan || "-"}</TableCell>

            <TableCell>{tim.nomor_hp || "-"}</TableCell>

            {/* JUMLAH PEMAIN */}
            <TableCell>{tim.jumlah_pemain}</TableCell>

            <TableCell>{new Date(tim.dibuat_pada).toLocaleString()}</TableCell>

            <TableCell>
              <div className="flex gap-2 justify-center">
                <Button size="sm" onClick={() => onDetail?.(tim)}>
                  Detail
                </Button>

                {onEdit && (
                  <Button size="sm" variant="outline" onClick={() => onEdit(tim)}>
                    Edit
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete?.(tim)}
                >
                  Hapus
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
