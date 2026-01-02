"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  peran?: string;
  nim?: string;
  fakultas?: string;
  program_studi?: string;
  is_verified?: boolean;
}

export function useAdminUser() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // 1. Get auth user
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData.user) {
        console.log('No authenticated user:', authError?.message);
        setUser(null);
        setIsAdmin(false);
        return;
      }

      const authUser = authData.user;
      const email = authUser.email ?? "";
      
      // 2. Get user data from pengguna table
      let penggunaData = null;
      let penggunaError = null;
      
      try {
        // Coba cari berdasarkan email
        const { data, error } = await supabase
          .from("pengguna")
          .select("*")
          .eq("email", email)
          .single();
          
        penggunaData = data;
        penggunaError = error;

        // Jika tidak ketemu, coba buat user baru di tabel pengguna
        if (error && error.code === 'PGRST116') { // PGRST116 = no rows returned
          console.log('User not found in pengguna table, creating...');
          
          const { data: newUser, error: createError } = await supabase
            .from("pengguna")
            .insert({
              nama: authUser.user_metadata?.full_name || 
                    authUser.user_metadata?.name || 
                    email.split('@')[0],
              email: email,
              peran: 'mahasiswa', // Default role
              is_verified: true
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating user in pengguna table:', createError);
          } else {
            penggunaData = newUser;
          }
        }
      } catch (tableError) {
        console.log('Error accessing pengguna table:', tableError);
      }

      // 3. Prepare user information
      const metadata = authUser.user_metadata;
      let avatarUrl = penggunaData?.avatar_url || metadata?.avatar_url;

      // If avatar_url is a supabase storage path
      if (avatarUrl && !avatarUrl.startsWith("http") && !avatarUrl.startsWith("data:")) {
        try {
          const { data: imageUrl } = supabase.storage
            .from("avatars")
            .getPublicUrl(avatarUrl);
          avatarUrl = imageUrl.publicUrl;
        } catch (storageError) {
          console.log('Error getting avatar URL:', storageError);
        }
      }

      const userInfo: User = {
        id: authUser.id,
        name: penggunaData?.nama || 
              metadata?.full_name || 
              metadata?.name || 
              email.split('@')[0] || 
              "Pengguna",
        email: email,
        avatar_url: avatarUrl,
        peran: penggunaData?.peran || "mahasiswa",
        nim: penggunaData?.nim,
        fakultas: penggunaData?.fakultas,
        program_studi: penggunaData?.program_studi,
        is_verified: penggunaData?.is_verified || false
      };

      setUser(userInfo);
      
      // Check if admin
      setIsAdmin(userInfo.peran === "admin" && userInfo.is_verified === true);
      
    } catch (error) {
      console.error('Unexpected error in loadUser:', error);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          loadUser();
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
          router.push("/login");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUser, router, supabase]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    router.push("/login");
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user?.email) return null;
    
    try {
      const { data: updated, error } = await supabase
        .from("pengguna")
        .update(data)
        .eq("email", user.email)
        .select()
        .single();
        
      if (!error && updated) {
        setUser(prev => prev ? { ...prev, ...updated } : null);
      }
      
      return { data: updated, error };
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
  };

  return { 
    user, 
    logout, 
    isLoading, 
    isAdmin,
    updateProfile,
    refresh: loadUser 
  };
}