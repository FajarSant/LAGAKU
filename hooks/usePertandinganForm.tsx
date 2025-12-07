"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function usePertandinganForm() {
  const supabase = createClient();

  const [acaraList, setAcaraList] = useState<{ id: string; nama: string }[]>([]);
  const [timList, setTimList] = useState<{ id: string; nama: string }[]>([]);
  const [loadingTim, setLoadingTim] = useState(false);

  useEffect(() => {
    const loadAcara = async () => {
      const { data } = await supabase.from("acara").select("id,nama").order("nama");
      if (data) setAcaraList(data);
    };
    loadAcara();
  }, []);

  const loadTim = async (acaraId: string | undefined) => {
    if (!acaraId) {
      setTimList([]);
      return;
    }
    setLoadingTim(true);
    const { data } = await supabase
      .from("tim")
      .select("id,nama")
      .eq("acara_id", acaraId)
      .order("nama");
    if (data) setTimList(data);
    setLoadingTim(false);
  };

  const shuffle = <T,>(arr: T[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const generateCup = async (acaraId: string, timIds: string[]) => {
    const shuffled = shuffle(timIds);
    const pairs: [string, string | null][] = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      pairs.push([shuffled[i], shuffled[i + 1] || null]);
    }

    await supabase.from("pertandingan").insert(
      pairs.map(([a, b]) => ({ acara_id: acaraId, tim_a_id: a, tim_b_id: b, status: "dijadwalkan" }))
    );

    await supabase.from("bracket").insert(
      pairs.map(([a, b]) => ({ acara_id: acaraId, ronde: 1, tim_1_id: a, tim_2_id: b }))
    );
  };

  const generateLiga = async (acaraId: string, timIds: string[]) => {
    const pairs: [string, string][] = [];
    for (let i = 0; i < timIds.length; i++) {
      for (let j = i + 1; j < timIds.length; j++) pairs.push([timIds[i], timIds[j]]);
    }

    await supabase.from("pertandingan").insert(
      pairs.map(([a, b]) => ({ acara_id: acaraId, tim_a_id: a, tim_b_id: b, status: "dijadwalkan" }))
    );
  };

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

      // CUP / LIGA
      const timIds = values.tim_ids || [];
      if (timIds.length < 2) throw new Error("Pilih minimal 2 tim.");

      if (values.jenis === "cup") await generateCup(values.acara_id, timIds);
      else if (values.jenis === "liga") await generateLiga(values.acara_id, timIds);

      toast.success(`${values.jenis.toUpperCase()} berhasil digenerate.`);
      router.push("/pertandingan");
    } catch (err: any) {
      toast.error(err.message || "Terjadi error.");
      console.error(err);
    }
  };

  return { acaraList, timList, loadingTim, loadTim, submitPertandingan };
}
