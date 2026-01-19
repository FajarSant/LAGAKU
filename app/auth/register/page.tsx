"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const registerSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nama: "", email: "", password: "" },
  });

  /**
   * REGISTER WITH EMAIL & PASSWORD
   */
  async function onSubmit(values: RegisterForm) {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.nama,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Registrasi berhasil! Silakan cek email untuk verifikasi.");

      setTimeout(() => router.push("/verify"), 1000);
    } catch (err: any) {
      toast.error(err?.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-lg border rounded-2xl p-6 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Daftar Akun
          </h1>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input 
                placeholder="Nama lengkap" 
                {...form.register("nama")}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              />
              {form.formState.errors.nama && (
                <p className="text-red-500 dark:text-red-400 text-sm">
                  {form.formState.errors.nama.message}
                </p>
              )}
            </div>

            <div>
              <Input 
                placeholder="Email" 
                {...form.register("email")}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 dark:text-red-400 text-sm">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                {...form.register("password")}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              />
              {form.formState.errors.password && (
                <p className="text-red-500 dark:text-red-400 text-sm">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  Membuat akun...
                </div>
              ) : (
                "Daftar"
              )}
            </Button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
            Sudah punya akun?
            <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 ml-1 hover:underline">
              Masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}