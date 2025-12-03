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
  avatar_url?: string;
  is_verified: boolean;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  /**
   * Ensure user has a profile in the "pengguna" table.
   */
  const ensureUserProfile = async (user: User): Promise<Pengguna> => {
    // 1. Check if user already exists
    const { data: existing, error: existingError } = await supabase
      .from("pengguna")
      .select("*")
      .eq("id", user.id)
      .maybeSingle<Pengguna>();

    if (existingError) console.error("Error fetching user profile:", existingError);

    if (existing) return existing;

    // 2. Insert new user if not exists
    const { data, error } = await supabase
      .from("pengguna")
      .insert({
        id: user.id,
        email: user.email || "",
        nama: user.user_metadata.full_name || "",
        avatar_url: user.user_metadata.avatar_url || null,
        penyedia: user.app_metadata.provider || "google",
        id_penyedia: user.id,
        is_verified: false,
      })
      .select()
      .single<Pengguna>();

    if (error) throw error;
    return data;
  };

  /**
   * Process Google OAuth Login
   */
  useEffect(() => {
    const processGoogleLogin = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Auth error:", error);
          return router.replace("/login");
        }

        if (!user) {
          return router.replace("/login");
        }

        const profile = await ensureUserProfile(user);

        // Routing berdasarkan kondisi verifikasi pengguna
        if (!profile.is_verified) {
          router.replace("/konfirmasi-identitas");
        } else {
          router.replace("/");
        }
      } catch (err) {
        console.error("Login callback error:", err);
        router.replace("/login");
      }
    };

    processGoogleLogin();
  }, [router]);

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
        <p className="text-lg font-semibold text-gray-700">Memproses login...</p>
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
