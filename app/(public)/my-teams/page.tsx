"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Navigation from "@/components/navigation/navigation";
import Footer from "@/components/public/Footer";
import { Pengguna, TeamWithDetails } from "@/utils";
import HeroSection from "@/components/public/teams/HeroSection";
import TeamList from "@/components/public/teams/TeamList";
import CreateTeamDialog from "@/components/public/teams/CreateTeamDialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MyTeamsPage() {
  const [teams, setTeams] = useState<TeamWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Pengguna | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);

  const supabase = createClient();

  const fetchUser = useCallback(async () => {
    try {
      const {
        data: { user: authUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!authUser) {
        setError("Silakan login untuk melihat tim Anda");
        return null;
      }

      const { data: userProfile, error: profileError } = await supabase
        .from("pengguna")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!userProfile) {
        const defaultProfile: Pengguna = {
          id: authUser.id,
          nama:
            authUser.user_metadata?.full_name ||
            authUser.email?.split("@")[0] ||
            "User",
          email: authUser.email || "",
          peran: "mahasiswa",
          is_verified: false,
          dibuat_pada: new Date().toISOString(),
        };
        return defaultProfile;
      } else {
        return {
          ...userProfile,
          nim: userProfile.nim || undefined,
          jurusan: userProfile.jurusan || undefined,
          angkatan: userProfile.angkatan || undefined,
          nomor_hp: userProfile.nomor_hp || undefined,
          avatar_url: userProfile.avatar_url || undefined,
        };
      }
    } catch (error: any) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }, [supabase]);

  const fetchUserTeams = useCallback(
    async (userData: Pengguna) => {
      try {
        let allTeamData: any[] = [];
        const userNIM = userData.nim?.trim() || "";
        const userName = userData.nama?.trim() || "";

        // Query berdasarkan NIM
        if (userNIM) {
          const { data: teamsByNIM, error: nimError } = await supabase
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
          `,
            )
            .eq("nim", userNIM);

          if (nimError) throw nimError;
          if (teamsByNIM) allTeamData.push(...teamsByNIM);
        }

        if (userName) {
          const { data: teamsByName, error: nameError } = await supabase
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
          `,
            )
            .ilike("nama_pemain", `%${userName}%`);

          if (nameError) throw nameError;
          if (teamsByName) allTeamData.push(...teamsByName);
        }

        const uniqueTeams = new Map();
        allTeamData.forEach((item: any) => {
          const teamData = Array.isArray(item.tim) ? item.tim[0] : item.tim;
          if (teamData && !uniqueTeams.has(teamData.id)) {
            uniqueTeams.set(teamData.id, teamData);
          }
        });

        // Get team details
        const teamDetailsPromises = Array.from(uniqueTeams.values()).map(
          async (team: any) => {
            const { data: members, error: membersError } = await supabase
              .from("anggota_tim")
              .select("id, tim_id, nama_pemain, nim, dibuat_pada")
              .eq("tim_id", team.id);

            if (membersError) throw membersError;

            const sortedMembers = [...(members || [])].sort(
              (a, b) =>
                new Date(a.dibuat_pada).getTime() -
                new Date(b.dibuat_pada).getTime(),
            );

            const membersWithKetua = (members || []).map((member, index) => ({
              ...member,
              is_ketua: member.id === sortedMembers[0]?.id,
            }));

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
              status: team.status || "aktif",
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
              anggota_tim: membersWithKetua,
              _count: {
                anggota_tim: members?.length || 0,
                pertandingan: matchCount || 0,
              },
            } as TeamWithDetails;
          },
        );

        return await Promise.all(teamDetailsPromises);
      } catch (error: any) {
        console.error("Error fetching teams:", error);
        throw error;
      }
    },
    [supabase],
  );

  const fetchUserAndTeams = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = await fetchUser();
      if (!userData) {
        setLoading(false);
        return;
      }

      setUser(userData);
      const teamsData = await fetchUserTeams(userData);
      setTeams(teamsData);

      // Toast success
      // if (teamsData.length > 0) {
      //   toast.success(`${teamsData.length} tim berhasil dimuat`);
      // }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setError(error.message || "Terjadi kesalahan saat memuat data tim");
      toast.error("Gagal memuat data tim");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchUser, fetchUserTeams]);

  useEffect(() => {
    fetchUserAndTeams();
  }, [fetchUserAndTeams]);

  const handleRefresh = () => {
    setRefreshing(true);
    toast.info("Memuat ulang data...");
    fetchUserAndTeams();
  };

  const handleTeamCreated = () => {
    setShowCreateDialog(false);
    toast.success("Tim berhasil dibuat!");
    fetchUserAndTeams();
  };

  const handleDeleteTeam = async () => {
    if (!teamToDelete) return;

    try {
      const { error } = await supabase
        .from("tim")
        .delete()
        .eq("id", teamToDelete);

      if (error) throw error;

      setTeams((prev) => prev.filter((team) => team.id !== teamToDelete));
      setTeamToDelete(null);
      toast.success("Tim berhasil dihapus");
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Gagal menghapus tim");
    }
  };

  const stats = {
    totalTeams: teams.length,
    teamsWithoutAcara: teams.filter((t) => !t.acara_id).length,
    activeTeams: teams.filter((t) => t.status === "aktif").length,
    totalMembers: teams.reduce(
      (sum, team) => sum + (team.anggota_tim?.length || 0),
      0,
    ),
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-6 w-full max-w-md" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {!error && (
          <>
            <HeroSection
              teams={teams}
              loading={loading}
              error={null}
              onRefresh={handleRefresh}
              onCreateTeam={() => setShowCreateDialog(true)}
              onDeleteTeam={setTeamToDelete}
            />

            <div className="mt-8">
              <TeamList
                teams={teams}
                loading={loading}
                onRefresh={handleRefresh}
                error={null}
                onCreateTeam={() => setShowCreateDialog(true)}
                onDeleteTeam={setTeamToDelete}
              />
            </div>
          </>
        )}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!teamToDelete}
        onOpenChange={() => setTeamToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tim</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus tim ini? Tindakan ini tidak
              dapat dibatalkan. Semua data tim dan anggota akan dihapus secara
              permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeam}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
