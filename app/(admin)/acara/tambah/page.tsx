"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function TambahAcaraPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [tipeOlahraga, setTipeOlahraga] = useState<
    { id: string; nama: string }[]
  >([]);

  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
    tipe_olahraga_id: "",
    lokasi: "",
    url_lokasi_maps: "",
  });

  const fetchTipeOlahraga = async () => {
    const { data } = await supabase
      .from("tipe_olahraga")
      .select("id, nama")
      .order("nama", { ascending: true });

    if (data) setTipeOlahraga(data);
  };

  useEffect(() => {
    fetchTipeOlahraga();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = await supabase.auth.getUser();

    const { error } = await supabase.from("acara").insert({
      nama: form.nama,
      deskripsi: form.deskripsi,
      tipe_olahraga_id: form.tipe_olahraga_id || null,
      lokasi: form.lokasi,
      url_lokasi_maps: form.url_lokasi_maps,
      dibuat_oleh: user.data.user?.id || null,
    });

    setLoading(false);

    if (!error) {
      router.push("/acara");
      router.refresh();
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full  shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-center mb-10 font-bold">Tambah Acara Baru</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GRID 2 KOLOM UNTUK DESKTOP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama */}
              <div className="space-y-2">
                <Label>Nama Acara</Label>
                <Input
                  placeholder="Contoh: Liga Futsal 2025"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  required
                />
              </div>

              {/* Lokasi */}
              <div className="space-y-2">
                <Label>Lokasi Acara</Label>
                <Input
                  placeholder="Contoh: GOR UNY"
                  value={form.lokasi}
                  onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
                />
              </div>

              {/* Tipe Olahraga */}
              <div className="space-y-2">
                <Label>Tipe Olahraga</Label>
                <Select
                  onValueChange={(value) =>
                    setForm({ ...form, tipe_olahraga_id: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih tipe olahraga" />
                  </SelectTrigger>

                  <SelectContent>
                    {tipeOlahraga.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Maps URL */}
              <div className="space-y-2">
                <Label>Google Maps URL</Label>
                <Input
                  placeholder="https://maps.google.com/..."
                  value={form.url_lokasi_maps}
                  onChange={(e) =>
                    setForm({ ...form, url_lokasi_maps: e.target.value })
                  }
                />
              </div>
            </div>

            {/* DESKRIPSI (FULL WIDTH) */}
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                placeholder="Deskripsikan acara..."
                value={form.deskripsi}
                onChange={(e) =>
                  setForm({ ...form, deskripsi: e.target.value })
                }
                className="min-h-[120px]"
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Acara"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
