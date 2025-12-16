"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
// ZOD SCHEMA
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
        id: z.string().optional(),
        nama_pemain: z.string().min(1, "Nama pemain wajib diisi"),
        nim: z.string().optional(),
      })
    )
    .min(1, "Minimal 1 pemain"),
});

type FormValues = z.infer<typeof FormSchema>;

export default function EditTimPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const timId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [loadingAcara, setLoadingAcara] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [acaraList, setAcaraList] = useState<{ id: string; nama: string }[]>([]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { anggota: [] },
  });

  const { fields, append, remove, replace } = useFieldArray({
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

      if (data) setAcaraList(data);
      setLoadingAcara(false);
    };

    loadAcara();
  }, []);

  // ======================================================
  // LOAD TIM
  // ======================================================
  useEffect(() => {
    const loadTim = async () => {
      const { data, error } = await supabase
        .from("tim")
        .select(
          `
          id, nama, jurusan, angkatan, nomor_hp, acara_id,
          anggota_tim ( id, nama_pemain, nim )
        `
        )
        .eq("id", timId)
        .single();

      if (error || !data) {
        router.push("/admin/tim");
        return;
      }

      reset({
        nama: data.nama,
        jurusan: data.jurusan ?? "",
        angkatan: data.angkatan ?? "",
        nomor_hp: data.nomor_hp ?? "",
        acara_id: data.acara_id,
        anggota: data.anggota_tim.map((a: any) => ({
          id: a.id,
          nama_pemain: a.nama_pemain,
          nim: a.nim ?? "",
        })),
      });

      replace(
        data.anggota_tim.map((a: any) => ({
          id: a.id,
          nama_pemain: a.nama_pemain,
          nim: a.nim ?? "",
        }))
      );

      setLoading(false);
    };

    loadTim();
  }, [timId, replace, reset, router, supabase]);

  // ======================================================
  // SUBMIT
  // ======================================================
  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);

    try {
      // Update tim
      await supabase
        .from("tim")
        .update({
          nama: values.nama,
          jurusan: values.jurusan || null,
          angkatan: values.angkatan || null,
          nomor_hp: values.nomor_hp || null,
          acara_id: values.acara_id,
        })
        .eq("id", timId);

      // Ambil ID anggota yang masih ada
      const keepIds = values.anggota.map((a) => a.id).filter(Boolean);

      // Hapus anggota yang dihapus di UI
      await supabase
        .from("anggota_tim")
        .delete()
        .eq("tim_id", timId)
        .not("id", "in", `(${keepIds.join(",")})`);

      // Upsert anggota
      await supabase.from("anggota_tim").upsert(
        values.anggota.map((a) => ({
          id: a.id,
          tim_id: timId,
          nama_pemain: a.nama_pemain,
          nim: a.nim || null,
        })),
        { onConflict: "id" }
      );

      router.push("/admin/tim");
      router.refresh();
    } catch (err) {
      console.error(err);
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
            Edit Tim & Anggota
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label>Nama Tim</Label>
                <Input {...register("nama")} />
                {errors.nama && (
                  <p className="text-sm text-red-500">
                    {errors.nama.message}
                  </p>
                )}
              </div>

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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Jurusan</Label>
                  <Input {...register("jurusan")} />
                </div>
                <div>
                  <Label>Angkatan</Label>
                  <Input {...register("angkatan")} />
                </div>
                <div>
                  <Label>Nomor HP</Label>
                  <Input {...register("nomor_hp")} />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Anggota Tim</Label>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-3 gap-3"
                  >
                    <Input
                      {...register(`anggota.${index}.nama_pemain`)}
                      placeholder="Nama pemain"
                    />
                    <Input
                      {...register(`anggota.${index}.nim`)}
                      placeholder="NIM"
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

              <div className="flex gap-3">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Menyimpan..." : "Simpan"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Batal
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
