"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BracketListPage() {
  const supabase = createClient();
  const [acara, setAcara] = useState<any[]>([]);

  useEffect(() => {
    fetchAcara();
  }, []);

  const fetchAcara = async () => {
    const { data } = await supabase
      .from("acara")
      .select(`
        id,
        nama,
        deskripsi,
        dibuat_pada,
        pertandingan:pertandingan(count)
      `)
      .order("dibuat_pada", { ascending: false });
    
    setAcara(data || []);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Bracket Turnamen</h1>
          <p className="text-gray-500">Lihat bracket dari setiap acara turnamen</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {acara.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.nama}</CardTitle>
                  <CardDescription>
                    {item.deskripsi || "Turnamen gugur"}
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {item.pertandingan?.[0]?.count || 0} Match
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Dibuat: {new Date(item.dibuat_pada).toLocaleDateString("id-ID")}
                </div>
                <Link href={`/admin/bracket/${item.id}`}>
                  <Button size="sm">Lihat Bracket</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}