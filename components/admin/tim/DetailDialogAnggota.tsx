"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Anggota {
  id: string;
  nama_pemain: string;
  nim?: string;
  dibuat_pada: string;
}

interface DetailAnggotaModalProps {
  timId: string;
  onClose: () => void;
}

export default function DetailAnggotaModal({ timId, onClose }: DetailAnggotaModalProps) {
  const supabase = createClient();
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);

  const loadAnggota = async () => {
    const { data } = await supabase
      .from("anggota_tim")
      .select("*")
      .eq("tim_id", timId)
      .order("dibuat_pada");

    if (data) setAnggotaList(data as Anggota[]);
  };

  useEffect(() => {
    loadAnggota();
  }, [timId]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Anggota Tim</DialogTitle>
          <DialogClose />
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama Pemain</TableHead>
              <TableHead>NIM</TableHead>
              <TableHead>Dibuat Pada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anggotaList.map((a, idx) => (
              <TableRow key={a.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{a.nama_pemain}</TableCell>
                <TableCell>{a.nim || "-"}</TableCell>
                <TableCell>{new Date(a.dibuat_pada).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
