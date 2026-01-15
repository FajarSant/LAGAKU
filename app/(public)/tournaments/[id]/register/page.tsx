"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Navigation from "@/components/navigation/navigation";
import Footer from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Calendar,
  Users,
  Trophy,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Clock,
  Phone,
  Mail,
  User,
  School,
  CalendarDays,
} from "lucide-react";
import { Acara, TeamMemberForm } from "@/utils";

interface FormData {
  nama_tim: string;
  jurusan: string;
  angkatan: string;
  nomor_hp: string;
  members: TeamMemberForm[];
  kapten_nama: string;
  kapten_email: string;
  kapten_nim: string;
  kapten_fakultas: string;
  kapten_program_studi: string;
  kapten_no_hp: string;
  catatan: string;
}

interface TournamentDetails extends Acara {
  _count?: {
    tim?: number;
    pertandingan?: number;
  };
  is_registration_open: boolean;
  max_teams?: number;
  min_players?: number;
  max_players?: number;
}

export default function TournamentRegisterPage() {
  const router = useRouter();
  const params = useParams();

  // Debug: log params untuk melihat struktur
  console.log("Params:", params);

  // Coba semua kemungkinan nama parameter
  const tournamentId =
    (params.id as string) ||
    (params.tournament_id as string) ||
    (params.tournamentId as string) ||
    (params.tournaments_id as string);

  console.log("Extracted tournamentId:", tournamentId);

  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [loadingTournament, setLoadingTournament] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tournament, setTournament] = useState<TournamentDetails | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nama_tim: "",
    jurusan: "",
    angkatan: "",
    nomor_hp: "",
    members: [
      { nama_pemain: "", nim: "" },
      { nama_pemain: "", nim: "" },
      { nama_pemain: "", nim: "" },
    ],
    kapten_nama: "",
    kapten_email: "",
    kapten_nim: "",
    kapten_fakultas: "",
    kapten_program_studi: "",
    kapten_no_hp: "",
    catatan: "",
  });

  // Fetch tournament details
  useEffect(() => {
    console.log("useEffect triggered with tournamentId:", tournamentId);

    if (tournamentId) {
      fetchTournamentDetails();
    } else {
      console.error("tournamentId is undefined or empty");
      setError("ID turnamen tidak ditemukan dalam URL");
      setLoadingTournament(false);
    }
  }, [tournamentId]);

  const fetchTournamentDetails = async () => {
    try {
      setLoadingTournament(true);
      console.log("Fetching tournament with ID:", tournamentId);

      // Cek dulu apakah tournamentId valid
      if (!tournamentId || tournamentId === "undefined") {
        throw new Error("ID turnamen tidak valid");
      }

      // **PERBAIKAN: Query dengan semua kemungkinan kolom tanggal**
      // Pertama, coba fetch semua kolom untuk melihat struktur sebenarnya
      const { data: tournamentData, error: tournamentError } = await supabase
        .from("acara")
        .select("*") // Ambil semua kolom dulu untuk debugging
        .eq("id", tournamentId)
        .single();

      console.log("Full tournament data for debugging:", tournamentData);

      if (tournamentError) {
        console.error("Supabase error:", tournamentError);
        throw tournamentError;
      }

      if (!tournamentData) {
        console.warn("No tournament data found for ID:", tournamentId);
        setError("Turnamen tidak ditemukan");
        setLoadingTournament(false);
        return;
      }

      // **DEBUG: Log semua keys yang ada di data**
      console.log(
        "Available keys in tournamentData:",
        Object.keys(tournamentData)
      );
      console.log("Data structure:", tournamentData);

      // **PERBAIKAN: Ambil tanggal dengan nama kolom yang benar**
      // Coba berbagai kemungkinan nama kolom tanggal
      const tanggalMulai =
        tournamentData.tanggal_mulai ||
        tournamentData.start_date ||
        tournamentData.created_at ||
        tournamentData.dibuat_pada;

      const tanggalSelesai =
        tournamentData.tanggal_selesai || tournamentData.end_date || null;

      console.log("Extracted dates:", { tanggalMulai, tanggalSelesai });

      // Fetch count data secara terpisah
      const { count: teamCount } = await supabase
        .from("tim")
        .select("*", { count: "exact", head: true })
        .eq("acara_id", tournamentId);

      const { count: matchCount } = await supabase
        .from("pertandingan")
        .select("*", { count: "exact", head: true })
        .eq("acara_id", tournamentId);

      console.log("Counts:", { teamCount, matchCount });

      // Transform data dengan type safety
      const transformedData: TournamentDetails = {
        id: tournamentData.id,
        nama: tournamentData.nama,
        deskripsi: tournamentData.deskripsi || null,
        dibuat_pada:
          tournamentData.dibuat_pada ||
          tournamentData.created_at ||
          new Date().toISOString(),
        tanggal_mulai: tanggalMulai, // Gunakan nilai yang diekstrak
        tanggal_selesai: tanggalSelesai, // Gunakan nilai yang diekstrak
        _count: {
          tim: teamCount || 0,
          pertandingan: matchCount || 0,
        },
        // Cek apakah pendaftaran masih dibuka
        is_registration_open: isRegistrationOpen(tanggalMulai),
        // Default values
        max_teams: tournamentData.max_teams || 32,
        min_players: tournamentData.min_players || 3,
        max_players: tournamentData.max_players || 10,
      };

      console.log("Transformed data:", transformedData);
      setTournament(transformedData);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching tournament:", error);

      // **PERBAIKAN: Error handling yang lebih spesifik**
      if (error.code === "42703") {
        setError(
          "Terjadi kesalahan struktur database. Silakan hubungi administrator."
        );
        console.error(
          "Database schema error. Available columns might be different."
        );

        // Coba fetch dengan query yang lebih sederhana
        try {
          const { data: simpleData } = await supabase
            .from("acara")
            .select("id, nama, deskripsi")
            .eq("id", tournamentId)
            .single();

          if (simpleData) {
            console.log("Simple data retrieved:", simpleData);
            // Buat data minimal untuk form
            const minimalData: TournamentDetails = {
              id: simpleData.id,
              nama: simpleData.nama,
              deskripsi: simpleData.deskripsi || null,
              dibuat_pada: new Date().toISOString(),
              tanggal_mulai: null,
              tanggal_selesai: null,
              _count: { tim: 0, pertandingan: 0 },
              is_registration_open: true,
              max_teams: 32,
              min_players: 3,
              max_players: 10,
            };
            setTournament(minimalData);
            setError(null);
          }
        } catch (simpleError) {
          console.error("Simple query also failed:", simpleError);
        }
      } else {
        setError(error.message || "Gagal memuat detail turnamen");
      }

      setTournament(null);
    } finally {
      setLoadingTournament(false);
    }
  };

  // Helper function to check if registration is open
  const isRegistrationOpen = (tanggalMulai: string | null): boolean => {
    if (!tanggalMulai) return true; // Jika tidak ada tanggal, anggap terbuka

    try {
      const startDate = new Date(tanggalMulai);
      const today = new Date();
      const oneDayBefore = new Date(startDate);
      oneDayBefore.setDate(startDate.getDate() - 1);

      return today <= oneDayBefore;
    } catch {
      return true; // Jika error parsing date, anggap terbuka
    }
  };

  const handleTeamInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMemberChange = (
    index: number,
    field: keyof TeamMemberForm,
    value: string
  ) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      members: newMembers,
    }));
  };

  const handleAddMember = () => {
    if (
      tournament?.max_players &&
      formData.members.length >= tournament.max_players
    ) {
      setError(`Maksimal ${tournament.max_players} pemain per tim`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, { nama_pemain: "", nim: "" }],
    }));
  };

  const handleRemoveMember = (index: number) => {
    if (
      tournament?.min_players &&
      formData.members.length <= tournament.min_players
    ) {
      setError(`Minimal ${tournament.min_players} pemain per tim`);
      return;
    }
    if (formData.members.length > 1) {
      const newMembers = formData.members.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        members: newMembers,
      }));
    }
  };

  const validateForm = (): boolean => {
    setError(null);

    // Validasi data tim
    if (!formData.nama_tim.trim()) {
      setError("Nama tim wajib diisi");
      return false;
    }

    if (!formData.jurusan.trim()) {
      setError("Jurusan wajib diisi");
      return false;
    }

    if (!formData.angkatan.trim()) {
      setError("Angkatan wajib diisi");
      return false;
    }

    if (!formData.nomor_hp.trim()) {
      setError("Nomor HP tim wajib diisi");
      return false;
    }

    // Validasi data kapten
    if (!formData.kapten_nama.trim()) {
      setError("Nama kapten wajib diisi");
      return false;
    }

    if (!formData.kapten_email.trim()) {
      setError("Email kapten wajib diisi");
      return false;
    }

    if (!formData.kapten_nim.trim()) {
      setError("NIM kapten wajib diisi");
      return false;
    }

    if (!formData.kapten_no_hp.trim()) {
      setError("Nomor HP kapten wajib diisi");
      return false;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.kapten_email)) {
      setError("Format email tidak valid");
      return false;
    }

    // Validasi jumlah anggota
    if (
      tournament?.min_players &&
      formData.members.length < tournament.min_players
    ) {
      setError(`Minimal ${tournament.min_players} pemain per tim`);
      return false;
    }

    if (
      tournament?.max_players &&
      formData.members.length > tournament.max_players
    ) {
      setError(`Maksimal ${tournament.max_players} pemain per tim`);
      return false;
    }

    // Validasi anggota tim
    for (let i = 0; i < formData.members.length; i++) {
      const member = formData.members[i];
      if (!member.nama_pemain.trim()) {
        setError(`Nama pemain ${i + 1} wajib diisi`);
        return false;
      }
      if (!member.nim.trim()) {
        setError(`NIM pemain ${i + 1} wajib diisi`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // 1. Cek apakah turnamen masih ada
      if (!tournament) {
        setError("Turnamen tidak ditemukan");
        return;
      }

      // 2. Cek apakah pendaftaran masih dibuka
      if (!tournament.is_registration_open) {
        setError("Pendaftaran untuk turnamen ini sudah ditutup");
        return;
      }

      // 3. Cek apakah masih ada kuota tim
      if (
        tournament.max_teams &&
        tournament._count?.tim &&
        tournament._count.tim >= tournament.max_teams
      ) {
        setError("Kuota tim untuk turnamen ini sudah penuh");
        return;
      }

      // 4. Cek apakah tim dengan nama yang sama sudah ada di turnamen ini
      const { data: existingTeam, error: checkError } = await supabase
        .from("tim")
        .select("id")
        .eq("nama", formData.nama_tim)
        .eq("acara_id", tournamentId)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existingTeam) {
        setError(
          "Nama tim sudah digunakan di turnamen ini. Silakan gunakan nama lain."
        );
        return;
      }

      console.log("Starting registration process...");

      // 5. Insert data tim
      const { data: teamData, error: teamError } = await supabase
        .from("tim")
        .insert({
          nama: formData.nama_tim,
          jurusan: formData.jurusan,
          angkatan: formData.angkatan,
          nomor_hp: formData.nomor_hp,
          acara_id: tournamentId,
          status: "aktif",
          dibuat_pada: new Date().toISOString(),
        })
        .select()
        .single();

      if (teamError) {
        console.error("Team insert error:", teamError);
        throw teamError;
      }

      console.log("Team created:", teamData);

      // 6. Insert kapten sebagai anggota tim
      const { error: captainError } = await supabase
        .from("anggota_tim")
        .insert({
          nama_pemain: formData.kapten_nama,
          nim: formData.kapten_nim,
          tim_id: teamData.id,
          is_kapten: true,
          email: formData.kapten_email,
          no_hp: formData.kapten_no_hp,
          fakultas: formData.kapten_fakultas || null,
          program_studi: formData.kapten_program_studi || null,
        });

      if (captainError) {
        console.error("Captain insert error:", captainError);
        throw captainError;
      }

      // 7. Insert anggota tim lainnya
      const otherMembers = formData.members.slice(1);
      if (otherMembers.length > 0) {
        const anggotaPromises = otherMembers.map((member) =>
          supabase.from("anggota_tim").insert({
            nama_pemain: member.nama_pemain,
            nim: member.nim,
            tim_id: teamData.id,
            is_kapten: false,
          })
        );

        const results = await Promise.all(anggotaPromises);
        const errors = results.filter((r) => r.error);
        if (errors.length > 0) {
          console.error("Member insert errors:", errors);
          throw errors[0].error;
        }
      }

      // 8. Set success state
      setRegistrationId(teamData.id);
      setSuccess("Pendaftaran berhasil! Tim Anda telah terdaftar.");
      setShowSuccessDialog(true);

      // Refresh tournament data untuk update count
      fetchTournamentDetails();

      // Reset form
      setFormData({
        nama_tim: "",
        jurusan: "",
        angkatan: "",
        nomor_hp: "",
        members: [
          { nama_pemain: "", nim: "" },
          { nama_pemain: "", nim: "" },
          { nama_pemain: "", nim: "" },
        ],
        kapten_nama: "",
        kapten_email: "",
        kapten_nim: "",
        kapten_fakultas: "",
        kapten_program_studi: "",
        kapten_no_hp: "",
        catatan: "",
      });
    } catch (error: any) {
      console.error("Error registering team:", error);
      setError(error.message || "Terjadi kesalahan saat mendaftar. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const getRegistrationStatus = () => {
    if (!tournament) return null;

    if (!tournament.is_registration_open) {
      return {
        label: "Pendaftaran Ditutup",
        color: "destructive" as const,
        icon: <XCircle className="h-4 w-4" />,
      };
    }

    if (
      tournament.max_teams &&
      tournament._count?.tim &&
      tournament._count.tim >= tournament.max_teams
    ) {
      return {
        label: "Kuota Penuh",
        color: "destructive" as const,
        icon: <XCircle className="h-4 w-4" />,
      };
    }

    return {
      label: "Pendaftaran Dibuka",
      color: "default" as const,
      icon: <CheckCircle className="h-4 w-4" />,
    };
  };

  const registrationStatus = getRegistrationStatus();

  // Debug info
  console.log("Component state:", {
    tournamentId,
    loadingTournament,
    tournament,
    error,
  });

  if (loadingTournament) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              Memuat detail turnamen...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !tournament) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Error Memuat Turnamen
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {error.includes("42703")
                      ? "Terjadi kesalahan struktur database. Silakan hubungi administrator."
                      : error}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => router.push("/tournaments")}>
                      Kembali ke Daftar Turnamen
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => fetchTournamentDetails()}
                    >
                      Coba Lagi
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

  if (!tournament) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Turnamen Tidak Ditemukan
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Turnamen yang Anda cari tidak ditemukan atau telah dihapus.
                  </p>
                  <Button onClick={() => router.push("/tournaments")}>
                    Kembali ke Daftar Turnamen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isAddMemberDisabled = tournament?.max_players
    ? formData.members.length >= tournament.max_players
    : false;
  const isRemoveMemberDisabled = tournament?.min_players
    ? formData.members.length <= tournament.min_players
    : false;
  const isSubmitDisabled =
    loading ||
    !tournament.is_registration_open ||
    registrationStatus?.color === "destructive";

  // **Karena ada masalah dengan tanggal, kita akan hide tanggal atau gunakan fallback**
  const showStartDate =
    tournament.tanggal_mulai && tournament.tanggal_mulai !== "-";
  const showEndDate =
    tournament.tanggal_selesai && tournament.tanggal_selesai !== "-";

  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
        <Navigation />

        <div className="container mx-auto px-4 pt-8">
          <div className="max-w-4xl mx-auto">
            <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0"
                onClick={() => router.push("/tournaments")}
              >
                Turnamen
              </Button>
              <ChevronLeft className="h-4 w-4 rotate-180" />
              <span className="text-gray-600 dark:text-gray-400">
                {tournament.nama}
              </span>
              <ChevronLeft className="h-4 w-4 rotate-180" />
              <span className="text-primary font-medium">Pendaftaran</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <Card className="border-2 shadow-lg mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-2/3">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">
                          {tournament.nama}
                        </h1>
                        {registrationStatus && (
                          <Badge
                            variant={registrationStatus.color}
                            className="mb-3"
                          >
                            {registrationStatus.icon}
                            <span className="ml-2">
                              {registrationStatus.label}
                            </span>
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Users className="h-4 w-4" />
                          <span>
                            {tournament._count?.tim || 0} Tim Terdaftar
                          </span>
                          {tournament.max_teams && (
                            <span> / {tournament.max_teams} Kuota</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {tournament.deskripsi && (
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {tournament.deskripsi}
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      {showStartDate && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <CalendarDays className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Tanggal Mulai
                            </p>
                            <p className="font-medium">
                              {formatDate(tournament.tanggal_mulai)}
                            </p>
                          </div>
                        </div>
                      )}

                      {showEndDate && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Tanggal Selesai
                            </p>
                            <p className="font-medium">
                              {formatDate(tournament.tanggal_selesai)}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Trophy className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Total Pertandingan
                          </p>
                          <p className="font-medium">
                            {tournament._count?.pertandingan || 0} Pertandingan
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Jumlah Pemain
                          </p>
                          <p className="font-medium">
                            {tournament.min_players || 3} -{" "}
                            {tournament.max_players || 10} orang
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-1/3">
                    <div className="bg-linear-to-br from-primary/5 to-primary/10 rounded-xl p-6 border">
                      <h3 className="font-semibold mb-4 text-lg">
                        Status Pendaftaran
                      </h3>

                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">
                            Kuota Tersedia
                          </span>
                          <span className="font-semibold">
                            {tournament.max_teams
                              ? `${
                                  tournament.max_teams -
                                  (tournament._count?.tim || 0)
                                } / ${tournament.max_teams}`
                              : "Tidak Terbatas"}
                          </span>
                        </div>

                        {showStartDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">
                              Batas Pendaftaran
                            </span>
                            <span className="font-semibold">
                              H-1{" "}
                              {
                                formatDate(tournament.tanggal_mulai).split(
                                  ","
                                )[0]
                              }
                            </span>
                          </div>
                        )}

                        <Separator />

                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {tournament.is_registration_open
                              ? "Segera daftarkan tim Anda!"
                              : "Pendaftaran sudah ditutup"}
                          </p>
                          <Button
                            size="lg"
                            className="w-full"
                            disabled={isSubmitDisabled}
                          >
                            Daftar Sekarang
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form pendaftaran - sama seperti sebelumnya */}
            {/* ... */}
          </div>
        </div>

        <Footer />
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Pendaftaran Berhasil!
            </DialogTitle>
            <DialogDescription>
              Tim Anda telah terdaftar dalam turnamen.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    ID Pendaftaran
                  </p>
                  <p className="font-mono font-semibold">
                    {registrationId?.substring(0, 8)}...
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Nama Tim</p>
                  <p className="font-semibold">{formData.nama_tim}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Turnamen</p>
                  <p className="font-semibold">{tournament?.nama}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tanggal Daftar
                  </p>
                  <p className="font-semibold">
                    {new Date().toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Konfirmasi akan dikirim ke email{" "}
                <strong>{formData.kapten_email}</strong>.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false);
                router.push(`/tournaments/${tournamentId}`);
              }}
            >
              Lihat Detail Turnamen
            </Button>
            <Button onClick={() => setShowSuccessDialog(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
