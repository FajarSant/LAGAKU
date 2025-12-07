"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button
} from "@/components/ui/button";
import {
  Input
} from "@/components/ui/input";
import {
  Label
} from "@/components/ui/label";
import { toast } from "sonner";

const AnggotaSchema = z.object({
  nama_pemain: z.string().min(1, "Nama pemain harus diisi"),
  nim: z.string().optional(),
});

const FormSchema = z.object({
  nama: z.string().min(1, "Nama tim harus diisi"),
  jurusan: z.string().optional(),
  angkatan: z.string().optional(),
  nomor_hp: z.string().optional(),
  anggota: z.array(AnggotaSchema).optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function EditTimPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      anggota: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "anggota",
  });

  // Load tim + anggota
  const loadTim = async () => {
    if (!params.id) return;
    setLoading(true);

    const { data: timData, error: timError } = await supabase
      .from("tim")
      .select("*")
      .eq("id", params.id)
      .single();

    if (timError) {
      toast.error(timError.message);
      setLoading(false);
      return;
    }

    const { data: anggotaData, error: anggotaError } = await supabase
      .from("anggota_tim")
      .select("*")
      .eq("tim_id", params.id);

    if (anggotaError) toast.error(anggotaError.message);

    reset({
      nama: timData.nama,
      jurusan: timData.jurusan,
      angkatan: timData.angkatan,
      nomor_hp: timData.nomor_hp,
      anggota: anggotaData || [],
    });

    setLoading(false);
  };

  useEffect(() => {
    loadTim();
  }, [params.id]);

  const onSubmit = async (values: FormValues) => {
    if (!params.id) return;
    setLoading(true);

    // Update tim
    const { error: timError } = await supabase
      .from("tim")
      .update({
        nama: values.nama,
        jurusan: values.jurusan,
        angkatan: values.angkatan,
        nomor_hp: values.nomor_hp,
      })
      .eq("id", params.id);

    if (timError) {
      toast.error(timError.message);
      setLoading(false);
      return;
    }

    // Hapus semua anggota lama
    const { error: delError } = await supabase
      .from("anggota_tim")
      .delete()
      .eq("tim_id", params.id);

    if (delError) {
      toast.error(delError.message);
      setLoading(false);
      return;
    }

    // Tambahkan anggota baru
    if (values.anggota && values.anggota.length > 0) {
      const { error: insError } = await supabase
        .from("anggota_tim")
        .insert(values.anggota.map(a => ({ ...a, tim_id: params.id })));

      if (insError) {
        toast.error(insError.message);
        setLoading(false);
        return;
      }
    }

    toast.success("Tim berhasil diperbarui");
    router.push("/tim");
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Tim</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Info Tim */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>Nama Tim</Label>
            <Input type="text" {...register("nama")} />
            {errors.nama && <p className="text-red-500 text-sm">{errors.nama.message}</p>}
          </div>

          <div>
            <Label>Jurusan</Label>
            <Input type="text" {...register("jurusan")} />
          </div>

          <div>
            <Label>Angkatan</Label>
            <Input type="text" {...register("angkatan")} />
          </div>

          <div>
            <Label>Nomor HP</Label>
            <Input type="text" {...register("nomor_hp")} />
          </div>
        </div>

        {/* Anggota Tim */}
        <div className="space-y-2">
          <h2 className="font-medium text-lg">Anggota Tim</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-3 gap-4 items-end">
              <div>
                <Label>Nama Pemain</Label>
                <Input
                  type="text"
                  {...register(`anggota.${index}.nama_pemain` as const)}
                />
              </div>
              <div>
                <Label>NIM</Label>
                <Input type="text" {...register(`anggota.${index}.nim` as const)} />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  Hapus
                </Button>
              </div>
            </div>
          ))}

          <Button type="button" onClick={() => append({ nama_pemain: "", nim: "" })}>
            Tambah Anggota
          </Button>
        </div>

        <div className="flex gap-2 mt-4">
          <Button type="submit" disabled={loading}>Simpan</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/tim")}>Batal</Button>
        </div>
      </form>
    </div>
  );
}
