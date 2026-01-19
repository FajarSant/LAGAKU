"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Navigation from "@/components/navigation/navigation";
import Footer from "@/components/public/Footer";
import { TournamentDetails, UserProfile, UserTeam } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Calendar, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import TeamRegistration from "@/components/public/tournaments/register/TeamRegistration";

export default function TournamentRegisterPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const tournamentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tournament, setTournament] = useState<TournamentDetails | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userTeams, setUserTeams] = useState<UserTeam[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (tournamentId) {
      loadData();
    }
  }, [tournamentId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cek apakah user login
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsLoggedIn(false);
        setError("Silakan login terlebih dahulu untuk mendaftar turnamen");
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);

      // Ambil data user
      const { data: profile } = await supabase
        .from("pengguna")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        const userProfileData: UserProfile = {
          id: profile.id,
          email: profile.email,
          full_name: profile.nama || profile.email?.split('@')[0] || 'User',
          nim: profile.nim,
          jurusan: profile.jurusan,
          angkatan: profile.angkatan,
          nomor_hp: profile.nomor_hp,
          avatar_url: profile.avatar_url,
        };
        
        setUserProfile(userProfileData);
        
        // Setelah userProfile di-set, ambil tim user
        await fetchUserTeams(userProfileData);
      } else {
        // Jika profile tidak ditemukan, set teams kosong
        setUserTeams([]);
      }

      // Ambil data turnamen
      await fetchTournamentDetails();

    } catch (error: any) {
      console.error("Error loading data:", error);
      setError(error.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil tim berdasarkan user yang login
  const fetchUserTeams = async (profile: UserProfile) => {
    try {
      console.log("Fetching teams for user:", profile);
      
      // Versi 1: Cari berdasarkan NIM dan nama
      const { data: anggotaByNIM, error: errorByNIM } = await supabase
        .from("anggota_tim")
        .select("tim_id")
        .eq("nim", profile.nim)
        .neq("nim", "")
        .neq("nim", null);

      const { data: anggotaByNama, error: errorByNama } = await supabase
        .from("anggota_tim")
        .select("tim_id")
        .ilike("nama_pemain", `%${profile.full_name}%`);

      const allTimIds = new Set<string>();
      
      // Tambahkan tim_id dari hasil query NIM
      if (anggotaByNIM && !errorByNIM) {
        anggotaByNIM.forEach(item => allTimIds.add(item.tim_id));
      }
      
      // Tambahkan tim_id dari hasil query nama
      if (anggotaByNama && !errorByNama) {
        anggotaByNama.forEach(item => allTimIds.add(item.tim_id));
      }

      const timIds = Array.from(allTimIds);
      
      console.log("Found team IDs:", timIds);

      if (timIds.length === 0) {
        setUserTeams([]);
        return;
      }

      // Ambil detail tim dari setiap tim_id
      const { data: teamsData, error: teamsError } = await supabase
        .from("tim")
        .select("*")
        .in("id", timIds);

      if (teamsError) {
        console.error("Error fetching teams:", teamsError);
        setUserTeams([]);
        return;
      }

      console.log("Teams data:", teamsData);

      // Untuk setiap tim, ambil anggota
      const teamsWithMembers: UserTeam[] = [];

      for (const team of teamsData || []) {
        const { data: anggotaData } = await supabase
          .from("anggota_tim")
          .select("nama_pemain, nim")
          .eq("tim_id", team.id);

        teamsWithMembers.push({
          id: team.id,
          nama: team.nama,
          jurusan: team.jurusan || "",
          angkatan: team.angkatan || "",
          nomor_hp: team.nomor_hp || "",
          anggota: (anggotaData || []).map(a => ({
            nama_pemain: a.nama_pemain,
            nim: a.nim || ""
          }))
        });
      }

      console.log("Final teams with members:", teamsWithMembers);
      setUserTeams(teamsWithMembers);

    } catch (error) {
      console.error("Error in fetchUserTeams:", error);
      setUserTeams([]);
    }
  };

  // ALTERNATIF: Versi lebih sederhana - ambil semua tim dan filter di frontend
  const fetchAllTeamsAndFilter = async (profile: UserProfile) => {
    try {
      // Ambil SEMUA tim
      const { data: allTeams, error } = await supabase
        .from("tim")
        .select("*");

      if (error) {
        console.error("Error fetching all teams:", error);
        setUserTeams([]);
        return;
      }

      console.log("All teams:", allTeams);

      const userTeams: UserTeam[] = [];

      // Untuk setiap tim, cek apakah user adalah anggota
      for (const team of allTeams || []) {
        // Cek anggota tim berdasarkan NIM atau nama
        const { data: anggotaData } = await supabase
          .from("anggota_tim")
          .select("nama_pemain, nim")
          .eq("tim_id", team.id)
          .or(`nim.eq.${profile.nim},nama_pemain.ilike.%${profile.full_name}%`)
          .limit(1);

        // Jika ditemukan anggota yang cocok, tambahkan ke daftar
        if (anggotaData && anggotaData.length > 0) {
          // Ambil semua anggota tim untuk display
          const { data: allAnggota } = await supabase
            .from("anggota_tim")
            .select("nama_pemain, nim")
            .eq("tim_id", team.id);

          userTeams.push({
            id: team.id,
            nama: team.nama,
            jurusan: team.jurusan || "",
            angkatan: team.angkatan || "",
            nomor_hp: team.nomor_hp || "",
            anggota: (allAnggota || []).map(a => ({
              nama_pemain: a.nama_pemain,
              nim: a.nim || ""
            }))
          });
        }
      }

      console.log("Filtered user teams:", userTeams);
      setUserTeams(userTeams);

    } catch (error) {
      console.error("Error fetching all teams:", error);
      setUserTeams([]);
    }
  };

  const fetchTournamentDetails = async () => {
    try {
      const { data: tournamentData, error } = await supabase
        .from("acara")
        .select("*")
        .eq("id", tournamentId)
        .single();

      if (error) throw error;

      const { count: teamCount } = await supabase
        .from("tim")
        .select("*", { count: "exact", head: true })
        .eq("acara_id", tournamentId);

      const isRegistrationOpen = checkRegistrationOpen(tournamentData.deadline_pendaftaran);

      setTournament({
        id: tournamentData.id,
        nama: tournamentData.nama,
        deskripsi: tournamentData.deskripsi,
        lokasi_lapangan: tournamentData.lokasi_lapangan,
        url_lokasi_maps: tournamentData.url_lokasi_maps,
        tanggal_mulai_pertandingan: tournamentData.tanggal_mulai_pertandingan,
        tanggal_selesai_pertandingan: tournamentData.tanggal_selesai_pertandingan,
        deadline_pendaftaran: tournamentData.deadline_pendaftaran,
        dibuat_oleh: tournamentData.dibuat_oleh,
        dibuat_pada: tournamentData.dibuat_pada,
        jumlah_tim: teamCount || 0,
        is_registration_open: isRegistrationOpen,
      });
    } catch (error: any) {
      console.error("Error fetching tournament:", error);
      setError(error.message || "Turnamen tidak ditemukan");
    }
  };

  const checkRegistrationOpen = (deadline: string | null): boolean => {
    if (!deadline) return true;
    try {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      return today <= deadlineDate;
    } catch {
      return true;
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {error || "Turnamen tidak ditemukan"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {!isLoggedIn 
                      ? "Silakan login untuk mendaftar turnamen"
                      : "Terjadi kesalahan saat memuat data turnamen"}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {!isLoggedIn ? (
                      <Button onClick={() => router.push(`/auth/login?redirect=/tournaments/${tournamentId}/register`)}>
                        Login Sekarang
                      </Button>
                    ) : (
                      <Button onClick={loadData}>
                        Coba Lagi
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => router.push("/tournaments")}>
                      Kembali ke Turnamen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Daftar Turnamen: {tournament.nama}
                </h1>
                <div className="flex items-center gap-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${tournament.is_registration_open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {tournament.is_registration_open ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Pendaftaran Dibuka
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        Pendaftaran Ditutup
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{tournament.jumlah_tim || 0} tim terdaftar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Tournament Info */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Detail Turnamen</h3>
                  <div className="space-y-3">
                    {tournament.tanggal_mulai_pertandingan && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-sm text-muted-foreground">Tanggal Mulai</p>
                          <p className="font-medium">{formatDate(tournament.tanggal_mulai_pertandingan)}</p>
                        </div>
                      </div>
                    )}
                    
                    {tournament.deadline_pendaftaran && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-sm text-muted-foreground">Deadline Pendaftaran</p>
                          <p className="font-medium">{formatDate(tournament.deadline_pendaftaran)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informasi Peserta</h3>
                  <div className="space-y-2">
                    {userProfile && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Login sebagai:</p>
                        <p className="font-semibold">{userProfile.full_name || userProfile.email}</p>
                        {userProfile.nim && userProfile.jurusan && (
                          <p className="text-sm text-muted-foreground">
                            {userProfile.nim} • {userProfile.jurusan}
                          </p>
                        )}
                      </div>
                    )}
                    <div className={`p-3 rounded-lg ${userTeams.length > 0 ? 'bg-green-50 text-green-800' : 'bg-blue-50 text-blue-700'}`}>
                      <p className="text-sm">
                        Anda memiliki <span className="font-semibold">{userTeams.length} tim</span> yang dapat didaftarkan.
                        {userTeams.length === 0 && " Silakan buat tim baru."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Form */}
          <TeamRegistration
            tournament={tournament}
            tournamentId={tournamentId}
            userProfile={userProfile}
            userTeams={userTeams || []}
            onRegistrationSuccess={loadData}
          />

          {/* Info Box */}
          {!tournament.is_registration_open && (
            <Alert className="mb-8">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Pendaftaran untuk turnamen ini sudah ditutup. Anda tidak dapat mendaftarkan tim baru.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}