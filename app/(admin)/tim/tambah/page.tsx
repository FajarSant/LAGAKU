"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Schema form
const FormSchema = z.object({
  nama: z.string().min(1, "Nama tim wajib diisi"),
  jurusan: z.string().optional(),
  angkatan: z.string().optional(),
  nomor_hp: z.string().optional(),
  anggota: z.array(
    z.object({
      nama_pemain: z.string().min(1, "Nama pemain wajib diisi"),
      nim: z.string().optional(),
    })
  ),
});

type FormValues = z.infer<typeof FormSchema>;

export default function TambahTimPage() {
  const router = useRouter();
  const supabase = createClient();
  const [submitting, setSubmitting] = useState(false);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      anggota: [{ nama_pemain: "", nim: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "anggota",
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      // Tambah tim
      const { data: timData, error: timErr } = await supabase
        .from("tim")
        .insert({
          nama: values.nama,
          jurusan: values.jurusan || null,
          angkatan: values.angkatan || null,
          nomor_hp: values.nomor_hp || null,
        })
        .select()
        .single();

      if (timErr || !timData) throw timErr || new Error("Gagal membuat tim");

      const anggotaInserts = values.anggota.map((a) => ({
        tim_id: timData.id,
        nama_pemain: a.nama_pemain,
        nim: a.nim || null,
      }));

      const { error: anggotaErr } = await supabase
        .from("anggota_tim")
        .insert(anggotaInserts);

      if (anggotaErr) throw anggotaErr;

      toast.success("Tim dan anggota berhasil ditambahkan");
      reset();
      router.push("/admin/tim");
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Tim & Anggota</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Nama Tim</Label>
              <Input {...register("nama")} placeholder="Nama tim" />
              {errors.nama && <p className="text-red-500 text-sm">{errors.nama.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Jurusan</Label>
                <Input {...register("jurusan")} placeholder="Jurusan" />
              </div>
              <div>
                <Label>Angkatan</Label>
                <Input {...register("angkatan")} placeholder="Angkatan" />
              </div>
              <div>
                <Label>Nomor HP</Label>
                <Input {...register("nomor_hp")} placeholder="08xxxx" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Anggota Tim</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                  <div>
                    <Input
                      {...register(`anggota.${index}.nama_pemain` as const)}
                      placeholder="Nama pemain"
                    />
                    {errors.anggota?.[index]?.nama_pemain && (
                      <p className="text-red-500 text-sm">{errors.anggota[index]?.nama_pemain?.message}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      {...register(`anggota.${index}.nim` as const)}
                      placeholder="NIM (opsional)"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="destructive" onClick={() => remove(index)}>
                      Hapus
                    </Button>
                    {index === fields.length - 1 && (
                      <Button type="button" onClick={() => append({ nama_pemain: "", nim: "" })}>
                        Tambah
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
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
