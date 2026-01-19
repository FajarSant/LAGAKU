"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Swal from "sweetalert2";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Users, Loader2, UserPlus } from "lucide-react";
import { TournamentDetails, UserProfile, UserTeam } from "@/utils";

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
  userTeams = [], // Default value untuk menghindari error
  onRegistrationSuccess 
}: TeamRegistrationProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

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

    if (!selectedTeamId) {
      Swal.fire({
        title: 'Pilih Tim',
        text: 'Silakan pilih tim yang akan didaftarkan',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Cek apakah tim sudah terdaftar di turnamen ini
      const { data: existingTeam, error: checkError } = await supabase
        .from("tim")
        .select("acara_id, nama")
        .eq("id", selectedTeamId)
        .single();

      if (checkError) throw checkError;

      // Jika tim sudah terdaftar di turnamen ini
      if (existingTeam.acara_id === tournamentId) {
        Swal.fire({
          title: 'Sudah Terdaftar',
          text: `Tim "${existingTeam.nama}" sudah terdaftar di turnamen ini`,
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        setLoading(false);
        return;
      }

      // Jika tim sudah terdaftar di turnamen lain
      if (existingTeam.acara_id && existingTeam.acara_id !== tournamentId) {
        const confirmed = await Swal.fire({
          title: 'Peringatan',
          text: `Tim "${existingTeam.nama}" sudah terdaftar di turnamen lain. Apakah Anda yakin ingin memindahkannya ke turnamen ini?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ya, Pindahkan',
          cancelButtonText: 'Batal'
        });

        if (!confirmed.isConfirmed) {
          setLoading(false);
          return;
        }
      }

      // Update acara_id tim
      const { error } = await supabase
        .from("tim")
        .update({ acara_id: tournamentId })
        .eq("id", selectedTeamId);

      if (error) throw error;

      // Tampilkan sukses
      Swal.fire({
        title: 'Berhasil!',
        text: `Tim "${existingTeam.nama}" berhasil didaftarkan ke turnamen`,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        onRegistrationSuccess();
        router.push(`/tournaments/${tournamentId}`);
      });

    } catch (error: any) {
      console.error("Registration error:", error);
      
      let errorMessage = "Terjadi kesalahan saat mendaftarkan tim";
      
      if (error.code === '23505') {
        errorMessage = "Nama tim sudah digunakan";
      } else if (error.code === '23503') {
        errorMessage = "Data referensi tidak valid";
      } else if (error.message?.includes("foreign key")) {
        errorMessage = "Data turnamen tidak ditemukan";
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
      
      Swal.fire({
        title: 'Gagal',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedTeam = userTeams?.find(team => team.id === selectedTeamId);

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Pilih Tim untuk Didaftarkan
        </h2>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Informasi penting */}
        <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
          <Users className="h-4 w-4" />
          <AlertDescription>
            <strong>Perhatian:</strong> Hanya tim yang Anda adalah anggota atau ketuanya yang dapat didaftarkan. 
            {userTeams.length === 0 && " Anda belum memiliki tim."}
          </AlertDescription>
        </Alert>

        {/* Daftar Tim Pengguna */}
        {userTeams.length === 0 ? (
          <Alert>
            <AlertDescription className="text-center py-4">
              Anda belum memiliki tim yang dapat didaftarkan. 
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/teams/create')}
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Buat Tim Baru
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tim Anda</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userTeams.map(team => (
                  <div
                    key={team.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedTeamId === team.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/50 hover:bg-accent/50'}`}
                    onClick={() => setSelectedTeamId(team.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-lg">{team.nama}</div>
                      {selectedTeamId === team.id && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Jurusan:</span> {team.jurusan || "-"}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Angkatan:</span> {team.angkatan || "-"}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Nomor HP:</span> {team.nomor_hp || "-"}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Jumlah Anggota:</span> {team.anggota.length} orang
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail Tim Terpilih */}
            {selectedTeam && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Detail Tim Terpilih
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Nama Tim</div>
                        <div className="font-medium">{selectedTeam.nama}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Jurusan</div>
                        <div className="font-medium">{selectedTeam.jurusan || "-"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Angkatan</div>
                        <div className="font-medium">{selectedTeam.angkatan || "-"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Nomor HP</div>
                        <div className="font-medium">{selectedTeam.nomor_hp || "-"}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">Daftar Anggota</div>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {selectedTeam.anggota.map((anggota, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-background rounded">
                          <div>
                            <div className="font-medium">{anggota.nama_pemain}</div>
                            <div className="text-xs text-muted-foreground">NIM: {anggota.nim || "-"}</div>
                          </div>
                          {idx === 0 && (
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                              Ketua
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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
                disabled={loading || !tournament.is_registration_open || !selectedTeamId}
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
          </div>
        )}

        {/* Catatan */}
        <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
          <p className="font-medium mb-2">Catatan Penting:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Hanya tim yang Anda adalah anggotanya yang dapat ditampilkan</li>
            <li>Tim yang sudah terdaftar tidak dapat didaftarkan ulang</li>
            <li>Setiap peserta hanya boleh terdaftar dalam 1 tim per turnamen</li>
            <li>Pastikan data anggota tim sudah lengkap sebelum mendaftar</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}