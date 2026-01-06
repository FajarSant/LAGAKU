import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Acara, PlayerSearchResult, TeamMemberForm, TeamRegistrationData } from "@/utils";

export const useTeamRegistration = () => {
  const supabase = createClient();

  // States
  const [loading, setLoading] = useState(false);
  const [loadingAcara, setLoadingAcara] = useState(true);
  const [searchingPlayers, setSearchingPlayers] = useState(false);
  const [playerSearch, setPlayerSearch] = useState("");
  
  // Data States
  const [formData, setFormData] = useState<TeamRegistrationData>({
    nama: "",
    jurusan: "",
    angkatan: "",
    nomor_hp: "",
    acara_id: "",
  });

  const [anggotaTim, setAnggotaTim] = useState<TeamMemberForm[]>([]);
  const [acaraList, setAcaraList] = useState<Acara[]>([]);
  const [selectedAcara, setSelectedAcara] = useState<Acara | null>(null);
  const [searchResults, setSearchResults] = useState<PlayerSearchResult[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCaptain, setIsCaptain] = useState(true);
  const [teamNames, setTeamNames] = useState<Set<string>>(new Set());

  // Fetch initial data
  useEffect(() => {
    fetchUserData();
    fetchAcaraList();
  }, []);

  // Search players effect
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (playerSearch.length >= 3) {
        searchPlayers();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [playerSearch]);

  // Check team name availability
  useEffect(() => {
    if (formData.acara_id && formData.nama) {
      checkTeamNameAvailability();
    }
  }, [formData.acara_id, formData.nama]);

  // Functions
  const fetchUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        toast.error("Silakan login terlebih dahulu");
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

  const checkTeamNameAvailability = async (): Promise<boolean> => {
    if (!formData.acara_id || !formData.nama.trim()) return true;

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

      setSearchResults(filteredData as PlayerSearchResult[]);
    } catch (error) {
      console.error("Error searching players:", error);
      toast.error("Gagal mencari pemain");
    } finally {
      setSearchingPlayers(false);
    }
  };

  const updateFormData = useCallback((data: Partial<TeamRegistrationData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const toggleCaptainStatus = useCallback((checked: boolean) => {
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
  }, [currentUser, anggotaTim]);

  const addPlayer = useCallback((player: PlayerSearchResult) => {
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
  }, [selectedAcara, anggotaTim]);

  const removePlayer = useCallback((nim: string) => {
    // Prevent removing yourself if you're the captain
    if (isCaptain && nim === currentUser?.nim) {
      toast.error("Anda sebagai ketua tim tidak dapat dihapus");
      return;
    }
    
    setAnggotaTim(prev => prev.filter(a => a.nim !== nim));
    toast.info("Pemain dihapus dari tim");
  }, [isCaptain, currentUser]);

  const updatePlayerInfo = useCallback((index: number, field: keyof TeamMemberForm, value: string) => {
    setAnggotaTim(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const validateStep1 = async (): Promise<boolean> => {
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
    return isAvailable;
  };

  const validateStep2 = (): boolean => {
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

  const handleSubmit = async (): Promise<boolean> => {
    try {
      setLoading(true);

      // Final validation
      if (!(await validateStep1()) || !validateStep2()) {
        setLoading(false);
        return false;
      }

      // Check authentication
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        toast.error("Sesi telah berakhir, silakan login kembali");
        return false;
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
        if (timError.code === '23505') {
          toast.error("Nama tim sudah digunakan dalam kompetisi ini");
        } else {
          throw timError;
        }
        return false;
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

      return true;
    } catch (error: any) {
      console.error("Error registering team:", error);
      
      // Menggunakan string biasa daripada JSX untuk toast error
      const errorMessage = error.message || "Silakan coba lagi.";
      toast.error(`Gagal mendaftarkan tim: ${errorMessage}`);
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    formData,
    anggotaTim,
    loading,
    loadingAcara,
    acaraList,
    selectedAcara,
    currentUser,
    isCaptain,
    searchResults,
    searchingPlayers,
    playerSearch,
    
    // Setters
    setPlayerSearch,
    setSelectedAcara,
    setAnggotaTim,
    
    // Functions
    updateFormData,
    toggleCaptainStatus,
    addPlayer,
    removePlayer,
    updatePlayerInfo,
    validateStep1,
    validateStep2,
    handleSubmit
  };
};