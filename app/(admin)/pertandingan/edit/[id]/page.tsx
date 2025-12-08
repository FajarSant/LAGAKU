"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import usePertandinganForm from "@/hooks/usePertandinganForm";
import AcaraSelect from "@/components/admin/AcaraSelect";
import JenisSelect from "@/components/admin/JenisSelect";
import TimSelect from "@/components/admin/TimSelect";
import TimMultiSelect from "@/components/admin/TimMultiSelect";
import JadwalInput from "@/components/admin/JadwalInput";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const FormSchema = z.object({
  acara_id: z.string().min(1, "Acara harus dipilih"),
  jenis: z.enum(["fun", "cup", "liga"]),
  tim_a_id: z.string().optional(),
  tim_b_id: z.string().optional(),
  tim_ids: z.array(z.string()).optional(),
  tanggal_pertandingan: z.string().optional(),
  waktu_pertandingan: z.string().optional(),
  lokasi_lapangan: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function EditPertandinganPage() {
  const router = useRouter();
  const params = useParams(); // pastikan route: /pertandingan/edit/[id]
  const pertandinganId = params.id;
  const supabase = createClient();

  const { acaraList, timList, loadTim, submitPertandingan } = usePertandinganForm();
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      jenis: "fun",
      tim_ids: [],
      acara_id: "",
      tim_a_id: "",
      tim_b_id: "",
      tanggal_pertandingan: "",
      waktu_pertandingan: "",
      lokasi_lapangan: "",
    },
  });

  const jenis = watch("jenis");
  const acaraId = watch("acara_id");

  // Load pertandingan data
  useEffect(() => {
    const loadPertandingan = async () => {
      const { data, error } = await supabase
        .from("pertandingan")
        .select(`
          id,
          acara_id,
          tim_a_id,
          tim_b_id,
          status,
          tanggal_pertandingan,
          waktu_pertandingan,
          lokasi_lapangan
        `)
        .eq("id", pertandinganId)
        .single();

      if (error || !data) {
        toast.error("Gagal memuat data pertandingan.");
        router.back();
        return;
      }

      setValue("acara_id", data.acara_id);
      setValue("tim_a_id", data.tim_a_id || "");
      setValue("tim_b_id", data.tim_b_id || "");
      setValue("tim_ids", data.tim_a_id && data.tim_b_id ? [data.tim_a_id, data.tim_b_id] : []);
      setValue("tanggal_pertandingan", data.tanggal_pertandingan || "");
      setValue("waktu_pertandingan", data.waktu_pertandingan || "");
      setValue("lokasi_lapangan", data.lokasi_lapangan || "");

      // Load tim terkait acara
      if (data.acara_id) await loadTim(data.acara_id);
      setLoading(false);
    };

    if (pertandinganId) loadPertandingan();
  }, [pertandinganId, loadTim, router, setValue, supabase]);

  // Reload tim saat acaraId berubah
  useEffect(() => {
    if (acaraId) loadTim(acaraId);
  }, [acaraId, loadTim]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (values.jenis === "fun") {
        if (!values.tim_a_id || !values.tim_b_id) throw new Error("Pilih Tim A dan Tim B.");
      }

      await supabase
        .from("pertandingan")
        .update({
          acara_id: values.acara_id,
          tim_a_id: values.tim_a_id || null,
          tim_b_id: values.tim_b_id || null,
          tanggal_pertandingan: values.tanggal_pertandingan || null,
          waktu_pertandingan: values.waktu_pertandingan || null,
          lokasi_lapangan: values.lokasi_lapangan || null,
        })
        .eq("id", pertandinganId);

      toast.success("Pertandingan berhasil diperbarui.");
      router.push("/pertandingan");
    } catch (err: any) {
      toast.error(err.message || "Terjadi error.");
      console.error(err);
    }
  };

  if (loading) return <div className="p-6 text-center">Memuat data...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Pertandingan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <AcaraSelect
              value={acaraId || ""}
              onChange={(v) => setValue("acara_id", v)}
              acaraList={acaraList || []}
            />

            <JenisSelect
              value={jenis}
              onChange={(v) => setValue("jenis", v)}
            />

            {jenis === "fun" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TimSelect
                  label="Tim A"
                  value={watch("tim_a_id") || ""}
                  onChange={(v) => setValue("tim_a_id", v)}
                  timList={timList || []}
                />
                <TimSelect
                  label="Tim B"
                  value={watch("tim_b_id") || ""}
                  onChange={(v) => setValue("tim_b_id", v)}
                  timList={timList || []}
                />
              </div>
            )}

            {(jenis === "cup" || jenis === "liga") && (
              <TimMultiSelect
                selected={watch("tim_ids") || []}
                onChange={(ids: string[]) => setValue("tim_ids", ids)}
                timList={timList || []}
              />
            )}

            <JadwalInput
              tanggal={watch("tanggal_pertandingan") || ""}
              waktu={watch("waktu_pertandingan") || ""}
              lokasi={watch("lokasi_lapangan") || ""}
              onChange={(d: { tanggal?: string; waktu?: string; lokasi?: string }) => {
                setValue("tanggal_pertandingan", d.tanggal || "");
                setValue("waktu_pertandingan", d.waktu || "");
                setValue("lokasi_lapangan", d.lokasi || "");
              }}
            />

            <div className="flex gap-2">
              <Button type="submit">Simpan Perubahan</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
