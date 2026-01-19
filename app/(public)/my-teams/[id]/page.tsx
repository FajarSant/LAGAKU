"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { XCircle, Loader2, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Navigation from "@/components/navigation/navigation";
import Footer from "@/components/public/Footer";
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
import {
  TeamDetailHeader,
  TeamStatsCards,
  TeamInfoCard,
  TeamMembersCard,
  QuickActionsCard,
  PerformanceStatsCard,
  TeamDetailsCard,
  ManageTeamModal
} from "@/components/public/teams/manage-tim";

// Import types - perlu diupdate sesuai tabel
interface TeamMember {
  id?: string;
  tim_id: string;
  nama_pemain: string;
  nim?: string;
  dibuat_pada?: string;
}

interface TeamData {
  id: string;
  nama: string;
  status: string;
  acara_id?: string;
  jurusan?: string;
  angkatan?: string;
  nomor_hp?: string;
  jumlah_pemain: number;
  dibuat_pada: string;
  anggota_tim?: TeamMember[];
  acara?: {
    id: string;
    nama: string;
    deskripsi?: string;
  };
  _count?: {
    anggota_tim: number;
    pertandingan: number;
  };
}

interface UserData {
  id: string;
  nama: string;
  email: string;
  nim?: string;
  jurusan?: string;
  angkatan?: string;
}

// Type untuk form
interface TeamFormData {
  nama: string;
  status: string;
  jurusan: string;
  angkatan: string;
  nomor_hp: string;
  acara_id: string;
}

