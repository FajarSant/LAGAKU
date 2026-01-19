"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Swal from "sweetalert2";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Users, User, Phone, PlusCircle, Users2, Loader2 } from "lucide-react";
import { FormData, TournamentDetails, UserProfile, UserTeam } from "@/utils";

interface TeamRegistrationProps {
  tournament: TournamentDetails;
  tournamentId: string;
  userProfile: UserProfile | null;
  userTeams: UserTeam[];
  onRegistrationSuccess: () => void;
}

export default function TeamRegistration({ 
  tournament, 
  tournamentId, 
  userProfile,
  userTeams,
  onRegistrationSuccess 
}: TeamRegistrationProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"new" | "existing">(userTeams.length > 0 ? "existing" : "new");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  // Form untuk tim baru
  const [newTeam, setNewTeam] = useState<FormData>({
    nama: "",
    jurusan: userProfile?.jurusan || "",
    angkatan: userProfile?.angkatan || "",
    nomor_hp: userProfile?.nomor_hp || "",
    anggota: [
      { 
        nama_pemain: userProfile?.full_name || "", 
        nim: userProfile?.nim || "" 
      }
    ],
  });

  const handleNewTeamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'nama' || name === 'jurusan' || name === 'angkatan' || name === 'nomor_hp') {
      setNewTeam(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddMember = () => {
    setNewTeam(prev => ({
      ...prev,
      anggota: [...prev.anggota, { nama_pemain: "", nim: "" }]
    }));
  };

  const handleMemberChange = (index: number, field: "nama_pemain" | "nim", value: string) => {
    const newMembers = [...newTeam.anggota];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setNewTeam(prev => ({ ...prev, anggota: newMembers }));
  };

  const handleRemoveMember = (index: number) => {
    if (newTeam.anggota.length > 1) {
      const newMembers = newTeam.anggota.filter((_, i) => i !== index);
      setNewTeam(prev => ({ ...prev, anggota: newMembers }));
    }
  };

  const validateForm = () => {
    if (mode === "new") {
      if (!newTeam.nama.trim()) return "Nama tim wajib diisi";
      if (!newTeam.jurusan.trim()) return "Jurusan wajib diisi";
      if (!newTeam.angkatan.trim()) return "Angkatan wajib diisi";
      if (!newTeam.nomor_hp.trim()) return "Nomor HP wajib diisi";
      
      for (const member of newTeam.anggota) {
        if (!member.nama_pemain.trim()) return "Nama anggota wajib diisi";
        if (!member.nim.trim()) return "NIM anggota wajib diisi";
      }
    } else {
      if (!selectedTeamId) return "Pilih tim yang akan didaftarkan";
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!tournament.is_registration_open) {
      Swal.fire({
        title: 'Pendaftaran Ditutup',
        text: 'Pendaftaran untuk turnamen ini sudah ditutup',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      Swal.fire({
        title: 'Periksa Form',
        text: validationError,
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === "existing") {
        // Daftarkan tim yang sudah ada
        const { error } = await supabase
          .from("tim")
          .update({ acara_id: tournamentId })
          .eq("id", selectedTeamId);

        if (error) throw error;
      } else {
        // Buat tim baru
        const { data: team, error: teamError } = await supabase
          .from("tim")
          .insert({
            nama: newTeam.nama,
            jurusan: newTeam.jurusan,
            angkatan: newTeam.angkatan,
            nomor_hp: newTeam.nomor_hp,
            acara_id: tournamentId,
            jumlah_pemain: newTeam.anggota.length,
            created_by: userProfile?.id,
          })
          .select()
          .single();

        if (teamError) throw teamError;

        // Tambahkan anggota tim
        const anggotaData = newTeam.anggota.map(anggota => ({
          tim_id: team.id,
          nama_pemain: anggota.nama_pemain,
          nim: anggota.nim,
        }));

        const { error: anggotaError } = await supabase
          .from("anggota_tim")
          .insert(anggotaData);

        if (anggotaError) throw anggotaError;
      }

      // Tampilkan sukses
      Swal.fire({
        title: 'Berhasil!',
        text: mode === "existing" 
          ? 'Tim berhasil didaftarkan ke turnamen' 
          : 'Tim baru berhasil dibuat dan didaftarkan',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        onRegistrationSuccess();
        router.push(`/tournaments/${tournamentId}`);
      });

    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Terjadi kesalahan saat mendaftarkan tim");
      
      Swal.fire({
        title: 'Gagal',
        text: error.message || 'Terjadi kesalahan saat mendaftarkan tim',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedTeam = userTeams.find(team => team.id === selectedTeamId);

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Pendaftaran Tim
        </h2>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Pilihan Mode */}
        {userTeams.length > 0 && (
          <Tabs value={mode} onValueChange={(v) => setMode(v as "new" | "existing")} className="mb-8">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="existing" className="gap-2">
                <Users2 className="h-4 w-4" />
                Gunakan Tim Saya
              </TabsTrigger>
              <TabsTrigger value="new" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Buat Tim Baru
              </TabsTrigger>
            </TabsList>

            <TabsContent value="existing" className="space-y-4">
              {userTeams.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    Anda belum memiliki tim. Silakan buat tim baru.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <Label>Pilih Tim yang Sudah Ada</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {userTeams.map(team => (
                      <div
                        key={team.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedTeamId === team.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                        onClick={() => setSelectedTeamId(team.id)}
                      >
                        <div className="font-medium">{team.nama}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {team.jurusan} • {team.anggota.length} anggota
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedTeam && (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Detail Tim</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Nama: <span className="font-medium">{selectedTeam.nama}</span></div>
                        <div>Jurusan: <span className="font-medium">{selectedTeam.jurusan}</span></div>
                        <div>Angkatan: <span className="font-medium">{selectedTeam.angkatan}</span></div>
                        <div>Anggota: <span className="font-medium">{selectedTeam.anggota.length} orang</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="new" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="nama">Nama Tim *</Label>
                  <Input
                    id="nama"
                    name="nama"
                    value={newTeam.nama}
                    onChange={handleNewTeamChange}
                    placeholder="Nama tim Anda"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="jurusan">Jurusan *</Label>
                  <Input
                    id="jurusan"
                    name="jurusan"
                    value={newTeam.jurusan}
                    onChange={handleNewTeamChange}
                    placeholder="Jurusan"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="angkatan">Angkatan *</Label>
                  <Input
                    id="angkatan"
                    name="angkatan"
                    value={newTeam.angkatan}
                    onChange={handleNewTeamChange}
                    placeholder="Angkatan"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="nomor_hp" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Nomor HP *
                  </Label>
                  <Input
                    id="nomor_hp"
                    name="nomor_hp"
                    value={newTeam.nomor_hp}
                    onChange={handleNewTeamChange}
                    placeholder="0812-3456-7890"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Anggota Tim */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Anggota Tim
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddMember}
                    disabled={loading}
                  >
                    Tambah Anggota
                  </Button>
                </div>

                <div className="space-y-4">
                  {newTeam.anggota.map((anggota, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">{index + 1}</span>
                          </div>
                          <span className="font-medium">Anggota {index + 1}</span>
                        </div>
                        {newTeam.anggota.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(index)}
                            disabled={loading}
                          >
                            Hapus
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nama Lengkap *</Label>
                          <Input
                            value={anggota.nama_pemain}
                            onChange={(e) => handleMemberChange(index, "nama_pemain", e.target.value)}
                            placeholder="Nama lengkap"
                            disabled={loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>NIM *</Label>
                          <Input
                            value={anggota.nim}
                            onChange={(e) => handleMemberChange(index, "nim", e.target.value)}
                            placeholder="NIM"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !tournament.is_registration_open}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Daftarkan Tim
              </>
            )}
          </Button>
        </div>

        {/* Catatan */}
        <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
          <p className="font-medium mb-2">Catatan:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Pastikan data yang diisi akurat dan valid</li>
            <li>Tim yang sudah terdaftar tidak dapat diubah</li>
            <li>Setiap peserta hanya boleh mendaftar 1 tim per turnamen</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}