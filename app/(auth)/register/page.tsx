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
import { FcGoogle } from "react-icons/fc";

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: RegisterForm) {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: { data: { name: values.name } },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Registrasi berhasil! Cek email Anda untuk verifikasi.");

      setTimeout(() => {
        router.push("/auth/verify"); // Ubah sesuai kebutuhan
      }, 1000);
    } finally {
      setLoading(false);
    }
  }

  async function googleRegister() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });

    if (error) toast.error(error.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border rounded-2xl p-6">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Daftar Akun</h1>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input placeholder="Nama lengkap" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

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

            <Button className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  Memproses...
                </div>
              ) : (
                "Daftar"
              )}
            </Button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-2 text-sm text-gray-500">atau</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-100"
            onClick={googleRegister}
          >
            <FcGoogle className="text-xl" />
            <span className="text-gray-700 font-medium">
              Daftar dengan Google
            </span>
          </Button>

          <p className="text-center mt-4 text-sm">
            Sudah punya akun?
            <Link href="/login" className="text-blue-600 ml-1 hover:underline">
              Masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
