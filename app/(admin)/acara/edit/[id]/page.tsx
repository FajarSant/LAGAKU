"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Acara {
  id: string;
  nama_acara: string;
  lokasi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  deskripsi: string;
}

export default function EditAcaraPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [acara, setAcara] = useState<Acara | null>(null);

  const [form, setForm] = useState({
    nama_acara: "",
    lokasi: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    deskripsi: "",
  });

  // Fetch Acara
  useEffect(() => {
    const fetchAcara = async () => {
      const { data, error } = await supabase
        .from("acara")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        toast.error("Data acara tidak ditemukan");
        router.push("/acara");
        return;
      }

      setAcara(data);
      setForm({
        nama_acara: data.nama_acara,
        lokasi: data.lokasi,
        tanggal_mulai: data.tanggal_mulai,
        tanggal_selesai: data.tanggal_selesai,
        deskripsi: data.deskripsi,
      });

      setLoading(false);
    };

    fetchAcara();
  }, [params.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("acara")
      .update(form)
      .eq("id", params.id);

    if (error) {
      toast.error("Gagal memperbarui acara");
      return;
    }

    toast.success("Acara berhasil diperbarui");
    router.push("/acara");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh] text-sm">
        Memuat data acara...
      </div>
    );

  return (
    <div className="w-full mt-10">
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Edit Acara: {acara?.nama_acara}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-6">

            {/* GRID 2 KOLOM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Nama Acara */}
              <div className="flex flex-col space-y-2">
                <Label>Nama Acara</Label>
                <Input
                  value={form.nama_acara}
                  onChange={(e) =>
                    setForm({ ...form, nama_acara: e.target.value })
                  }
                  placeholder="Masukkan nama acara"
                />
              </div>

              {/* Lokasi */}
              <div className="flex flex-col space-y-2">
                <Label>Lokasi</Label>
                <Input
                  value={form.lokasi}
                  onChange={(e) =>
                    setForm({ ...form, lokasi: e.target.value })
                  }
                  placeholder="Masukkan lokasi acara"
                />
              </div>

              {/* Tanggal Mulai */}
              <div className="flex flex-col space-y-2">
                <Label>Tanggal Mulai</Label>
                <Input
                  type="date"
                  value={form.tanggal_mulai}
                  onChange={(e) =>
                    setForm({ ...form, tanggal_mulai: e.target.value })
                  }
                />
              </div>

              {/* Tanggal Selesai */}
              <div className="flex flex-col space-y-2">
                <Label>Tanggal Selesai</Label>
                <Input
                  type="date"
                  value={form.tanggal_selesai}
                  onChange={(e) =>
                    setForm({ ...form, tanggal_selesai: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Deskripsi Full Width */}
            <div className="flex flex-col space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={form.deskripsi}
                onChange={(e) =>
                  setForm({ ...form, deskripsi: e.target.value })
                }
                placeholder="Masukkan deskripsi acara"
                className="min-h-[120px]"
              />
            </div>

            <Button type="submit" className="w-full md:w-auto">
              Simpan Perubahan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
