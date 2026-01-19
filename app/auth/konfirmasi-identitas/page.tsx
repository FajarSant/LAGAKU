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
import { useTheme } from "next-themes";

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
  const { theme } = useTheme();
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl p-6 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Konfirmasi Identitas
          </h1>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">
            Lengkapi data identitas untuk mengakses sistem
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* NIM */}
            <div>
              <Input 
                placeholder="NIM" 
                {...form.register("nim")}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              />
              {form.formState.errors.nim && (
                <p className="text-red-500 dark:text-red-400 text-sm">
                  {form.formState.errors.nim.message}
                </p>
              )}
            </div>

            {/* Fakultas */}
            <div>
              <Input 
                placeholder="Fakultas" 
                {...form.register("fakultas")}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              />
              {form.formState.errors.fakultas && (
                <p className="text-red-500 dark:text-red-400 text-sm">
                  {form.formState.errors.fakultas.message}
                </p>
              )}
            </div>

            {/* Program Studi */}
            <div>
              <Input 
                placeholder="Program Studi" 
                {...form.register("program_studi")}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              />
              {form.formState.errors.program_studi && (
                <p className="text-red-500 dark:text-red-400 text-sm">
                  {form.formState.errors.program_studi.message}
                </p>
              )}
            </div>

            {/* Jenis Kelamin */}
            <div>
              <Select 
                {...form.register("jenis_kelamin")}
                defaultValue="L"
              >
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectItem 
                    value="L"
                    className="dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:bg-gray-600"
                  >
                    Laki-laki
                  </SelectItem>
                  <SelectItem 
                    value="P"
                    className="dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:bg-gray-600"
                  >
                    Perempuan
                  </SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.jenis_kelamin && (
                <p className="text-red-500 dark:text-red-400 text-sm">
                  {form.formState.errors.jenis_kelamin.message}
                </p>
              )}
            </div>

            {/* Tanggal Lahir */}
            <div>
              <Input 
                type="date" 
                {...form.register("tanggal_lahir")}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {form.formState.errors.tanggal_lahir && (
                <p className="text-red-500 dark:text-red-400 text-sm">
                  {form.formState.errors.tanggal_lahir.message}
                </p>
              )}
            </div>

            {/* Alamat */}
            <div>
              <Input 
                placeholder="Alamat" 
                {...form.register("alamat")}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              />
              {form.formState.errors.alamat && (
                <p className="text-red-500 dark:text-red-400 text-sm">
                  {form.formState.errors.alamat.message}
                </p>
              )}
            </div>

            {/* Nomor HP */}
            <div>
              <Input 
                placeholder="Nomor HP" 
                {...form.register("nomor_hp")}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              />
              {form.formState.errors.nomor_hp && (
                <p className="text-red-500 dark:text-red-400 text-sm">
                  {form.formState.errors.nomor_hp.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  Memproses...
                </div>
              ) : (
                "Simpan & Lanjutkan"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}