export default function TeamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  
  const teamId = params?.id as string;
  
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<'ketua' | 'anggota' | 'non-anggota'>('non-anggota');

  const [formData, setFormData] = useState<TeamFormData>({
    nama: "",
    status: "aktif",
    jurusan: "",
    angkatan: "",
    nomor_hp: "",
    acara_id: "",
  });
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [newMember, setNewMember] = useState<TeamMember>({
    tim_id: teamId,
    nama_pemain: "",
    nim: ""
  });

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("pengguna")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setCurrentUser({
          id: profile.id,
          nama: profile.nama || user.email?.split('@')[0] || 'User',
          email: profile.email || user.email || '',
          nim: profile.nim,
          jurusan: profile.jurusan,
          angkatan: profile.angkatan
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Fetch team details sesuai dengan struktur tabel
  const fetchTeamDetails = async () => {
    if (!teamId) {
      setError("ID Tim tidak ditemukan");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch team data sesuai struktur tabel
      const { data: teamData, error: teamError } = await supabase
        .from("tim")
        .select(`
          *,
          anggota_tim (*),
          acara:acara_id (id, nama, deskripsi)
        `)
        .eq("id", teamId)
        .single();

      if (teamError) throw teamError;
      if (!teamData) throw new Error("Tim tidak ditemukan");

      // Fetch match count
      const { count: matchCount } = await supabase
        .from("pertandingan")
        .select("*", { count: 'exact', head: true })
        .or(`tim_a_id.eq.${teamId},tim_b_id.eq.${teamId}`);

      const teamWithDetails: TeamData = {
        ...teamData,
        anggota_tim: teamData.anggota_tim || [],
        _count: {
          anggota_tim: teamData.anggota_tim?.length || 0,
          pertandingan: matchCount || 0
        }
      };

      setTeam(teamWithDetails);
      setMembers(teamData.anggota_tim || []);
      
      // Set form data
      setFormData({
        nama: teamData.nama || "",
        status: teamData.status || "aktif",
        jurusan: teamData.jurusan || "",
        angkatan: teamData.angkatan || "",
        nomor_hp: teamData.nomor_hp || "",
        acara_id: teamData.acara_id || ""
      });

      // Determine user role - berdasarkan nama atau NIM
      if (currentUser) {
        const anggotaTim = teamData.anggota_tim || [];
        const isMember = anggotaTim.some((member: TeamMember) => {
          const memberNIM = member.nim?.trim();
          const memberNama = member.nama_pemain?.trim();
          const userNIM = currentUser.nim?.trim();
          const userNama = currentUser.nama?.trim();
          
          return (memberNIM && userNIM && memberNIM === userNIM) || 
                 (memberNama && userNama && memberNama === userNama);
        });
        
        // Anggota pertama dianggap ketua
        const isKetua = anggotaTim.length > 0 && 
          currentUser && 
          ((anggotaTim[0].nim?.trim() === currentUser.nim?.trim()) || 
           (anggotaTim[0].nama_pemain?.trim() === currentUser.nama?.trim()));

        setUserRole(isKetua ? 'ketua' : isMember ? 'anggota' : 'non-anggota');
      }

    } catch (error: any) {
      console.error("Error fetching team:", error);
      setError(error.message || "Gagal memuat data tim");
      toast.error("Gagal memuat data tim");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchTeamDetails();
    }
  }, [currentUser, teamId]);

  // Form handlers
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddMember = () => {
    if (!newMember.nama_pemain.trim()) {
      toast.error("Nama anggota harus diisi");
      return;
    }

    const newMemberWithId: TeamMember = {
      ...newMember,
      tim_id: teamId,
      nama_pemain: newMember.nama_pemain.trim(),
      nim: newMember.nim?.trim() || undefined
    };

    setMembers(prev => [...prev, newMemberWithId]);
    setNewMember({ 
      tim_id: teamId,
      nama_pemain: "", 
      nim: "" 
    });
    toast.success("Anggota ditambahkan");
  };

  const handleRemoveMember = (index: number) => {
    if (index === 0) {
      toast.error("Ketua tim tidak dapat dihapus");
      return;
    }
    setMembers(prev => prev.filter((_, i) => i !== index));
    toast.success("Anggota dihapus");
  };

  const handleUpdateMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const handleNewMemberChange = (field: keyof TeamMember, value: string) => {
    setNewMember(prev => ({ ...prev, [field]: value }));
  };

  // Save team - sesuai dengan struktur tabel
  const handleSaveTeam = async () => {
    console.log("Starting team save...");
    
    // Validasi dasar
    if (!teamId) {
      toast.error("ID Tim tidak valid");
      return;
    }

    if (!formData.nama.trim()) {
      toast.error("Nama tim harus diisi");
      return;
    }

    if (members.length === 0) {
      toast.error("Tim harus memiliki minimal 1 anggota");
      return;
    }

    try {
      setSaving(true);
      console.log("Saving team data...", { formData, members });

      // 1. Update team sesuai struktur tabel
      const updateData = {
        nama: formData.nama.trim(),
        status: formData.status,
        jurusan: formData.jurusan.trim() || null,
        angkatan: formData.angkatan.trim() || null,
        nomor_hp: formData.nomor_hp.trim() || null,
        jumlah_pemain: members.length,
        acara_id: formData.acara_id.trim() || null,
      };

      console.log("Updating team with:", updateData);

      const { error: updateError } = await supabase
        .from("tim")
        .update(updateData)
        .eq("id", teamId);

      if (updateError) {
        console.error("Team update error:", updateError);
        throw updateError;
      }

      console.log("Team updated successfully");

      // 2. Hapus anggota lama
      console.log("Deleting old members...");
      const { error: deleteError } = await supabase
        .from("anggota_tim")
        .delete()
        .eq("tim_id", teamId);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        console.warn("Could not delete old members, continuing...");
      }

      // 3. Insert anggota baru sesuai struktur tabel (tanpa email dan is_ketua)
      console.log("Inserting new members...");
      const membersToInsert = members.map((member) => ({
        tim_id: teamId,
        nama_pemain: member.nama_pemain.trim(),
        nim: member.nim?.trim() || null,
        dibuat_pada: new Date().toISOString()
      }));

      const { error: insertError } = await supabase
        .from("anggota_tim")
        .insert(membersToInsert);

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      console.log("Team saved successfully");
      toast.success("Tim berhasil diperbarui");
      setEditMode(false);
      
      // Refresh data
      setTimeout(() => {
        fetchTeamDetails();
      }, 500);

    } catch (error: any) {
      console.error("Error saving team:", {
        error: error,
        message: error?.message,
        code: error?.code,
        details: error?.details
      });

      // Handle specific errors
      if (error?.code === '23505') {
        toast.error("Nama tim sudah digunakan");
      } else if (error?.code === '23503') {
        toast.error("Data referensi tidak valid");
      } else if (error?.message?.includes("foreign key")) {
        toast.error("Turnamen tidak ditemukan");
      } else if (error?.message?.includes("permission denied")) {
        toast.error("Anda tidak memiliki izin untuk mengubah tim ini");
      } else {
        toast.error("Gagal menyimpan perubahan: " + (error?.message || "Unknown error"));
      }
    } finally {
      setSaving(false);
    }
  };

  // Delete team
  const handleDeleteTeam = async () => {
    try {
      const { error } = await supabase
        .from("tim")
        .delete()
        .eq("id", teamId);

      if (error) throw error;

      toast.success("Tim berhasil dihapus");
      router.push("/my-teams");
    } catch (error: any) {
      console.error("Error deleting team:", error);
      toast.error("Gagal menghapus tim");
    }
  };

  // Join team
  const handleJoinTeam = async () => {
    if (!currentUser || !teamId) {
      toast.error("Silakan login terlebih dahulu");
      router.push("/auth/login");
      return;
    }

    try {
      const { error } = await supabase.from("anggota_tim").insert({
        tim_id: teamId,
        nama_pemain: currentUser.nama,
        nim: currentUser.nim || null,
        dibuat_pada: new Date().toISOString()
      });

      if (error) {
        if (error.code === '23505') {
          toast.error("Anda sudah menjadi anggota tim ini");
        } else {
          throw error;
        }
      } else {
        toast.success("Berhasil bergabung dengan tim");
        fetchTeamDetails();
      }
    } catch (error: any) {
      console.error("Error joining team:", error);
      toast.error("Gagal bergabung dengan tim");
    }
  };

  // Leave team
  const handleLeaveTeam = async () => {
    if (!currentUser || !teamId) return;

    try {
      // Cek jumlah anggota sebelum keluar
      const { data: currentMembers, error: countError } = await supabase
        .from("anggota_tim")
        .select("*", { count: 'exact' })
        .eq("tim_id", teamId);

      if (countError) throw countError;

      const totalMembers = currentMembers?.length || 0;
      const willBeEmpty = totalMembers === 1; // Jika user ini satu-satunya anggota

      // Cek jika user adalah ketua
      const isKetua = userRole === 'ketua';
      
      if (isKetua && totalMembers > 1) {
        toast.error("Ketua tim tidak dapat keluar. Serahkan kepemimpinan terlebih dahulu.");
        return;
      }

      // Hapus user dari anggota tim
      const { error: deleteError } = await supabase
        .from("anggota_tim")
        .delete()
        .eq("tim_id", teamId)
        .or(`nim.eq.${currentUser.nim},nama_pemain.eq.${currentUser.nama}`);

      if (deleteError) throw deleteError;

      // Jika setelah keluar tim akan kosong, hapus tim
      if (willBeEmpty) {
        const { error: deleteTeamError } = await supabase
          .from("tim")
          .delete()
          .eq("id", teamId);

        if (deleteTeamError) throw deleteTeamError;

        toast.success("Tim berhasil dihapus karena tidak memiliki anggota");
        router.push("/my-teams");
      } else {
        toast.success("Berhasil keluar dari tim");
        fetchTeamDetails();
      }

    } catch (error: any) {
      console.error("Error leaving team:", error);
      toast.error("Gagal keluar dari tim");
    }
  };

  // Fungsi untuk menghapus tim jika kosong
  const checkAndDeleteEmptyTeam = async () => {
    if (!teamId) return false;

    try {
      // Cek jumlah anggota
      const { data: members, error: countError } = await supabase
        .from("anggota_tim")
        .select("*", { count: 'exact' })
        .eq("tim_id", teamId);

      if (countError) throw countError;

      const totalMembers = members?.length || 0;

      // Jika tidak ada anggota, hapus tim
      if (totalMembers === 0) {
        const { error: deleteError } = await supabase
          .from("tim")
          .delete()
          .eq("id", teamId);

        if (deleteError) throw deleteError;

        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking empty team:", error);
      return false;
    }
  };

  const handleCopyShareLink = () => {
    if (!teamId) return;
    navigator.clipboard.writeText(`${window.location.origin}/teams/${teamId}`);
    toast.success("Link tim disalin");
  };

  const handleCopyTeamId = () => {
    if (!team?.id) return;
    navigator.clipboard.writeText(team.id);
    toast.success("ID Tim disalin");
  };

  const handleViewTournament = () => {
    if (team?.acara_id) {
      router.push(`/tournaments/${team.acara_id}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div>
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !team) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto border-0 shadow-xl">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                <XCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Oops! Ada Masalah</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                {error || "Tim yang Anda cari tidak ditemukan."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => router.push("/my-teams")}
                  className="gap-2 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Tim Saya
                </Button>
                <Button 
                  variant="outline"
                  onClick={fetchTeamDetails}
                  className="gap-2"
                >
                  <Loader2 className="w-4 h-4" />
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
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <TeamDetailHeader
          team={team}
          userRole={userRole}
          onBack={() => router.push("/my-teams")}
          onShare={handleCopyShareLink}
          onManage={() => setEditMode(true)}
        />

        <TeamStatsCards team={team} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <TeamInfoCard team={team} />
            <TeamMembersCard team={team} userRole={userRole} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <QuickActionsCard
              team={team}
              userRole={userRole}
              onJoinTeam={handleJoinTeam}
              onLeaveTeam={handleLeaveTeam}
              onEditTeam={() => setEditMode(true)}
              onDeleteTeam={() => setShowDeleteDialog(true)}
              onShareTeam={handleCopyShareLink}
              onViewTournament={team.acara_id ? handleViewTournament : undefined}
            />

            <PerformanceStatsCard team={team} />

            <TeamDetailsCard 
              team={team} 
              onCopyId={handleCopyTeamId}
            />
          </div>
        </div>
      </div>

      <Footer />

      {/* Manage Team Modal */}
      {editMode && (
        <ManageTeamModal
          team={team}
          formData={formData}
          members={members}
          newMember={newMember}
          saving={saving}
          onClose={() => setEditMode(false)}
          onFormChange={handleFormChange}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onUpdateMember={handleUpdateMember}
          onNewMemberChange={handleNewMemberChange}
          onSave={handleSaveTeam}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-0 shadow-2xl">
          <AlertDialogHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-center">Hapus Tim?</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Tim <span className="font-semibold text-gray-900 dark:text-white">{team.nama}</span> akan dihapus permanen. 
              Semua anggota dan data terkait akan hilang.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-3">
            <AlertDialogCancel className="w-full sm:w-auto">Batalkan</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeam}
              className="w-full sm:w-auto bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
            >
              Ya, Hapus Tim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}