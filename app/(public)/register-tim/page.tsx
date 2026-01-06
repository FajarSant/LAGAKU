"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

// Icons
import { 
  Plus, 
  Users, 
  Trophy, 
  Calendar, 
  ArrowLeft,
  UserPlus,
  Shield,
  Search,
  X,
  GraduationCap,
  Phone,
  Building
} from "lucide-react";

// Components
import Navigation from "@/components/navigation/navigation";

// Types
interface Acara {
  id: string;
  nama: string;
  deskripsi: string;
  dibuat_pada: string;
}

interface Tim {
  id: string;
  acara_id: string;
  nama: string;
  jurusan: string;
  angkatan: string;
  nomor_hp: string;
  jumlah_pemain: number;
  status: 'aktif' | 'gugur';
  dibuat_pada: string;
}

interface Pengguna {
  id: string;
  nama: string;
  email: string;
  nim: string;
  fakultas: string;
  program_studi: string;
  jenis_kelamin: 'L' | 'P';
  nomor_hp: string;
}

interface AnggotaTimForm {
  id?: string;
  tim_id?: string;
  nama_pemain: string;
  nim: string;
}

export default function RegisterTeamPage() {
  const router = useRouter();
  const supabase = createClient();

  // States
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingAcara, setLoadingAcara] = useState(true);
  const [searchingPlayers, setSearchingPlayers] = useState(false);
  const [isCaptain, setIsCaptain] = useState(true);
  
  // Form Data
  const [formData, setFormData] = useState({
    nama: "",
    jurusan: "",
    angkatan: "",
    nomor_hp: "",
    acara_id: "",
  });

  // Data
  const [acaraList, setAcaraList] = useState<Acara[]>([]);
  const [selectedAcara, setSelectedAcara] = useState<Acara | null>(null);
  const [anggotaTim, setAnggotaTim] = useState<AnggotaTimForm[]>([]);
  const [playerSearch, setPlayerSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Pengguna[]>([]);
  const [currentUser, setCurrentUser] = useState<Pengguna | null>(null);
  const [teamNames, setTeamNames] = useState<Set<string>>(new Set());

  // Fetch user data and events on mount
  useEffect(() => {
    fetchUserData();
    fetchAcaraList();
  }, []);

  // Search players
  useEffect(() => {
    if (playerSearch.length >= 3) {
      searchPlayers();
    } else {
      setSearchResults([]);
    }
  }, [playerSearch]);

  // Check team name uniqueness when event is selected
  useEffect(() => {
    if (formData.acara_id && formData.nama) {
      checkTeamNameAvailability();
    }
  }, [formData.acara_id, formData.nama]);

  const fetchUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        toast.error("Silakan login terlebih dahulu");
        router.push("/login");
        return;
      }

      const { data: userData, error } = await supabase
        .from("pengguna")
        .select("id, nama, email, nim, fakultas, program_studi, jenis_kelamin, nomor_hp")
        .eq("email", authUser.email)
        .single();

      if (error) throw error;

      if (userData) {
        setCurrentUser(userData);
        
        // Pre-fill form with user data
        setFormData(prev => ({
          ...prev,
          jurusan: userData.program_studi || "",
          nomor_hp: userData.nomor_hp || ""
        }));

        // Add user as team member if they choose to be player
        if (isCaptain) {
          setAnggotaTim([{
            nama_pemain: userData.nama,
            nim: userData.nim
          }]);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Gagal memuat data pengguna");
    }
  };

  const fetchAcaraList = async () => {
    try {
      setLoadingAcara(true);
      const { data, error } = await supabase
        .from("acara")
        .select("id, nama, deskripsi, dibuat_pada")
        .order("dibuat_pada", { ascending: false });

      if (error) throw error;

      setAcaraList(data || []);

      // Pre-fetch existing team names for validation
      fetchExistingTeamNames(data?.map(a => a.id) || []);
    } catch (error) {
      console.error("Error fetching acara list:", error);
      toast.error("Gagal memuat daftar kompetisi");
    } finally {
      setLoadingAcara(false);
    }
  };

  const fetchExistingTeamNames = async (acaraIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from("tim")
        .select("acara_id, nama")
        .in("acara_id", acaraIds);

      if (error) throw error;

      const names = new Set(data?.map(team => `${team.acara_id}-${team.nama}`));
      setTeamNames(names);
    } catch (error) {
      console.error("Error fetching team names:", error);
    }
  };

  const checkTeamNameAvailability = async () => {
    if (!formData.acara_id || !formData.nama.trim()) return;

    const key = `${formData.acara_id}-${formData.nama}`;
    if (teamNames.has(key)) {
      toast.error("Nama tim sudah digunakan dalam kompetisi ini");
      return false;
    }
    return true;
  };

  const searchPlayers = async () => {
    try {
      setSearchingPlayers(true);
      const { data, error } = await supabase
        .from("pengguna")
        .select("id, nama, email, nim, fakultas, program_studi, jenis_kelamin")
        .or(`nama.ilike.%${playerSearch}%,nim.ilike.%${playerSearch}%,email.ilike.%${playerSearch}%`)
        .limit(10);

      if (error) throw error;

      // Filter out players already in team and current user
      const existingNims = anggotaTim.map(a => a.nim);
      const filteredData = data?.filter(player => 
        !existingNims.includes(player.nim) && 
        player.nim !== currentUser?.nim
      ) || [];

      setSearchResults(filteredData as Pengguna[]);
    } catch (error) {
      console.error("Error searching players:", error);
      toast.error("Gagal mencari pemain");
    } finally {
      setSearchingPlayers(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAcaraSelect = (value: string) => {
    setFormData(prev => ({
      ...prev,
      acara_id: value
    }));
    
    const selected = acaraList.find(acara => acara.id === value);
    setSelectedAcara(selected || null);
  };

  const toggleCaptainStatus = (checked: boolean) => {
    setIsCaptain(checked);
    
    if (checked && currentUser) {
      // Add user as team member if not already present
      if (!anggotaTim.some(a => a.nim === currentUser.nim)) {
        setAnggotaTim(prev => [...prev, {
          nama_pemain: currentUser.nama,
          nim: currentUser.nim
        }]);
      }
    } else {
      // Remove user from team members
      setAnggotaTim(prev => prev.filter(a => a.nim !== currentUser?.nim));
    }
  };

  const addPlayer = (player: Pengguna) => {
    if (!selectedAcara) {
      toast.error("Pilih kompetisi terlebih dahulu");
      return;
    }

    if (anggotaTim.some(a => a.nim === player.nim)) {
      toast.error("Pemain sudah ada dalam tim");
      return;
    }

    setAnggotaTim(prev => [...prev, {
      nama_pemain: player.nama,
      nim: player.nim
    }]);

    setPlayerSearch("");
    setSearchResults([]);
    toast.success(`${player.nama} ditambahkan ke tim`);
  };

  const removePlayer = (nim: string) => {
    // Prevent removing yourself if you're the captain
    if (isCaptain && nim === currentUser?.nim) {
      toast.error("Anda sebagai ketua tim tidak dapat dihapus");
      return;
    }
    
    setAnggotaTim(prev => prev.filter(a => a.nim !== nim));
    toast.info("Pemain dihapus dari tim");
  };

  const updatePlayerInfo = (index: number, field: keyof AnggotaTimForm, value: string) => {
    setAnggotaTim(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const validateStep1 = async () => {
    // Basic validations
    if (!formData.nama.trim()) {
      toast.error("Nama tim harus diisi");
      return false;
    }

    if (!formData.acara_id) {
      toast.error("Pilih kompetisi terlebih dahulu");
      return false;
    }

    if (!formData.jurusan.trim()) {
      toast.error("Jurusan harus diisi");
      return false;
    }

    if (!formData.angkatan.trim()) {
      toast.error("Angkatan harus diisi");
      return false;
    }

    if (!formData.nomor_hp.trim()) {
      toast.error("Nomor HP harus diisi");
      return false;
    }

    // Check team name uniqueness
    const isAvailable = await checkTeamNameAvailability();
    if (!isAvailable) return false;

    return true;
  };

  const validateStep2 = () => {
    if (anggotaTim.length === 0) {
      toast.error("Tim harus memiliki minimal 1 anggota");
      return false;
    }

    // Validate each player
    for (const anggota of anggotaTim) {
      if (!anggota.nama_pemain.trim()) {
        toast.error("Nama pemain harus diisi");
        return false;
      }
      if (!anggota.nim.trim()) {
        toast.error("NIM pemain harus diisi");
        return false;
      }
    }

    return true;
  };

  const nextStep = async () => {
    if (step === 1 && !(await validateStep1())) return;
    if (step === 2 && !validateStep2()) return;
    
    setStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Final validation
      if (!(await validateStep1()) || !validateStep2()) {
        setLoading(false);
        return;
      }

      // Check authentication
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        toast.error("Sesi telah berakhir, silakan login kembali");
        router.push("/login");
        return;
      }

      // 1. Create team
      const { data: timData, error: timError } = await supabase
        .from("tim")
        .insert({
          acara_id: formData.acara_id,
          nama: formData.nama,
          jurusan: formData.jurusan,
          angkatan: formData.angkatan,
          nomor_hp: formData.nomor_hp,
          jumlah_pemain: anggotaTim.length,
          status: 'aktif'
        })
        .select()
        .single();

      if (timError) {
        if (timError.code === '23505') { // Unique violation
          toast.error("Nama tim sudah digunakan dalam kompetisi ini");
        } else {
          throw timError;
        }
        return;
      }

      // 2. Create team members
      const anggotaData = anggotaTim.map(anggota => ({
        tim_id: timData.id,
        nama_pemain: anggota.nama_pemain,
        nim: anggota.nim
      }));

      const { error: anggotaError } = await supabase
        .from("anggota_tim")
        .insert(anggotaData);

      if (anggotaError) throw anggotaError;

      toast.success(
        <div className="space-y-2">
          <p className="font-semibold">Tim berhasil didaftarkan!</p>
          <p className="text-sm">Tim {formData.nama} sekarang dapat berpartisipasi dalam kompetisi.</p>
        </div>
      );
      
      // Redirect to team detail or profile page
      setTimeout(() => {
        router.push(`/teams/${timData.id}`);
      }, 2000);
      
    } catch (error: any) {
      console.error("Error registering team:", error);
      toast.error(
        <div className="space-y-1">
          <p className="font-semibold">Gagal mendaftarkan tim</p>
          <p className="text-sm">{error.message || "Silakan coba lagi."}</p>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < step) return "complete";
    if (stepNumber === step) return "current";
    return "upcoming";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:bg-linear-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4 gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => router.push("/profile")}
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Profil
          </Button>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-xl mb-2">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pendaftaran Tim Baru
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Daftarkan tim Anda untuk berpartisipasi dalam kompetisi
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center flex-1">
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  getStepStatus(stepNumber) === 'complete' 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                    : getStepStatus(stepNumber) === 'current'
                    ? 'bg-blue-500 text-white ring-4 ring-blue-500/30 shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {getStepStatus(stepNumber) === 'complete' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="font-semibold">{stepNumber}</span>
                  )}
                </div>
                {stepNumber < 3 && (
                  <div className={`flex-1 h-1 mx-4 transition-all ${
                    getStepStatus(stepNumber + 1) === 'complete' || step > stepNumber
                      ? 'bg-green-500' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className={`transition-colors ${step >= 1 ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`}>
              Informasi Tim
            </span>
            <span className={`transition-colors ${step >= 2 ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`}>
              Anggota Tim
            </span>
            <span className={`transition-colors ${step >= 3 ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`}>
              Konfirmasi
            </span>
          </div>
        </div>

        {/* Main Form */}
        <Card className="border shadow-xl overflow-hidden">
          <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-blue-500 to-purple-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {step === 1 && "Informasi Dasar Tim"}
                  {step === 2 && "Anggota Tim"}
                  {step === 3 && "Konfirmasi Pendaftaran"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Isi data tim Anda dengan lengkap"}
                  {step === 2 && "Tambahkan anggota tim"}
                  {step === 3 && "Tinjau ulang data sebelum mendaftar"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Step 1: Team Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nama" className="flex items-center gap-2">
                      <span className="text-red-500">*</span>
                      Nama Tim
                    </Label>
                    <Input
                      id="nama"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      placeholder="Contoh: The Champions 2024"
                      className="h-12"
                      required
                    />
                    {formData.nama && selectedAcara && (
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Nama tim tersedia
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="acara_id" className="flex items-center gap-2">
                      <span className="text-red-500">*</span>
                      Kompetisi
                    </Label>
                    <Select
                      value={formData.acara_id}
                      onValueChange={handleAcaraSelect}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Pilih kompetisi yang akan diikuti" />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingAcara ? (
                          <div className="py-4 text-center text-gray-500">
                            Memuat daftar kompetisi...
                          </div>
                        ) : acaraList.length === 0 ? (
                          <div className="py-4 text-center text-gray-500">
                            Tidak ada kompetisi tersedia
                          </div>
                        ) : (
                          acaraList.map((acara) => (
                            <SelectItem key={acara.id} value={acara.id}>
                              <div className="flex flex-col py-1">
                                <span className="font-medium">{acara.nama}</span>
                                {acara.deskripsi && (
                                  <span className="text-xs text-gray-500 truncate">
                                    {acara.deskripsi}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jurusan" className="flex items-center gap-2">
                        <span className="text-red-500">*</span>
                        <GraduationCap className="h-4 w-4" />
                        Jurusan
                      </Label>
                      <Input
                        id="jurusan"
                        name="jurusan"
                        value={formData.jurusan}
                        onChange={handleInputChange}
                        placeholder="Contoh: Teknik Informatika"
                        className="h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="angkatan" className="flex items-center gap-2">
                        <span className="text-red-500">*</span>
                        Angkatan
                      </Label>
                      <Input
                        id="angkatan"
                        name="angkatan"
                        value={formData.angkatan}
                        onChange={handleInputChange}
                        placeholder="Contoh: 2024"
                        className="h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nomor_hp" className="flex items-center gap-2">
                      <span className="text-red-500">*</span>
                      <Phone className="h-4 w-4" />
                      Nomor HP (Ketua Tim)
                    </Label>
                    <Input
                      id="nomor_hp"
                      name="nomor_hp"
                      value={formData.nomor_hp}
                      onChange={handleInputChange}
                      placeholder="0812-3456-7890"
                      className="h-12"
                      required
                    />
                  </div>
                </div>

                {selectedAcara && (
                  <Alert className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <Trophy className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                          {selectedAcara.nama}
                        </h4>
                        {selectedAcara.deskripsi && (
                          <p className="text-blue-700 dark:text-blue-400 text-sm mb-2">
                            {selectedAcara.deskripsi}
                          </p>
                        )}
                        <p className="text-xs text-blue-600 dark:text-blue-500">
                          Didirikan: {new Date(selectedAcara.dibuat_pada).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </Alert>
                )}
              </div>
            )}

            {/* Step 2: Team Members */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-lg font-semibold">Anggota Tim</Label>
                      <p className="text-sm text-gray-500 mt-1">
                        Tambahkan anggota tim Anda ({anggotaTim.length} anggota)
                      </p>
                    </div>
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      {anggotaTim.length} Anggota
                    </Badge>
                  </div>

                  {/* Captain toggle */}
                  {currentUser && (
                    <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Checkbox
                        id="is_captain"
                        checked={isCaptain}
                        onCheckedChange={toggleCaptainStatus}
                      />
                      <Label htmlFor="is_captain" className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{currentUser.nama}</span>
                          <Badge variant="secondary" className="text-xs">
                            {currentUser.nim}
                          </Badge>
                          <span className="text-gray-600 dark:text-gray-400">
                            (Saya akan menjadi bagian dari tim)
                          </span>
                        </div>
                      </Label>
                    </div>
                  )}

                  {/* Search Players */}
                  <div className="space-y-3">
                    <Label>Cari Anggota dari Database</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        placeholder="Cari berdasarkan NIM, nama, atau email..."
                        value={playerSearch}
                        onChange={(e) => setPlayerSearch(e.target.value)}
                        className="h-12 pl-10"
                      />
                      {playerSearch && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                          onClick={() => {
                            setPlayerSearch("");
                            setSearchResults([]);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Search Results */}
                    {searchingPlayers && (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Mencari pemain...</p>
                      </div>
                    )}

                    {searchResults.length > 0 && (
                      <Card className="border shadow-sm">
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm">Hasil Pencarian</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="max-h-60 overflow-y-auto">
                            {searchResults.map((player) => (
                              <div
                                key={player.nim}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border-b last:border-b-0"
                                onClick={() => addPlayer(player)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                                      {player.nama.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium">{player.nama}</p>
                                    <p className="text-sm text-gray-500">
                                      {player.nim} • {player.program_studi}
                                    </p>
                                  </div>
                                </div>
                                <Button size="sm" variant="ghost" className="text-blue-600">
                                  <UserPlus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Manual Entry */}
                  <div className="space-y-3">
                    <Label>Tambah Anggota Manual</Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 border-dashed"
                      onClick={() => setAnggotaTim(prev => [...prev, { nama_pemain: "", nim: "" }])}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Anggota Baru
                    </Button>
                  </div>

                  {/* Current Team Members */}
                  {anggotaTim.length > 0 && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {anggotaTim.map((anggota, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-lg border ${
                                isCaptain && anggota.nim === currentUser?.nim
                                  ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="w-10 h-10 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                                    <span className="font-semibold text-gray-600 dark:text-gray-300">
                                      {index + 1}
                                    </span>
                                  </div>
                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <Label className="text-xs">Nama Lengkap</Label>
                                      <Input
                                        value={anggota.nama_pemain}
                                        onChange={(e) => updatePlayerInfo(index, 'nama_pemain', e.target.value)}
                                        placeholder="Nama pemain"
                                        className="h-9"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs">NIM</Label>
                                      <Input
                                        value={anggota.nim}
                                        onChange={(e) => updatePlayerInfo(index, 'nim', e.target.value)}
                                        placeholder="Nomor Induk Mahasiswa"
                                        className="h-9"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => removePlayer(anggota.nim)}
                                  className={`ml-3 ${
                                    isCaptain && anggota.nim === currentUser?.nim
                                      ? 'hidden'
                                      : ''
                                  }`}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              {isCaptain && anggota.nim === currentUser?.nim && (
                                <div className="flex items-center gap-2 mt-3 text-sm text-blue-600 dark:text-blue-400">
                                  <Shield className="h-4 w-4" />
                                  <span>Ketua Tim</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Alert className="bg-linear-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
                  <AlertDescription className="text-amber-800 dark:text-amber-300">
                    <strong>Catatan:</strong> Pastikan data anggota tim sudah benar. 
                    Setelah terdaftar, anggota tidak dapat diubah.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-6">
                <Card className="bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Ringkasan Pendaftaran</CardTitle>
                      <Badge className="bg-linear-to-r from-green-500 to-emerald-500 text-white">
                        Siap Daftar
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Team Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-lg border-b pb-2">
                        Informasi Tim
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Nama Tim</p>
                            <p className="font-semibold text-lg">{formData.nama}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Jurusan</p>
                            <p className="font-medium">{formData.jurusan}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Angkatan</p>
                            <p className="font-medium">{formData.angkatan}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Nomor HP</p>
                            <p className="font-medium">{formData.nomor_hp}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Event Info */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-lg">Kompetisi</h3>
                      {selectedAcara && (
                        <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            <div>
                              <p className="font-bold">{selectedAcara.nama}</p>
                              {selectedAcara.deskripsi && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {selectedAcara.deskripsi}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Team Members */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-lg">
                          Anggota Tim ({anggotaTim.length})
                        </h3>
                        <Badge variant="outline">
                          {anggotaTim.length} Pemain
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {anggotaTim.map((anggota, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border ${
                              isCaptain && anggota.nim === currentUser?.nim
                                ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                                <span className="font-semibold">
                                  {anggota.nama_pemain.charAt(0)}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{anggota.nama_pemain}</p>
                                  {isCaptain && anggota.nim === currentUser?.nim && (
                                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-0">
                                      Ketua
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{anggota.nim}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Alert className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                  <AlertDescription className="text-green-800 dark:text-green-300">
                    <strong className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Data sudah lengkap!
                    </strong>
                    <p className="mt-1">Klik "Daftarkan Tim" untuk menyelesaikan pendaftaran.</p>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-between w-full">
              <div>
                {step > 1 && (
                  <Button 
                    variant="outline" 
                    onClick={prevStep} 
                    disabled={loading}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                  </Button>
                )}
              </div>
              
              <div className="flex gap-3">
                {step < 3 ? (
                  <Button 
                    onClick={nextStep} 
                    className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {step === 2 ? 'Konfirmasi' : 'Lanjut'}
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/25"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Mendaftarkan...
                      </>
                    ) : (
                      <>
                        <Trophy className="h-4 w-4" />
                        Daftarkan Tim
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Help Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold">Ketua Tim</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Ketua tim otomatis terdaftar sebagai anggota dan menjadi kontak utama
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-100 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold">Verifikasi Data</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Pastikan NIM dan nama sesuai dengan data akademik
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-100 dark:border-emerald-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-lg">
                  <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold">Kontak Aktif</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Nomor HP digunakan untuk notifikasi dan komunikasi penting
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Butuh bantuan?{" "}
            <Link href="/help" className="text-blue-600 dark:text-blue-400 hover:underline">
              Hubungi admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}