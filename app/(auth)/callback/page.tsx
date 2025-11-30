"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Pengguna {
  id: string;
  email: string;
  nama: string;
  penyedia: string;
  id_penyedia: string;
  is_verified: boolean;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  async function ensureUserProfile(user: User): Promise<Pengguna> {
    const { data: existing } = await supabase
      .from("pengguna")
      .select("*")
      .eq("id", user.id)
      .maybeSingle<Pengguna>();

    if (existing) return existing;

    const { data, error } = await supabase
      .from("pengguna")
      .insert({
        id: user.id,
        email: user.email ?? "",
        nama: user.user_metadata.full_name || "",
        penyedia: user.app_metadata.provider || "google",
        id_penyedia: user.id,
        is_verified: false,
      })
      .select()
      .single<Pengguna>();

    if (error) throw error;
    return data;
  }

  useEffect(() => {
    const processGoogleLogin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const profile = await ensureUserProfile(user);

      if (!profile.is_verified) {
        router.replace("/konfirmasi-identitas");
      } else {
        router.replace("/");
      }
    };

    processGoogleLogin();
  }, [router, supabase]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-6 animate-fade-in">
      {/* SPINNER */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* TEXT */}
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700">
          Memproses login...
        </p>
        <p className="text-sm text-gray-500 mt-1 animate-pulse">
          Mohon tunggu sebentar, kami sedang menghubungkan akun Anda.
        </p>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-48 h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <div className="h-full bg-primary animate-progress"></div>
      </div>
    </div>
  );
}
