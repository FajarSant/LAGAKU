"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function TambahAcaraPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("acara").insert({
      nama: form.nama,
      deskripsi: form.deskripsi,
      dibuat_oleh: user?.id ?? null,
    });

    setLoading(false);

    if (!error) {
      router.push("/acara");
      router.refresh();
    } else {
      console.error("Gagal menambah acara:", error);
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-3xl shadow border">
        <CardHeader>
          <CardTitle className="text-xl text-center font-bold">
            Tambah Turnamen Gugur
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NAMA */}
            <div className="space-y-2">
              <Label>Nama Turnamen</Label>
              <Input
                placeholder="Contoh: Futsal Cup 2025"
                value={form.nama}
                onChange={(e) =>
                  setForm({ ...form, nama: e.target.value })
                }
                required
              />
            </div>

            {/* DESKRIPSI */}
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                placeholder="Deskripsi singkat turnamen..."
                value={form.deskripsi}
                onChange={(e) =>
                  setForm({ ...form, deskripsi: e.target.value })
                }
                className="min-h-[120px]"
              />
            </div>

            {/* ACTION */}
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Turnamen"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/acara")}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
