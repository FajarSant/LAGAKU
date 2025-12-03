"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function useAdminUser() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar_url?: string;
  } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.push("/login");
        return;
      }

      const metadata = data.user.user_metadata;

      let avatarUrl = metadata?.avatar_url;

      // Jika avatar_url ternyata path file supabase storage
      if (avatarUrl && !avatarUrl.startsWith("http")) {
        const { data: imageUrl } = supabase.storage
          .from("avatars")
          .getPublicUrl(avatarUrl);

        avatarUrl = imageUrl.publicUrl;
      }

      setUser({
        name: metadata?.full_name || "Admin",
        email: data.user.email ?? "",
        avatar_url: avatarUrl,
      });
    };

    loadUser();
  }, [router, supabase]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return { user, logout };
}
