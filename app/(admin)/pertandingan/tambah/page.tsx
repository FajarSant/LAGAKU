"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Acara, FormState, Round, Tim } from "@/types/type";

// ======================================================
// ADMIN - TAMBAH / GENERATE PERTANDINGAN (SISTEM GUGUR)
// ======================================================
export default function TambahPertandinganPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [acaraList, setAcaraList] = useState<Acara[]>([]);
  const [roundList, setRoundList] = useState<Round[]>([]);
  const [timList, setTimList] = useState<Tim[]>([]);

  const [selectedTimIds, setSelectedTimIds] = useState<string[]>([]);
  const [autoRound, setAutoRound] = useState<Round | null>(null);

  const [form, setForm] = useState<FormState>({
    acara_id: "",
    tanggal_pertandingan: "",
    waktu_pertandingan: "",
  });

  // ================= LOAD ACARA =================
  useEffect(() => {
    const loadAcara = async () => {
      const { data, error } = await supabase
        .from("acara")
        .select("id, nama")
        .order("nama");

      if (!error && data) {
        setAcaraList(data);
      }
      setLoading(false);
    };

    loadAcara();
  }, [supabase]);

  // ================= LOAD ROUND & TIM =================
  const loadAcaraData = async (acaraId: string) => {
    setForm((f) => ({ ...f, acara_id: acaraId }));

    const [roundRes, timRes] = await Promise.all([
      supabase
        .from("round")
        .select("id, nama, urutan, min_tim, max_tim")
        .eq("acara_id", acaraId)
        .order("urutan"),
      supabase
        .from("tim")
        .select("id, nama")
        .eq("acara_id", acaraId)
        .eq("status", "aktif")
        .order("nama"),
    ]);

    setRoundList(roundRes.data ?? []);
    setTimList(timRes.data ?? []);
    setSelectedTimIds([]);
    setAutoRound(null);
  };

  // ================= AUTO ROUND =================
  useEffect(() => {
    if (!roundList.length || selectedTimIds.length < 2) {
      setAutoRound(null);
      return;
    }

    const totalTim = selectedTimIds.length;

    const matchedRound = roundList
      .filter((r) => r.min_tim !== null && r.max_tim !== null)
      .find((r) => totalTim >= r.min_tim && totalTim <= r.max_tim);

    setAutoRound(matchedRound ?? null);
  }, [selectedTimIds, roundList]);

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!autoRound) return;

    setSaving(true);

    const shuffled = [...selectedTimIds].sort(() => Math.random() - 0.5);

    const inserts = shuffled.reduce<Record<string, unknown>[]>(
      (acc, timId, index) => {
        if (index % 2 !== 0) return acc;

        const timA = timId;
        const timB = shuffled[index + 1] ?? null;

        if (!timB) {
          // BYE
          acc.push({
            acara_id: form.acara_id,
            round_id: autoRound.id,
            tim_a_id: timA,
            tim_b_id: null,
            status: "selesai",
            skor_tim_a: 1,
            skor_tim_b: 0,
            pemenang_id: timA,
          });
        } else {
          acc.push({
            acara_id: form.acara_id,
            round_id: autoRound.id,
            tim_a_id: timA,
            tim_b_id: timB,
            status: "dijadwalkan",
            tanggal_pertandingan: form.tanggal_pertandingan || null,
            waktu_pertandingan: form.waktu_pertandingan || null,
          });
        }

        return acc;
      },
      []
    );

    await supabase.from("pertandingan").insert(inserts);

    setSaving(false);
    router.push("/admin/pertandingan");
    router.refresh();
  };

  // ================= UI =================
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Generate Pertandingan (Sistem Gugur)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-40" />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ACARA */}
              <div className="space-y-2">
                <Label>Acara</Label>
                <select
                  className="w-full border rounded-md p-2"
                  value={form.acara_id}
                  onChange={(e) => loadAcaraData(e.target.value)}
                >
                  <option value="">Pilih acara</option>
                  {acaraList.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* TIM */}
              <div className="space-y-2">
                <Label>Pilih Tim</Label>
                <div className="border rounded-md p-3 max-h-64 overflow-y-auto space-y-2">
                  {timList.map((t) => (
                    <label key={t.id} className="flex gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedTimIds.includes(t.id)}
                        onChange={(e) =>
                          setSelectedTimIds((prev) =>
                            e.target.checked
                              ? [...prev, t.id]
                              : prev.filter((id) => id !== t.id)
                          )
                        }
                      />
                      {t.nama}
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total tim dipilih: {selectedTimIds.length}
                </p>
              </div>

              {/* AUTO ROUND */}
              <div className="space-y-2">
                <Label>Babak (Otomatis)</Label>
                <Input
                  disabled
                  value={
                    autoRound
                      ? `${autoRound.nama} (${selectedTimIds.length} tim)`
                      : `Tidak ada babak untuk ${selectedTimIds.length} tim`
                  }
                />
              </div>

              {/* TANGGAL & WAKTU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tanggal</Label>
                  <Input
                    type="date"
                    value={form.tanggal_pertandingan}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        tanggal_pertandingan: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Waktu</Label>
                  <Input
                    type="time"
                    value={form.waktu_pertandingan}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        waktu_pertandingan: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* ACTION */}
              <Button
                type="submit"
                disabled={!autoRound || saving}
                className="w-full"
              >
                {saving ? "Mengenerate..." : "Generate Pertandingan"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
