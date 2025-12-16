"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditAcaraPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
  });

  // ===========================
  // FETCH DATA
  // ===========================
  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase
        .from("acara")
        .select("nama, deskripsi")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        router.push("/acara");
        return;
      }

      setForm({
        nama: data.nama,
        deskripsi: data.deskripsi ?? "",
      });

      setLoading(false);
    };

    loadData();
  }, [params.id, router, supabase]);

  // ===========================
  // SUBMIT UPDATE
  // ===========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("acara")
      .update({
        nama: form.nama,
        deskripsi: form.deskripsi,
      })
      .eq("id", params.id);

    setSaving(false);

    if (!error) {
      router.push("/acara");
      router.refresh();
    }
  };

  // ===========================
  // SKELETON
  // ===========================
  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <Skeleton className="h-6 w-48 mx-auto" />
          </CardHeader>

          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // ===========================
  // PAGE
  // ===========================
  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-3xl shadow border">
        <CardHeader>
          <CardTitle className="text-xl text-center font-bold">
            Edit Turnamen Gugur
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NAMA */}
            <div className="space-y-2">
              <Label>Nama Turnamen</Label>
              <Input
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
                value={form.deskripsi}
                onChange={(e) =>
                  setForm({ ...form, deskripsi: e.target.value })
                }
                className="min-h-[120px]"
              />
            </div>

            {/* ACTION */}
            <div className="flex flex-col gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
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
