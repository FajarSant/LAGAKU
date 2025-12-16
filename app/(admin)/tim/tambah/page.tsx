"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

// ======================================================
// ZOD SCHEMA (SESUAI TABLE)
// ======================================================
const FormSchema = z.object({
  nama: z.string().min(1, "Nama tim wajib diisi"),
  jurusan: z.string().optional(),
  angkatan: z.string().optional(),
  nomor_hp: z.string().optional(),
  acara_id: z.string().min(1, "Acara wajib dipilih"),
  anggota: z
    .array(
      z.object({
        nama_pemain: z.string().min(1, "Nama pemain wajib diisi"),
        nim: z.string().optional(),
      })
    )
    .min(1, "Minimal 1 pemain"),
});

type FormValues = z.infer<typeof FormSchema>;

export default function TambahTimPage() {
  const router = useRouter();
  const supabase = createClient();

  const [submitting, setSubmitting] = useState(false);
  const [loadingAcara, setLoadingAcara] = useState(true);
  const [acaraList, setAcaraList] = useState<{ id: string; nama: string }[]>([]);

  // ======================================================
  // FORM INIT
  // ======================================================
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      anggota: [{ nama_pemain: "", nim: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "anggota",
  });

  // ======================================================
  // LOAD ACARA
  // ======================================================
  useEffect(() => {
    const loadAcara = async () => {
      const { data } = await supabase
        .from("acara")
        .select("id, nama")
        .order("nama");

      setAcaraList(data ?? []);
      setLoadingAcara(false);
    };

    loadAcara();
  }, [supabase]);

  // ======================================================
  // SUBMIT
  // ======================================================
  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);

    try {
      // 1. Insert TIM
      const { data: tim, error: timErr } = await supabase
        .from("tim")
        .insert({
          nama: values.nama,
          jurusan: values.jurusan || null,
          angkatan: values.angkatan || null,
          nomor_hp: values.nomor_hp || null,
          acara_id: values.acara_id,
          jumlah_pemain: values.anggota.length,
        })
        .select("id")
        .single();

      if (timErr || !tim) throw timErr;

      // 2. Insert ANGGOTA TIM
      const anggotaPayload = values.anggota.map((a) => ({
        tim_id: tim.id,
        nama_pemain: a.nama_pemain,
        nim: a.nim || null,
      }));

      const { error: anggotaErr } = await supabase
        .from("anggota_tim")
        .insert(anggotaPayload);

      if (anggotaErr) throw anggotaErr;

      reset();
      router.push(`/admin/acara/${values.acara_id}/tim`);
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Tambah Tim & Anggota
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* NAMA TIM */}
            <div>
              <Label>Nama Tim</Label>
              <Input {...register("nama")} />
              {errors.nama && (
                <p className="text-sm text-red-500">{errors.nama.message}</p>
              )}
            </div>

            {/* ACARA */}
            <div>
              <Label>Acara</Label>
              {loadingAcara ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <select
                  {...register("acara_id")}
                  className="w-full h-10 border rounded px-2"
                >
                  <option value="">-- Pilih Acara --</option>
                  {acaraList.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nama}
                    </option>
                  ))}
                </select>
              )}
              {errors.acara_id && (
                <p className="text-sm text-red-500">
                  {errors.acara_id.message}
                </p>
              )}
            </div>

            {/* INFO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input {...register("jurusan")} placeholder="Jurusan" />
              <Input {...register("angkatan")} placeholder="Angkatan" />
              <Input {...register("nomor_hp")} placeholder="Nomor HP" />
            </div>

            {/* ANGGOTA */}
            <div className="space-y-3">
              <Label>Anggota Tim</Label>

              {fields.map((field, index) => (
                <div key={field.id} className="grid md:grid-cols-3 gap-3">
                  <Input
                    {...register(`anggota.${index}.nama_pemain`)}
                    placeholder="Nama pemain"
                  />
                  <Input
                    {...register(`anggota.${index}.nim`)}
                    placeholder="NIM (opsional)"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                    >
                      Hapus
                    </Button>
                    {index === fields.length - 1 && (
                      <Button
                        type="button"
                        onClick={() =>
                          append({ nama_pemain: "", nim: "" })
                        }
                      >
                        Tambah
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ACTION */}
            <div className="flex gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
