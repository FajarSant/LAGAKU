"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function TipeOlahragaPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<
    { id: string; nama: string; deskripsi: string | null; dibuat_pada: string }[]
  >([]);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("tipe_olahraga")
      .select("*")
      .order("nama", { ascending: true });
    setList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus tipe olahraga ini?")) return;

    await supabase.from("tipe_olahraga").delete().eq("id", id);
    loadData();
  };

  return (
    <div className="p-6">
      <Card className="shadow-md border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Tipe Olahraga</CardTitle>

          <Link href="/tipe-olahraga/tambah">
            <Button className="flex items-center gap-2">
              <FiPlus size={18} />
              Tambah Tipe
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          {/* If loading */}
          {loading ? (
            <p className="text-center py-4 text-gray-500">Memuat data...</p>
          ) : list.length === 0 ? (
            <p className="text-center py-4 text-gray-500">Belum ada data.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Nama</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="w-[150px] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {list.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nama}</TableCell>
                      <TableCell>
                        {item.deskripsi ? (
                          item.deskripsi
                        ) : (
                          <Badge variant="secondary">Tidak ada deskripsi</Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right flex justify-end gap-2">
                        <Link href={`/tipe-olahraga/edit/${item.id}`}>
                          <Button variant="outline" size="icon">
                            <FiEdit2 size={16} />
                          </Button>
                        </Link>

                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                        >
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
    </div>
  );
}
