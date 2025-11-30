"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Schema validasi form
const konfirmasiSchema = z.object({
  nim: z.string().min(3, "NIM minimal 3 karakter"),
  fakultas: z.string().min(2, "Fakultas minimal 2 karakter"),
  program_studi: z.string().min(2, "Program studi minimal 2 karakter"),
  jenis_kelamin: z.enum(["L", "P"], "Pilih jenis kelamin"),
  tanggal_lahir: z.string().min(10, "Tanggal lahir wajib diisi"),
  alamat: z.string().min(5, "Alamat minimal 5 karakter"),
  nomor_hp: z.string().min(6, "Nomor HP minimal 6 digit"),
});

type KonfirmasiForm = z.infer<typeof konfirmasiSchema>;

export default function KonfirmasiIdentitasPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const form = useForm<KonfirmasiForm>({
    resolver: zodResolver(konfirmasiSchema),
    defaultValues: {
      nim: "",
      fakultas: "",
      program_studi: "",
      jenis_kelamin: "L",
      tanggal_lahir: "",
      alamat: "",
      nomor_hp: "",
    },
  });

  // Ambil user saat ini
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setUserId(user.id);

      // Bisa juga load data lama jika ingin prefill
      const { data: pengguna } = await supabase
        .from("pengguna")
        .select("*")
        .eq("id", user.id)
        .single();

      if (pengguna) {
        form.reset({
          nim: pengguna.nim || "",
          fakultas: pengguna.fakultas || "",
          program_studi: pengguna.program_studi || "",
          jenis_kelamin: pengguna.jenis_kelamin || "L",
          tanggal_lahir: pengguna.tanggal_lahir?.toString().split("T")[0] || "",
          alamat: pengguna.alamat || "",
          nomor_hp: pengguna.nomor_hp || "",
        });
      }
    };
    getUser();
  }, [supabase, router]);

  const onSubmit = async (values: KonfirmasiForm) => {
    if (!userId) return;
    setLoading(true);

    const { error } = await supabase
      .from("pengguna")
      .update({
        nim: values.nim,
        fakultas: values.fakultas,
        program_studi: values.program_studi,
        jenis_kelamin: values.jenis_kelamin,
        tanggal_lahir: values.tanggal_lahir,
        alamat: values.alamat,
        nomor_hp: values.nomor_hp,
        is_verified: true,
      })
      .eq("id", userId);

    setLoading(false);

    if (error) return alert(error.message);

    router.replace("/"); // redirect setelah submit
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl p-6">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Konfirmasi Identitas</h1>
          <p className="text-center text-sm text-gray-500 mt-1">
            Lengkapi data identitas untuk mengakses sistem
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input placeholder="NIM" {...form.register("nim")} />
              {form.formState.errors.nim && (
                <p className="text-red-500 text-sm">{form.formState.errors.nim.message}</p>
              )}
            </div>

            <div>
              <Input placeholder="Fakultas" {...form.register("fakultas")} />
              {form.formState.errors.fakultas && (
                <p className="text-red-500 text-sm">{form.formState.errors.fakultas.message}</p>
              )}
            </div>

            <div>
              <Input placeholder="Program Studi" {...form.register("program_studi")} />
              {form.formState.errors.program_studi && (
                <p className="text-red-500 text-sm">{form.formState.errors.program_studi.message}</p>
              )}
            </div>

            <div>
              <Select {...form.register("jenis_kelamin")}>
                <SelectTrigger>
                  <SelectValue placeholder="Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Laki-laki</SelectItem>
                  <SelectItem value="P">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.jenis_kelamin && (
                <p className="text-red-500 text-sm">{form.formState.errors.jenis_kelamin.message}</p>
              )}
            </div>

            <div>
              <Input type="date" {...form.register("tanggal_lahir")} />
              {form.formState.errors.tanggal_lahir && (
                <p className="text-red-500 text-sm">{form.formState.errors.tanggal_lahir.message}</p>
              )}
            </div>

            <div>
              <Input placeholder="Alamat" {...form.register("alamat")} />
              {form.formState.errors.alamat && (
                <p className="text-red-500 text-sm">{form.formState.errors.alamat.message}</p>
              )}
            </div>

            <div>
              <Input placeholder="Nomor HP" {...form.register("nomor_hp")} />
              {form.formState.errors.nomor_hp && (
                <p className="text-red-500 text-sm">{form.formState.errors.nomor_hp.message}</p>
              )}
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Simpan & Lanjutkan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
