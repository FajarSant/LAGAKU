"use client";

import { Tim } from "@/types/pertandingan";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Props {
  timList: Tim[];
  acaraId: string;
  onDelete: (tim: Tim) => void;
  onSelect: (timId: string) => void;
}

export default function DaftarTim({ timList, onDelete, onSelect }: Props) {
  if (timList.length === 0) return <p className="text-muted-foreground">Belum ada tim terdaftar.</p>;

  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Nama Tim</TableHead>
          <TableHead>Jumlah Anggota</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timList.map((tim, i) => (
          <TableRow key={tim.id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{tim.nama}</TableCell>
            <TableCell>{tim.anggota?.length ?? 0}</TableCell>
            <TableCell className="space-x-2">
              <Button size="sm" onClick={() => onSelect(tim.id)}>Detail</Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(tim)}>Hapus</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
