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
    const { data: existingProfile } = await supabase
      .from("pengguna")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (existingProfile) return existingProfile;

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw new Error("Email atau password salah.");

      if (!data?.user) throw new Error("Gagal mendapatkan data pengguna.");
      const user = data.user;

      const profile = await ensureUserProfile(user);

      if (!profile.is_verified) {
        router.push("/auth/konfirmasi-identitas");
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
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,

        },
      });

      if (error) throw error;
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-lg border rounded-2xl p-6 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Masuk
          </h1>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          {/* Pembatas */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
            <span className="px-2 text-sm text-gray-500 dark:text-gray-400">
              atau
            </span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
          </div>

          {/* Login dengan Google */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-3 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={loginWithGoogle}
          >
            <FcGoogle className="text-xl" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Masuk dengan Google
            </span>
          </Button>

          <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
            Belum punya akun?
            <Link
              href="/auth/register"
              className="text-blue-600 dark:text-blue-400 ml-1 hover:underline"
            >
              Daftar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}