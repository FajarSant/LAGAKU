"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import usePertandinganForm from "@/hooks/usePertandinganForm";
import AcaraSelect from "@/components/admin/AcaraSelect";
import JenisSelect from "@/components/admin/JenisSelect";
import TimSelect from "@/components/admin/TimeSelect";
import TimMultiSelect from "@/components/admin/TimMultiSelect";
import JadwalInput from "@/components/admin/JadwalInput";

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

export default function TambahPertandinganPage() {
  const router = useRouter();
  const { acaraList, timList, loadTim, submitPertandingan } = usePertandinganForm();

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

  // Hanya load tim setelah acaraId tersedia
  useEffect(() => {
    if (acaraId) loadTim(acaraId);
  }, [acaraId, loadTim]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Pertandingan / Generate</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((v) => submitPertandingan(v, router))} className="space-y-4">

            {/* Pilih Acara */}
            <AcaraSelect
              value={acaraId || ""}
              onChange={(v) => setValue("acara_id", v)}
              acaraList={acaraList || []}
            />

            {/* Pilih Jenis Pertandingan */}
            <JenisSelect
              value={jenis}
              onChange={(v) => setValue("jenis", v)}
            />

            {/* Fun Match: Pilih Tim A & B */}
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

            {/* Cup / Liga: Pilih Banyak Tim */}
            {(jenis === "cup" || jenis === "liga") && (
              <TimMultiSelect
                selected={watch("tim_ids") || []}
                onChange={(ids: string[]) => setValue("tim_ids", ids)}
                timList={timList || []}
              />
            )}

            {/* Input Jadwal & Lokasi */}
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

            {/* Aksi */}
            <div className="flex gap-2">
              <Button type="submit">Simpan / Generate</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
