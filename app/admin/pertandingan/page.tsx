"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AcaraWithCount = {
  id: string;
  nama: string;
  total_pertandingan: number;
};

export default function PertandinganPage() {
  const supabase = createClient();
  const [acaraList, setAcaraList] = useState<AcaraWithCount[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("acara")
        .select(`
          id,
          nama,
          pertandingan(count)
        `);

      const mapped =
        data?.map((a) => ({
          id: a.id,
          nama: a.nama,
          total_pertandingan: a.pertandingan?.[0]?.count ?? 0,
        })) ?? [];

      setAcaraList(mapped);
    };

    load();
  }, [supabase]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Manajemen Pertandingan</h1>
        <Link href="/admin/pertandingan/tambah">
          <Button>Generate Pertandingan</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {acaraList.map((acara) => (
          <Card key={acara.id}>
            <CardHeader>
              <CardTitle>{acara.nama}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total pertandingan: {acara.total_pertandingan}
              </span>
              <Link href={`/admin/pertandingan/detail/${acara.id}`}>
                <Button variant="outline">Lihat Detail</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
