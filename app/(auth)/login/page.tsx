"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { FcGoogle } from "react-icons/fc";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function ensureUserProfile(user: any) {
    // Cek apakah row pengguna sudah ada
    const { data: existingProfile } = await supabase
      .from("pengguna")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (existingProfile) return existingProfile;

    // Jika belum ada, buat row baru
    const { data: created, error: createError } = await supabase
      .from("pengguna")
      .insert({
        id: user.id,
        email: user.email,
        nama: user.user_metadata.full_name || "",
        penyedia: user.app_metadata.provider || "email",
        id_penyedia: user.id,
        is_verified: false,
      })
      .select()
      .single();

    if (createError) throw createError;
    return created;
  }

  async function onSubmit(values: LoginForm) {
    setLoading(true);

    try {
      // Login dengan email & password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw new Error("Email atau password salah.");

      if (!data?.user) throw new Error("Gagal mendapatkan data pengguna.");
      const user = data.user;

      // Pastikan row di tabel "pengguna" ada
      const profile = await ensureUserProfile(user);

      // Redirect sesuai status verifikasi
      if (!profile.is_verified) {
        router.push("/konfirmasi-identitas");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  }

  async function loginWithGoogle() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/callback`,
        },
      });

      if (error) throw error;

    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border rounded-2xl p-6">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Masuk</h1>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input placeholder="Email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          {/* Pembatas */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-2 text-sm text-gray-500">atau</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Login dengan Google */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-100"
            onClick={loginWithGoogle}
          >
            <FcGoogle className="text-xl" />
            <span className="text-gray-700 font-medium">
              Masuk dengan Google
            </span>
          </Button>

          <p className="text-center mt-4 text-sm">
            Belum punya akun?
            <Link
              href="/register"
              className="text-blue-600 ml-1 hover:underline"
            >
              Daftar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
