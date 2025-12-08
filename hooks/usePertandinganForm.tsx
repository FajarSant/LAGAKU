"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function usePertandinganForm() {
  const supabase = createClient();

  const [acaraList, setAcaraList] = useState<{ id: string; nama: string }[]>([]);
  const [timList, setTimList] = useState<{ id: string; nama: string }[]>([]);
  const [loadingTim, setLoadingTim] = useState(false);

  // Load semua acara saat hook di-mount
  useEffect(() => {
    const loadAcara = async () => {
      const { data, error } = await supabase.from("acara").select("id,nama").order("nama");
      if (error) toast.error("Gagal memuat acara");
      else setAcaraList(data || []);
    };
    loadAcara();
  }, [supabase]);

  // Load tim berdasarkan acaraId
const loadTim = useCallback(
  async (acaraId?: string) => {
    if (!acaraId) {
      setTimList([]);
      return;
    }
    setLoadingTim(true);
    const { data, error } = await supabase
      .from("tim")
      .select("id,nama")
      .order("nama");
    if (error) toast.error("Gagal memuat tim");
    else setTimList(data || []);
    setLoadingTim(false);
  },
  [supabase]
);

  // Submit pertandingan
  const submitPertandingan = async (values: any, router: any) => {
    try {
      if (!values.acara_id) throw new Error("Pilih acara.");

      if (values.jenis === "fun") {
        if (!values.tim_a_id || !values.tim_b_id) throw new Error("Pilih Tim A dan Tim B.");
        await supabase.from("pertandingan").insert({
          acara_id: values.acara_id,
          tim_a_id: values.tim_a_id,
          tim_b_id: values.tim_b_id,
          tanggal_pertandingan: values.tanggal_pertandingan || null,
          waktu_pertandingan: values.waktu_pertandingan || null,
          lokasi_lapangan: values.lokasi_lapangan || null,
          status: "dijadwalkan",
        });
        toast.success("Fun match berhasil dibuat.");
        router.push("/pertandingan");
        return;
      }

      const timIds = values.tim_ids || [];
      if (timIds.length < 2) throw new Error("Pilih minimal 2 tim.");

      // CUP: buat pasangan random
      if (values.jenis === "cup") {
        const shuffled = [...timIds].sort(() => Math.random() - 0.5);
        const pairs: [string, string | null][] = [];
        for (let i = 0; i < shuffled.length; i += 2) {
          pairs.push([shuffled[i], shuffled[i + 1] || null]);
        }
        await supabase.from("pertandingan").insert(
          pairs.map(([a, b]) => ({
            acara_id: values.acara_id,
            tim_a_id: a,
            tim_b_id: b,
            status: "dijadwalkan",
          }))
        );
      }

      // LIGA: semua kombinasi tim
      if (values.jenis === "liga") {
        const pairs: [string, string][] = [];
        for (let i = 0; i < timIds.length; i++)
          for (let j = i + 1; j < timIds.length; j++)
            pairs.push([timIds[i], timIds[j]]);
        await supabase.from("pertandingan").insert(
          pairs.map(([a, b]) => ({
            acara_id: values.acara_id,
            tim_a_id: a,
            tim_b_id: b,
            status: "dijadwalkan",
          }))
        );
      }

      toast.success(`${values.jenis.toUpperCase()} berhasil digenerate.`);
      router.push("/pertandingan");
    } catch (err: any) {
      toast.error(err.message || "Terjadi error.");
    }
  };

  return { acaraList, timList, loadingTim, loadTim, submitPertandingan };
}
