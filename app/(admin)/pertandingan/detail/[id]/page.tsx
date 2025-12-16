"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function PertandinganPage() {
  const supabase = createClient();
  const [data, setData] = useState<any[]>([]);

useEffect(() => {
  supabase
    .from("pertandingan")
    .select(`
      id,
      status,
      skor_tim_a,
      skor_tim_b,
      tim_a_id,
      tim_b_id,
      tim_a:tim_a_id(
        nama
      ),
      tim_b:tim_b_id(
        nama
      ),
      round_id,
      round:round_id(
        nama
      ),
      acara_id,
      acara:acara_id(
        id,
        nama
      )
    `)
    .order("dibuat_pada", { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        console.error("Error fetching data:", error);
        return;
      }
      console.log("Fetched data:", data); // Debug log
      setData(data || []);
    });
}, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Manajemen Pertandingan</h1>
        <Link href="/admin/pertandingan/tambah">
          <Button>Generate Pertandingan</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Acara</TableHead>
            <TableHead>Babak</TableHead>
            <TableHead>Tim A</TableHead>
            <TableHead>Skor</TableHead>
            <TableHead>Tim B</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((m) => (
            <TableRow key={m.id}>
              <TableCell>{m.acara?.nama}</TableCell>
              <TableCell>{m.round?.nama}</TableCell>
              <TableCell>
                {m.tim_a?.nama || "BYE"} {/* Perhatikan perubahan disini */}
              </TableCell>
              <TableCell className="text-center">
                {m.skor_tim_a ?? "-"} : {m.skor_tim_b ?? "-"}
              </TableCell>
              <TableCell>
                {m.tim_b?.nama || "BYE"} {/* Perhatikan perubahan disini */}
              </TableCell>
              <TableCell>{m.status}</TableCell>
              <TableCell>
                <Link href={`/admin/pertandingan/edit/${m.id}`}>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
