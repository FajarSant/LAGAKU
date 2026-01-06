"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/navigation/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTheme } from "next-themes";

// Components
import ProfileStats from "@/components/public/profile/ProfileStats";
import ProfileSidebar from "@/components/public/profile/ProfileSidebar";
import ProfileContent from "@/components/public/profile/ProfileContent";
import RecentTeams from "@/components/public/profile/RecentTeams";
import RecentMatches from "@/components/public/profile/RecentMatches";

// Types
import {
  AnggotaTim,
  MatchCountResult,
  Pengguna,
  Pertandingan,
  TeamQueryResult,
  UserStats,
} from "@/utils";
import ProfileLoading from "@/components/public/profile/Loading";
import ProfileFooter from "@/components/public/profile/ProfileFooter";

export default function ProfilePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const supabase = createClient();

  const [user, setUser] = useState<Pengguna | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Pengguna>>({});
  const [userStats, setUserStats] = useState<UserStats>({
    totalMatches: 0,
    tournamentsJoined: 0,
    activeTeams: 0,
    upcomingMatches: 0,
  });
  const [userTeams, setUserTeams] = useState<AnggotaTim[]>([]);
  const [userMatches, setUserMatches] = useState<Pertandingan[]>([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchUserTeams();
      fetchUserMatches();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        toast.error("Sesi telah berakhir, silakan login kembali");
        router.push("/login");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("pengguna")
        .select("*")
        .eq("email", authUser.email)
        .single();

      if (userError) throw userError;

      setUser(userData as Pengguna);
      setEditForm(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Gagal memuat data profil");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      if (!user?.nim) return;

      const { data: teamsData, error: teamsError } = await supabase
        .from("anggota_tim")
        .select<
          `
          tim_id,
          tim:tim_id (
            id,
            acara_id
          )
        `,
          TeamQueryResult
        >(
          `
          tim_id,
          tim:tim_id (
            id,
            acara_id
          )
        `
        )
        .eq("nim", user.nim);

      if (teamsError) throw teamsError;

      const teamIds =
        (teamsData?.map((item) => item.tim?.id).filter(Boolean) as string[]) ||
        [];
      const tournamentIds = [
        ...new Set(
          teamsData?.map((item) => item.tim?.acara_id).filter(Boolean)
        ),
      ];

      if (teamIds.length === 0) {
        setUserStats({
          totalMatches: 0,
          tournamentsJoined: 0,
          activeTeams: 0,
          upcomingMatches: 0,
        });
        return;
      }

      // Fetch total matches count
      const { count: totalMatches, error: matchesError } = await supabase
        .from("pertandingan")
        .select("*", { count: "exact", head: true })
        .or(
          `tim_a_id.in.(${teamIds.join(",")}),tim_b_id.in.(${teamIds.join(
            ","
          )})`
        );

      if (matchesError) throw matchesError;

      // Fetch upcoming matches count
      const today = new Date().toISOString().split("T")[0];
      const { count: upcomingMatches, error: upcomingError } = await supabase
        .from("pertandingan")
        .select("*", { count: "exact", head: true })
        .or(
          `tim_a_id.in.(${teamIds.join(",")}),tim_b_id.in.(${teamIds.join(
            ","
          )})`
        )
        .gte("tanggal_pertandingan", today)
        .eq("status", "dijadwalkan");

      if (upcomingError) throw upcomingError;

      setUserStats({
        totalMatches: totalMatches || 0,
        tournamentsJoined: tournamentIds.length,
        activeTeams: teamIds.length,
        upcomingMatches: upcomingMatches || 0,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      toast.error("Gagal memuat statistik");
    }
  };

  const fetchUserTeams = async () => {
    try {
      if (!user?.nim) return;

      const { data, error } = await supabase
        .from("anggota_tim")
        .select(
          `
          id,
          nama_pemain,
          nim,
          tim:tim_id (
            id,
            nama,
            acara_id,
            status,
            acara:acara_id (
              nama
            )
          )
        `
        )
        .eq("nim", user.nim)
        .order("dibuat_pada", { ascending: false })
        .limit(5);

      if (error) throw error;

      const typedData: AnggotaTim[] = (data || []).map((item: any) => ({
        id: item.id,
        nama_pemain: item.nama_pemain,
        nim: item.nim,
        tim: item.tim
          ? {
              id: item.tim.id,
              nama: item.tim.nama,
              acara_id: item.tim.acara_id,
              status: item.tim.status,
              acara: item.tim.acara
                ? {
                    nama: item.tim.acara.nama,
                  }
                : undefined,
            }
          : undefined,
      }));

      setUserTeams(typedData);
    } catch (error) {
      console.error("Error fetching user teams:", error);
      toast.error("Gagal memuat data tim");
    }
  };

  const fetchUserMatches = async () => {
    try {
      if (!user?.nim) return;

      const { data: teamsData, error: teamsError } = await supabase
        .from("anggota_tim")
        .select("tim_id")
        .eq("nim", user.nim);

      if (teamsError) throw teamsError;

      const teamIds =
        (teamsData?.map((item) => item.tim_id).filter(Boolean) as string[]) ||
        [];

      if (teamIds.length === 0) {
        setUserMatches([]);
        return;
      }

      const { data, error } = await supabase
        .from("pertandingan")
        .select(
          `
          id,
          status,
          tanggal_pertandingan,
          waktu_pertandingan,
          skor_tim_a,
          skor_tim_b,
          tim_a:tim_a_id (nama),
          tim_b:tim_b_id (nama),
          pemenang_id,
          acara:acara_id (nama),
          round:round_id (nama)
        `
        )
        .or(
          `tim_a_id.in.(${teamIds.join(",")}),tim_b_id.in.(${teamIds.join(
            ","
          )})`
        )
        .order("tanggal_pertandingan", { ascending: false })
        .limit(5);

      if (error) throw error;

      const typedData: Pertandingan[] = (data || []).map((item: any) => ({
        id: item.id,
        status: item.status,
        tanggal_pertandingan: item.tanggal_pertandingan,
        waktu_pertandingan: item.waktu_pertandingan,
        skor_tim_a: item.skor_tim_a,
        skor_tim_b: item.skor_tim_b,
        tim_a: item.tim_a ? { nama: item.tim_a.nama } : undefined,
        tim_b: item.tim_b ? { nama: item.tim_b.nama } : undefined,
        acara: item.acara ? { nama: item.acara.nama } : undefined,
        round: item.round ? { nama: item.round.nama } : undefined,
        pemenang_id: item.pemenang_id,
      }));

      setUserMatches(typedData);
    } catch (error) {
      console.error("Error fetching user matches:", error);
      toast.error("Gagal memuat data pertandingan");
    }
  };

  const handleSaveProfile = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        toast.error("Sesi telah berakhir");
        router.push("/login");
        return;
      }

      const updatePromise = supabase
        .from("pengguna")
        .update(editForm)
        .eq("email", authUser.email)
        .select()
        .single();

      toast.promise(
        async () => {
          const response = await updatePromise;
          if (response.error) throw response.error;

          setUser(response.data as Pengguna);
          setIsEditing(false);

          // Refresh data setelah update
          fetchUserStats();
          fetchUserTeams();
          fetchUserMatches();

          return "Profil berhasil diperbarui!";
        },
        {
          loading: "Menyimpan perubahan...",
          success: (message: string) => message,
          error: (err: Error) => {
            console.error("Error updating profile:", err);
            return "Gagal memperbarui profil";
          },
        }
      );
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditForm(user || {});
    setIsEditing(false);
    toast.info("Perubahan dibatalkan");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  if (loading) {
    return <ProfileLoading />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:bg-linear-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-white pb-20 md:pb-0">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-linear-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Profil Pengguna
            </h1>
            <p className="text-muted-foreground mt-4 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
              Kelola data pribadi dan pantau aktivitas kompetisi Anda
            </p>

            {/* Optional decorative element */}
            <div className="flex justify-center mt-6">
              <div className="w-16 h-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <ProfileStats stats={userStats} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar user={user} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Content */}
            <ProfileContent
              user={user}
              isEditing={isEditing}
              editForm={editForm}
              onEditToggle={handleEditToggle}
              onEditFormChange={setEditForm}
              onSave={handleSaveProfile}
              onCancel={handleCancelEdit}
            />

            {/* Recent Teams & Matches */}
            {!isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RecentTeams teams={userTeams} />
                <RecentMatches matches={userMatches} />
              </div>
            )}
          </div>
        </div>
      </div>
      <ProfileFooter user={user} />
    </div>
  );
}
