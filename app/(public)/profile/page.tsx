"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/navigation/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Users, 
  Edit2, 
  Camera, 
  Trophy,
  Target,
  Award,
  Activity,
  ChevronRight,
  CheckCircle,
  XCircle,
  Shield,
  GraduationCap,
  Building,
  Hash,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Settings,
  LogOut,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal
} from "lucide-react";

type Pengguna = {
  id: string;
  nama: string;
  email: string;
  avatar_url: string | null;
  peran: "admin" | "mahasiswa";
  nim: string | null;
  fakultas: string | null;
  program_studi: string | null;
  jenis_kelamin: "L" | "P" | null;
  tanggal_lahir: string | null;
  alamat: string | null;
  nomor_hp: string | null;
  is_verified: boolean;
  dibuat_pada: string;
};

type Acara = {
  id: string;
  nama: string;
  deskripsi: string | null;
};

type Tim = {
  id: string;
  acara_id: string;
  nama: string;
  jurusan: string | null;
  angkatan: string | null;
  nomor_hp: string | null;
  jumlah_pemain: number;
  status: "aktif" | "gugur";
  dibuat_pada: string;
  acara?: Acara;
  anggota?: {
    id: string;
    nama_pemain: string;
    nim: string | null;
  }[];
};

type Pertandingan = {
  id: string;
  acara_id: string;
  tim_a_id: string;
  tim_b_id: string | null;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  pemenang_id: string | null;
  status: "dijadwalkan" | "berlangsung" | "selesai";
  tanggal_pertandingan: string | null;
  waktu_pertandingan: string | null;
  lokasi_lapangan: string | null;
  acara?: Acara;
  tim_a?: Tim;
  tim_b?: Tim | null;
  pemenang?: Tim | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<Pengguna | null>(null);
  const [userTeams, setUserTeams] = useState<Tim[]>([]);
  const [userMatches, setUserMatches] = useState<Pertandingan[]>([]);
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalMatches: 0,
    wins: 0,
    activeTournaments: 0
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nama: "",
    nim: "",
    fakultas: "",
    program_studi: "",
    jenis_kelamin: "" as "L" | "P" | "",
    tanggal_lahir: "",
    alamat: "",
    nomor_hp: "",
  });
  const [activeTab, setActiveTab] = useState<"overview" | "teams" | "matches" | "achievements">("overview");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) return;

      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from("pengguna")
        .select("*")
        .eq("email", authUser.email)
        .single();

      if (userError) throw userError;
      
      setUser(userData);
      setEditForm({
        nama: userData.nama,
        nim: userData.nim || "",
        fakultas: userData.fakultas || "",
        program_studi: userData.program_studi || "",
        jenis_kelamin: userData.jenis_kelamin || "",
        tanggal_lahir: userData.tanggal_lahir || "",
        alamat: userData.alamat || "",
        nomor_hp: userData.nomor_hp || "",
      });

      // Fetch teams where user is a member (based on NIM)
      if (userData.nim) {
        const { data: teamsData, error: teamsError } = await supabase
          .from("anggota_tim")
          .select(`
            id,
            tim_id,
            nama_pemain,
            nim,
            tim:tim_id (
              id,
              acara_id,
              nama,
              jurusan,
              angkatan,
              nomor_hp,
              jumlah_pemain,
              status,
              dibuat_pada,
              acara:acara_id (
                id,
                nama,
                deskripsi
              )
            )
          `)
          .eq("nim", userData.nim);

        if (!teamsError && teamsData) {
          const teams = teamsData.map(item => ({
            ...item.tim,
            anggota: [{
              id: item.id,
              nama_pemain: item.nama_pemain,
              nim: item.nim
            }]
          }));
          setUserTeams(teams);

          // Calculate stats
          const totalTeams = teams.length;
          const activeTournaments = new Set(teams.map(team => team.acara_id)).size;

          // Fetch matches for user's teams
          const teamIds = teams.map(team => team.id);
          if (teamIds.length > 0) {
            const { data: matchesData, error: matchesError } = await supabase
              .from("pertandingan")
              .select(`
                *,
                acara:acara_id (
                  id,
                  nama,
                  deskripsi
                ),
                tim_a:tim_a_id (
                  id,
                  nama,
                  status
                ),
                tim_b:tim_b_id (
                  id,
                  nama,
                  status
                ),
                pemenang:pemenang_id (
                  id,
                  nama
                )
              `)
              .or(`tim_a_id.in.(${teamIds.join(',')}),tim_b_id.in.(${teamIds.join(',')})`);

            if (!matchesError && matchesData) {
              setUserMatches(matchesData);
              
              // Calculate wins
              const wins = matchesData.filter(match => 
                match.pemenang_id && teamIds.includes(match.pemenang_id)
              ).length;

              setStats({
                totalTeams,
                totalMatches: matchesData.length,
                wins,
                activeTournaments
              });
            }
          }
        }
      }

    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("pengguna")
        .update({
          nama: editForm.nama,
          nim: editForm.nim || null,
          fakultas: editForm.fakultas || null,
          program_studi: editForm.program_studi || null,
          jenis_kelamin: editForm.jenis_kelamin || null,
          tanggal_lahir: editForm.tanggal_lahir || null,
          alamat: editForm.alamat || null,
          nomor_hp: editForm.nomor_hp || null,
        })
        .eq("id", user.id);

      if (error) throw error;
      
      setIsEditing(false);
      fetchUserProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Tidak ditentukan";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const formatDateTime = (date: string | null, time: string | null) => {
    if (!date) return "Tidak dijadwalkan";
    
    const dateObj = new Date(date);
    const day = dateObj.toLocaleDateString("id-ID", { weekday: 'long' });
    const dateFormatted = dateObj.toLocaleDateString("id-ID");
    
    if (!time) return `${day}, ${dateFormatted}`;
    
    return `${day}, ${dateFormatted} • ${time.slice(0, 5)}`;
  };

  const getMatchResult = (match: Pertandingan, teamId: string) => {
    if (match.status !== "selesai") return null;
    
    const isTeamA = match.tim_a_id === teamId;
    const isTeamB = match.tim_b_id === teamId;
    
    if (!isTeamA && !isTeamB) return null;
    
    const isWinner = match.pemenang_id === teamId;
    const scoreA = match.skor_tim_a || 0;
    const scoreB = match.skor_tim_b || 0;
    
    return {
      isWinner,
      score: isTeamA ? `${scoreA}-${scoreB}` : `${scoreB}-${scoreA}`,
      opponent: isTeamA ? match.tim_b?.nama : match.tim_a?.nama
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 -mt-16 relative z-10 shadow-xl">
              <div className="flex items-end gap-6">
                <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700 border-8 border-white dark:border-gray-800"></div>
                <div className="flex-1">
                  <div className="h-8 w-64 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 w-96 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Pengguna tidak ditemukan
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Silakan login untuk melihat profil
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-200">
      <Navigation />
      
      {/* Profile Header */}
      <div className="container mx-auto px-4 py-8">
        {/* Cover Photo */}
        <div className="relative">
          <div className="h-48 md:h-56 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 -mt-16 relative z-10 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-8 border-white dark:border-gray-800 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.nama}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(user.nama)
                  )}
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {user.nama}
                      </h1>
                      {user.is_verified && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Terverifikasi
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                      {user.nim && (
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          <span>{user.nim}</span>
                        </div>
                      )}
                      {user.fakultas && (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          <span>{user.fakultas}</span>
                        </div>
                      )}
                      {user.peran && (
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          <span className="capitalize">{user.peran}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2 transition-all hover:shadow-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profil
                    </button>
                    
                    <button className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium flex items-center gap-2 transition-all">
                      <Settings className="w-4 h-4" />
                      Pengaturan
                    </button>
                  </div>
                </div>
                
                {/* Bio/Status */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <p className="text-gray-700 dark:text-gray-300">
                    {user.peran === "mahasiswa" ? (
                      "Mahasiswa aktif yang aktif dalam berbagai turnamen olahraga kampus. Bergabung untuk kompetisi yang sehat dan prestasi terbaik!"
                    ) : (
                      "Administrator sistem turnamen. Bertanggung jawab mengelola acara, tim, dan pertandingan."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Tim</p>
                <p className="text-3xl font-bold mt-2">{stats.totalTeams}</p>
              </div>
              <Users className="w-10 h-10 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Pertandingan</p>
                <p className="text-3xl font-bold mt-2">{stats.totalMatches}</p>
              </div>
              <Trophy className="w-10 h-10 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Kemenangan</p>
                <p className="text-3xl font-bold mt-2">{stats.wins}</p>
              </div>
              <Award className="w-10 h-10 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Turnamen Aktif</p>
                <p className="text-3xl font-bold mt-2">{stats.activeTournaments}</p>
              </div>
              <Activity className="w-10 h-10 opacity-80" />
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informasi Pribadi
              </h2>
              
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
                    <div className="font-medium text-gray-900 dark:text-white break-all">
                      {user.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Nomor HP</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user.nomor_hp || "Tidak ditentukan"}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Tanggal Lahir</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatDate(user.tanggal_lahir)}
                    </div>
                  </div>
                </div>
                
                {user.jenis_kelamin && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Jenis Kelamin</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Alamat</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user.alamat || "Tidak ditentukan"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Academic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Informasi Akademik
              </h2>
              
              <div className="space-y-5">
                {user.nim && (
                  <div className="flex items-start gap-3">
                    <Hash className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">NIM</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user.nim}
                      </div>
                    </div>
                  </div>
                )}
                
                {user.fakultas && (
                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Fakultas</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user.fakultas}
                      </div>
                    </div>
                  </div>
                )}
                
                {user.program_studi && (
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Program Studi</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user.program_studi}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Aksi Cepat</h2>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Turnamen Saya</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Tim Saya</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Jadwal Pertandingan</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content - Tabs */}
          <div className="lg:col-span-2">
            {/* Tabs Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
                {[
                  { id: "overview", label: "Ringkasan", icon: Activity },
                  { id: "teams", label: "Tim", icon: Users },
                  { id: "matches", label: "Pertandingan", icon: Trophy },
                  { id: "achievements", label: "Prestasi", icon: Award }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${
                        activeTab === tab.id
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "overview" && (
                <>
                  {/* My Teams */}
                  {userTeams.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tim Saya</h3>
                        <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                          Lihat semua
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userTeams.slice(0, 4).map((team) => (
                          <div key={team.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                  {team.nama.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white">{team.nama}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {team.acara?.nama || "Turnamen"}
                                  </p>
                                </div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                team.status === 'aktif' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                                {team.status === 'aktif' ? 'Aktif' : 'Gugur'}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {team.jumlah_pemain} anggota
                              </div>
                              <div>
                                {team.jurusan || "Tidak ditentukan"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Upcoming Matches */}
                  {userMatches.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pertandingan Mendatang</h3>
                        <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                          Lihat semua
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {userMatches
                          .filter(match => match.status === "dijadwalkan" && match.tanggal_pertandingan)
                          .slice(0, 3)
                          .map((match) => {
                            const userTeamId = userTeams.find(team => 
                              team.id === match.tim_a_id || team.id === match.tim_b_id
                            )?.id;
                            
                            const userTeam = userTeamId === match.tim_a_id ? match.tim_a : match.tim_b;
                            const opponent = userTeamId === match.tim_a_id ? match.tim_b : match.tim_a;
                            
                            return (
                              <div key={match.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <Target className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      {match.acara?.nama}
                                    </span>
                                  </div>
                                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                                    Dijadwalkan
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-center gap-6 mb-3">
                                  <div className="text-center">
                                    <div className="font-bold text-lg text-gray-900 dark:text-white">
                                      {userTeam?.nama}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Tim Anda</div>
                                  </div>
                                  
                                  <div className="text-gray-400 dark:text-gray-500">VS</div>
                                  
                                  <div className="text-center">
                                    <div className="font-bold text-lg text-gray-900 dark:text-white">
                                      {opponent?.nama || "BYE"}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Lawan</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {formatDateTime(match.tanggal_pertandingan, match.waktu_pertandingan)}
                                  </div>
                                  {match.lokasi_lapangan && (
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4" />
                                      {match.lokasi_lapangan}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {activeTab === "teams" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Semua Tim Saya</h3>
                  
                  {userTeams.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Anda belum bergabung dengan tim</p>
                      <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                        Cari Tim
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userTeams.map((team) => (
                        <div key={team.id} className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                                {team.nama.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{team.nama}</h4>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                  {team.acara?.nama && (
                                    <span className="flex items-center gap-1">
                                      <Trophy className="w-4 h-4" />
                                      {team.acara.nama}
                                    </span>
                                  )}
                                  {team.jurusan && (
                                    <span>{team.jurusan}</span>
                                  )}
                                  {team.angkatan && (
                                    <span>Angkatan {team.angkatan}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                team.status === 'aktif' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                                {team.status === 'aktif' ? 'Aktif' : 'Gugur'}
                              </span>
                              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                                Detail
                              </button>
                            </div>
                          </div>
                          
                          {/* Team Members */}
                          {team.anggota && team.anggota.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Anggota Tim</h5>
                              <div className="flex flex-wrap gap-2">
                                {team.anggota.map((anggota) => (
                                  <div key={anggota.id} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <div className="text-sm text-gray-900 dark:text-white">{anggota.nama_pemain}</div>
                                    {anggota.nim && (
                                      <div className="text-xs text-gray-600 dark:text-gray-400">NIM: {anggota.nim}</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {team.jumlah_pemain} anggota
                              </div>
                              {team.nomor_hp && (
                                <div className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {team.nomor_hp}
                                </div>
                              )}
                            </div>
                            <div>
                              Bergabung: {new Date(team.dibuat_pada).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "matches" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Riwayat Pertandingan</h3>
                    <div className="flex gap-2">
                      <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent">
                        <option>Semua Status</option>
                        <option>Dijadwalkan</option>
                        <option>Berlangsung</option>
                        <option>Selesai</option>
                      </select>
                      <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent">
                        <option>Turnamen Terbaru</option>
                        <option>Turnamen Lama</option>
                      </select>
                    </div>
                  </div>
                  
                  {userMatches.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Belum ada riwayat pertandingan</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userMatches.map((match) => {
                        const userTeamId = userTeams.find(team => 
                          team.id === match.tim_a_id || team.id === match.tim_b_id
                        )?.id;
                        
                        const userTeam = userTeamId === match.tim_a_id ? match.tim_a : match.tim_b;
                        const opponent = userTeamId === match.tim_a_id ? match.tim_b : match.tim_a;
                        const result = userTeamId ? getMatchResult(match, userTeamId) : null;
                        
                        return (
                          <div key={match.id} className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <Trophy className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {match.acara?.nama}
                                </span>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                match.status === 'selesai' 
                                  ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                  : match.status === 'berlangsung'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              }`}>
                                {match.status === 'selesai' ? 'Selesai' : 
                                 match.status === 'berlangsung' ? 'Berlangsung' : 'Dijadwalkan'}
                              </span>
                            </div>
                            
                            <div className="flex flex-col md:flex-row md:items-center justify-center gap-6 mb-4">
                              <div className="text-center flex-1">
                                <div className="font-bold text-2xl text-gray-900 dark:text-white mb-1">
                                  {userTeam?.nama}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Tim Anda</div>
                                {result && (
                                  <div className={`mt-2 text-lg font-bold ${
                                    result.isWinner 
                                      ? 'text-green-600 dark:text-green-400' 
                                      : 'text-red-600 dark:text-red-400'
                                  }`}>
                                    {result.score}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex flex-col items-center">
                                <div className="text-3xl font-bold text-gray-400 dark:text-gray-500">VS</div>
                                {match.status === 'selesai' && (
                                  <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                                    result?.isWinner 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                  }`}>
                                    {result?.isWinner ? 'MENANG' : 'KALAH'}
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-center flex-1">
                                <div className="font-bold text-2xl text-gray-900 dark:text-white mb-1">
                                  {opponent?.nama || "BYE"}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {opponent ? 'Lawan' : 'Walkover'}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-4">
                                {match.tanggal_pertandingan && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {formatDateTime(match.tanggal_pertandingan, match.waktu_pertandingan)}
                                  </div>
                                )}
                                {match.lokasi_lapangan && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {match.lokasi_lapangan}
                                  </div>
                                )}
                              </div>
                              
                              {match.status === 'selesai' && result && (
                                <div className="text-sm">
                                  {result.isWinner ? '🎉 Kemenangan!' : '💪 Tetap semangat!'}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "achievements" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Prestasi & Statistik</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Win Rate */}
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900 dark:text-white">Win Rate</h4>
                        <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-center mb-4">
                        <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                          {stats.totalMatches > 0 
                            ? Math.round((stats.wins / stats.totalMatches) * 100) 
                            : 0}%
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          {stats.wins} menang dari {stats.totalMatches} pertandingan
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                          style={{ width: `${stats.totalMatches > 0 ? (stats.wins / stats.totalMatches) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Tournament Participation */}
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900 dark:text-white">Partisipasi Turnamen</h4>
                        <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-center mb-4">
                        <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                          {stats.activeTournaments}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Turnamen aktif diikuti
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Aktif dalam {userTeams.length} tim
                      </div>
                    </div>
                    
                    {/* Recent Achievements */}
                    <div className="md:col-span-2 p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900 dark:text-white">Prestasi Terbaru</h4>
                        <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      
                      <div className="space-y-4">
                        {userMatches
                          .filter(match => {
                            const userTeamId = userTeams.find(team => 
                              team.id === match.tim_a_id || team.id === match.tim_b_id
                            )?.id;
                            return match.pemenang_id === userTeamId;
                          })
                          .slice(0, 3)
                          .map((match, idx) => (
                            <div key={match.id} className="flex items-center gap-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white">
                                  Menang melawan {match.tim_a?.id === match.pemenang_id ? match.tim_b?.nama : match.tim_a?.nama}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {match.acara?.nama} • {formatDate(match.tanggal_pertandingan)}
                                </div>
                              </div>
                              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                {match.skor_tim_a || 0}-{match.skor_tim_b || 0}
                              </div>
                            </div>
                          ))}
                        
                        {userMatches.filter(match => match.pemenang_id && 
                          userTeams.some(team => team.id === match.pemenang_id)).length === 0 && (
                          <div className="text-center py-4">
                            <p className="text-gray-600 dark:text-gray-400">
                              Belum ada prestasi kemenangan
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profil</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(editForm.nama)}
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium">
                      Ubah Foto Profil
                    </button>
                  </div>
                </div>
                
                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      value={editForm.nama}
                      onChange={(e) => setEditForm({...editForm, nama: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      NIM
                    </label>
                    <input
                      type="text"
                      value={editForm.nim}
                      onChange={(e) => setEditForm({...editForm, nim: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fakultas
                    </label>
                    <input
                      type="text"
                      value={editForm.fakultas}
                      onChange={(e) => setEditForm({...editForm, fakultas: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Program Studi
                    </label>
                    <input
                      type="text"
                      value={editForm.program_studi}
                      onChange={(e) => setEditForm({...editForm, program_studi: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Jenis Kelamin
                    </label>
                    <select
                      value={editForm.jenis_kelamin}
                      onChange={(e) => setEditForm({...editForm, jenis_kelamin: e.target.value as "L" | "P"})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Pilih...</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={editForm.tanggal_lahir}
                      onChange={(e) => setEditForm({...editForm, tanggal_lahir: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nomor HP
                    </label>
                    <input
                      type="tel"
                      value={editForm.nomor_hp}
                      onChange={(e) => setEditForm({...editForm, nomor_hp: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alamat
                    </label>
                    <textarea
                      value={editForm.alamat}
                      onChange={(e) => setEditForm({...editForm, alamat: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}