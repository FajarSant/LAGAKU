"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Navigation from "@/components/navigation/navigation";
import Footer from "@/components/public/Footer";
import { Acara, Pengguna, TeamWithDetails } from "@/utils";
import HeroSection from "@/components/public/teams/HeroSection";
import TeamList from "@/components/public/teams/TeamList";
import CreateTeamDialog from "@/components/public/teams/CreateTeamDialog";

export default function MyTeamsPage() {
  const [teams, setTeams] = useState<TeamWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Pengguna | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    fetchUserAndTeams();
  }, []);

  const fetchUserAndTeams = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user: authUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(`Authentication error: ${userError.message}`);
      }

      if (!authUser) {
        setError("Silakan login untuk melihat tim Anda");
        setLoading(false);
        return;
      }

      // Get user profile from pengguna table
      const { data: userProfile, error: profileError } = await supabase
        .from("pengguna")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      if (profileError) {
        throw new Error(`Error loading profile: ${profileError.message}`);
      }

      if (!userProfile) {
        // Jika tidak ada di pengguna, coba dari profiles
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        const defaultProfile: Pengguna = {
          id: authUser.id,
          nama: profileData?.full_name ||
                authUser.user_metadata?.full_name ||
                authUser.email?.split("@")[0] ||
                "User",
          email: authUser.email || "",
          peran: "mahasiswa",
          is_verified: false,
          dibuat_pada: new Date().toISOString(),
          nim: profileData?.nim,
          jurusan: profileData?.jurusan,
          angkatan: profileData?.angkatan,
          nomor_hp: profileData?.nomor_hp,
          avatar_url: profileData?.avatar_url,
        };
        setUser(defaultProfile);
      } else {
        // Tambahkan field opsional jika tidak ada
        const enhancedProfile: Pengguna = {
          ...userProfile,
          nim: userProfile.nim || undefined,
          jurusan: userProfile.jurusan || undefined,
          angkatan: userProfile.angkatan || undefined,
          nomor_hp: userProfile.nomor_hp || undefined,
        };
        setUser(enhancedProfile);
      }

      // Cari tim yang berisi user berdasarkan NIM atau nama
      const currentUserName = user?.nama?.toLowerCase() || "";
      const currentUserNIM = user?.nim || "";

      let allTeamData: any[] = [];

      // Query 1: Cari tim berdasarkan NIM di anggota_tim
      if (currentUserNIM) {
        const { data: teamsByNIM } = await supabase
          .from("anggota_tim")
          .select(
            `
            tim_id,
            tim:tim_id (
              id,
              nama,
              status,
              acara_id,
              jurusan,
              angkatan,
              nomor_hp,
              jumlah_pemain,
              dibuat_pada,
              acara:acara_id (
                id,
                nama,
                deskripsi
              )
            )
          `
          )
          .eq("nim", currentUserNIM);

        if (teamsByNIM) {
          allTeamData = [...allTeamData, ...teamsByNIM];
        }
      }

      // Query 2: Cari tim berdasarkan nama di anggota_tim (case-insensitive partial match)
      if (currentUserName) {
        const { data: teamsByName } = await supabase
          .from("anggota_tim")
          .select(
            `
            tim_id,
            tim:tim_id (
              id,
              nama,
              status,
              acara_id,
              jurusan,
              angkatan,
              nomor_hp,
              jumlah_pemain,
              dibuat_pada,
              acara:acara_id (
                id,
                nama,
                deskripsi
              )
            )
          `
          )
          .ilike("nama_pemain", `%${currentUserName}%`);

        if (teamsByName) {
          allTeamData = [...allTeamData, ...teamsByName];
        }
      }

      // Gabungkan hasil query dan hilangkan duplikat
      const uniqueTeamIds = new Set<string>();
      const uniqueTeams: any[] = [];

      allTeamData.forEach((item) => {
        // Supabase mengembalikan tim sebagai array, ambil elemen pertama
        const teamData = Array.isArray(item.tim) ? item.tim[0] : item.tim;
        if (teamData && !uniqueTeamIds.has(teamData.id)) {
          uniqueTeamIds.add(teamData.id);
          uniqueTeams.push(teamData);
        }
      });

      // Ambil anggota tim untuk setiap tim yang ditemukan
      const teamDetailsPromises = uniqueTeams.map(async (team) => {
        // Get team members
        const { data: members } = await supabase
          .from("anggota_tim")
          .select("*")
          .eq("tim_id", team.id);

        // Get match count for this team
        const { count: matchCount } = await supabase
          .from("pertandingan")
          .select("*", { count: "exact", head: true })
          .or(`tim_a_id.eq.${team.id},tim_b_id.eq.${team.id}`);

        const acaraData = Array.isArray(team.acara)
          ? team.acara[0]
          : team.acara;

        return {
          id: team.id,
          nama: team.nama,
          status:
            team.status === "aktif" || team.status === "gugur"
              ? team.status
              : "aktif",
          acara_id: team.acara_id,
          acara: acaraData
            ? {
                id: acaraData.id,
                nama: acaraData.nama,
                deskripsi: acaraData.deskripsi,
              }
            : undefined,
          jurusan: team.jurusan,
          angkatan: team.angkatan,
          nomor_hp: team.nomor_hp,
          jumlah_pemain: team.jumlah_pemain,
          dibuat_pada: team.dibuat_pada,
          anggota_tim: members || [],
          _count: {
            anggota_tim: members?.length || 0,
            pertandingan: matchCount || 0,
          },
        };
      });

      const transformedTeams = await Promise.all(teamDetailsPromises);
      setTeams(transformedTeams);
    } catch (error: any) {
      console.error("Error fetching teams:", error);
      setError(error.message || "Terjadi kesalahan saat memuat data tim");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchUserAndTeams();
  };

  const handleTeamCreated = () => {
    setShowCreateDialog(false);
    fetchUserAndTeams();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      <Navigation />

      <HeroSection
        teams={teams}
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
        onCreateTeam={() => setShowCreateDialog(true)}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <TeamList
          teams={teams}
          loading={loading}
          onRefresh={handleRefresh}
          error={error}
          onCreateTeam={() => setShowCreateDialog(true)}
        />
      </div>

      {/* Create Team Dialog */}
      {user && (
        <CreateTeamDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onTeamCreated={handleTeamCreated}
          user={user}
        />
      )}

      <Footer />
    </div>
  );
}