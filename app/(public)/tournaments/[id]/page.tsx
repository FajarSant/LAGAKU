"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  ArrowLeft,
  ExternalLink,
  Gamepad2,
  CalendarDays,
  UserCheck,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Navigation from "@/components/navigation/navigation";
import Footer from "@/components/public/Footer";
import { Acara } from "@/utils";
import { toast } from "sonner";

interface TournamentWithDetails extends Acara {
  lokasi_lapangan?: string;
  url_lokasi_maps?: string;
  tanggal_mulai_pertandingan?: string;
  tanggal_selesai_pertandingan?: string;
  deadline_pendaftaran?: string;
  dibuat_oleh?: string;
  tim?: any[];
}

export default function TournamentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const tournamentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tournament, setTournament] = useState<TournamentWithDetails | null>(
    null,
  );
  const [registeredTeams, setRegisteredTeams] = useState<any[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userHasTeam, setUserHasTeam] = useState(false);

  useEffect(() => {
    if (tournamentId) {
      fetchTournamentDetails();
      checkUserRegistration();
    }
  }, [tournamentId]);

  const fetchTournamentDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Ambil data turnamen detail
      const { data: tournamentData, error: tournamentError } = await supabase
        .from("acara")
        .select(
          `
          *,
          tim:tim(*, anggota_tim(*))
        `,
        )
        .eq("id", tournamentId)
        .single();

      if (tournamentError) throw tournamentError;
      if (!tournamentData) throw new Error("Turnamen tidak ditemukan");

      setTournament({
        ...tournamentData,
        _count: {
          tim: tournamentData.tim?.length || 0,
          pertandingan: 0,
          round: 0,
        },
      });

      // Ambil tim yang sudah terdaftar
      if (tournamentData.tim) {
        setRegisteredTeams(tournamentData.tim);
      }
    } catch (error: any) {
      console.error("Error fetching tournament:", error);
      setError(error.message || "Gagal memuat data turnamen");
      toast.error("Gagal memuat data turnamen");
    } finally {
      setLoading(false);
    }
  };

  const checkUserRegistration = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // Cek apakah user sudah punya tim
      const { data: userTeams, error: teamsError } = await supabase
        .from("anggota_tim")
        .select("tim_id")
        .or(
          `nim.ilike.%${session.user.email?.split("@")[0]}%, nama_pemain.ilike.%${session.user.email?.split("@")[0]}%`,
        );

      if (teamsError) throw teamsError;

      setUserHasTeam(userTeams && userTeams.length > 0);

      // Cek apakah user sudah terdaftar di turnamen ini
      if (userTeams && userTeams.length > 0) {
        const timIds = userTeams.map((t) => t.tim_id);
        const { data: registered, error: registeredError } = await supabase
          .from("tim")
          .select("id")
          .eq("acara_id", tournamentId)
          .in("id", timIds);

        if (registeredError) throw registeredError;
        setIsRegistered(registered && registered.length > 0);
      }
    } catch (error) {
      console.error("Error checking registration:", error);
    }
  };

  const handleRegister = () => {
    if (!tournamentId) return;
    router.push(`/tournaments/${tournamentId}/register`);
  };

  const handleViewTeam = (teamId: string) => {
    router.push(`/my-teams/${teamId}`);
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

  const getRegistrationStatus = () => {
    if (!tournament?.deadline_pendaftaran)
      return { open: true, message: "Pendaftaran Dibuka" };

    const deadline = new Date(tournament.deadline_pendaftaran);
    const today = new Date();

    if (today > deadline) {
      return { open: false, message: "Pendaftaran Ditutup" };
    }

    // Hitung hari tersisa
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 3) {
      return {
        open: true,
        message: `Pendaftaran Segera Ditutup (${diffDays} hari lagi)`,
      };
    }

    return { open: true, message: "Pendaftaran Dibuka" };
  };

  const registrationStatus = getRegistrationStatus();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto border-0 shadow-xl">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3">
                Turnamen Tidak Ditemukan
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                {error || "Turnamen yang Anda cari tidak ditemukan."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => router.push("/tournaments")}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Daftar Turnamen
                </Button>
                <Button
                  variant="outline"
                  onClick={fetchTournamentDetails}
                  className="gap-2"
                >
                  Coba Lagi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header dengan Tombol Kembali */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/tournaments")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Turnamen
          </Button>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{tournament.nama}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <Badge
                  variant={registrationStatus.open ? "default" : "destructive"}
                  className="gap-2"
                >
                  {registrationStatus.open ? (
                    <>
                      <Clock className="w-4 h-4" />
                      {registrationStatus.message}
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      {registrationStatus.message}
                    </>
                  )}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Users className="w-4 h-4" />
                  <span>{tournament._count?.tim || 0} tim terdaftar</span>
                </div>
                {tournament.dibuat_pada && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <CalendarDays className="w-4 h-4" />
                    <span>Dibuat: {formatDate(tournament.dibuat_pada)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kiri - Detail Turnamen */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deskripsi */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  Deskripsi Turnamen
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  {tournament.deskripsi ? (
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {tournament.deskripsi}
                    </p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      Tidak ada deskripsi untuk turnamen ini.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Informasi Detail */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Informasi Detail</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tanggal */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Tanggal Mulai
                        </p>
                        <p className="font-medium">
                          {formatDate(tournament.tanggal_mulai_pertandingan)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Tanggal Selesai
                        </p>
                        <p className="font-medium">
                          {formatDate(tournament.tanggal_selesai_pertandingan)}
                        </p>
                      </div>
                    </div>

                    {tournament.deadline_pendaftaran && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Deadline Pendaftaran
                          </p>
                          <p className="font-medium">
                            {formatDate(tournament.deadline_pendaftaran)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lokasi */}
                  <div className="space-y-4">
                    {tournament.lokasi_lapangan && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                          <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Lokasi Lapangan
                          </p>
                          <p className="font-medium">
                            {tournament.lokasi_lapangan}
                          </p>
                        </div>
                      </div>
                    )}

                    {tournament.url_lokasi_maps && (
                      <div>
                        <a
                          href={tournament.url_lokasi_maps}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Lihat di Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tim yang Sudah Terdaftar */}
            {registeredTeams.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Tim Terdaftar ({registeredTeams.length})
                  </h2>
                  <div className="space-y-3">
                    {registeredTeams.slice(0, 10).map((team) => (
                      <div
                        key={team.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{team.nama}</h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {team.jurusan && (
                                <span className="mr-3">
                                  Jurusan: {team.jurusan}
                                </span>
                              )}
                              <span>
                                Anggota: {team.anggota_tim?.length || 0} orang
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewTeam(team.id)}
                            className="gap-1"
                          >
                            Lihat
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {registeredTeams.length > 10 && (
                      <div className="text-center text-gray-500 dark:text-gray-400 pt-2">
                        ...dan {registeredTeams.length - 10} tim lainnya
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Kanan - Sidebar */}
          <div className="space-y-6">
            {/* Status Pendaftaran */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Status Pendaftaran
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Kuota Tim
                    </span>
                    <span className="font-medium">Unlimited</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tim Terdaftar
                    </span>
                    <span className="font-medium">
                      {tournament._count?.tim || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Status Anda
                    </span>
                    {isRegistered ? (
                      <Badge variant="success" className="gap-1">
                        <UserCheck className="w-3 h-3" />
                        Sudah Terdaftar
                      </Badge>
                    ) : (
                      <Badge variant="outline">Belum Terdaftar</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informasi Penting */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Informasi Penting
                </h2>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5"></div>
                    <span>Pastikan semua data anggota tim valid</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5"></div>
                    <span>Maksimal anggota per tim: 10 orang</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5"></div>
                    <span>
                      Ketua tim tidak dapat diubah setelah pendaftaran
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5"></div>
                    <span>Pendaftaran dapat dibatalkan sebelum deadline</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Kontak */}
            {tournament.dibuat_oleh && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Kontak Panitia</h2>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Penanggung Jawab
                      </p>
                      <p className="font-medium">{tournament.dibuat_oleh}</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Untuk pertanyaan dan informasi lebih lanjut, hubungi
                      panitia melalui email atau media sosial resmi.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
