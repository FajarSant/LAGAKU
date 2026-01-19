"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, PlusCircle, XCircle, Users, User, Phone, Building } from "lucide-react";
import { Pengguna } from "@/utils";

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTeamCreated: () => void;
  user: Pengguna;
}

interface TeamMember {
  nama_pemain: string;
  nim: string;
}

export default function CreateTeamDialog({
  open,
  onOpenChange,
  onTeamCreated,
  user,
}: CreateTeamDialogProps) {
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nama: "",
    jurusan: user.jurusan || "",
    angkatan: user.angkatan || "",
    nomor_hp: user.nomor_hp || "",
    anggota: [
      {
        nama_pemain: user.nama || "",
        nim: user.nim || "",
      },
    ] as TeamMember[],
  });

  useEffect(() => {
    if (open) {
      // Reset form dengan data user
      setFormData({
        nama: "",
        jurusan: user.jurusan || "",
        angkatan: user.angkatan || "",
        nomor_hp: user.nomor_hp || "",
        anggota: [
          {
            nama_pemain: user.nama || "",
            nim: user.nim || "",
          },
        ],
      });
      setError(null);
    }
  }, [open, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...formData.anggota];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData(prev => ({ ...prev, anggota: newMembers }));
  };

  const handleAddMember = () => {
    setFormData(prev => ({
      ...prev,
      anggota: [...prev.anggota, { nama_pemain: "", nim: "" }],
    }));
  };

  const handleRemoveMember = (index: number) => {
    if (formData.anggota.length > 1) {
      const newMembers = formData.anggota.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, anggota: newMembers }));
    }
  };

  const validateForm = () => {
    if (!formData.nama.trim()) {
      return "Nama tim wajib diisi";
    }
    if (!formData.jurusan.trim()) {
      return "Jurusan wajib diisi";
    }
    if (!formData.angkatan.trim()) {
      return "Angkatan wajib diisi";
    }
    if (!formData.nomor_hp.trim()) {
      return "Nomor HP wajib diisi";
    }
    
    for (let i = 0; i < formData.anggota.length; i++) {
      const member = formData.anggota[i];
      if (!member.nama_pemain.trim()) {
        return `Nama anggota ${i + 1} wajib diisi`;
      }
      if (!member.nim.trim()) {
        return `NIM anggota ${i + 1} wajib diisi`;
      }
    }
    
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Cek apakah tim dengan nama yang sama sudah ada
      const { data: existingTeam } = await supabase
        .from("tim")
        .select("id")
        .eq("nama", formData.nama)
        .maybeSingle();

      if (existingTeam) {
        throw new Error("Nama tim sudah digunakan, silakan gunakan nama lain");
      }

      // Insert tim baru (TANPA created_by)
      const { data: team, error: teamError } = await supabase
        .from("tim")
        .insert({
          nama: formData.nama,
          jurusan: formData.jurusan,
          angkatan: formData.angkatan,
          nomor_hp: formData.nomor_hp,
          jumlah_pemain: formData.anggota.length,
          acara_id: null,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Insert anggota tim
      const anggotaData = formData.anggota.map(member => ({
        tim_id: team.id,
        nama_pemain: member.nama_pemain,
        nim: member.nim,
      }));

      const { error: anggotaError } = await supabase
        .from("anggota_tim")
        .insert(anggotaData);

      if (anggotaError) throw anggotaError;

      // Sukses
      alert("Tim berhasil dibuat! Anda bisa mendaftarkan tim ini ke turnamen nanti.");
      onTeamCreated();

    } catch (error: any) {
      console.error("Error creating team:", error);
      setError(error.message || "Terjadi kesalahan saat membuat tim");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <PlusCircle className="w-5 h-5" />
            Buat Tim Baru
          </DialogTitle>
          <DialogDescription>
            Buat tim Anda terlebih dahulu, nanti bisa daftar ke turnamen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Informasi Tim */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Building className="w-5 h-5" />
              Informasi Tim
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Tim *</Label>
                <Input
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Nama tim Anda"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">
                  Nama tim akan digunakan untuk identifikasi
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jurusan">Jurusan *</Label>
                <Input
                  id="jurusan"
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleInputChange}
                  placeholder="Jurusan"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="angkatan">Angkatan *</Label>
                <Input
                  id="angkatan"
                  name="angkatan"
                  value={formData.angkatan}
                  onChange={handleInputChange}
                  placeholder="Angkatan"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomor_hp" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Nomor HP *
                </Label>
                <Input
                  id="nomor_hp"
                  name="nomor_hp"
                  value={formData.nomor_hp}
                  onChange={handleInputChange}
                  placeholder="0812-3456-7890"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Anggota Tim */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Users className="w-5 h-5" />
                Anggota Tim ({formData.anggota.length} orang)
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMember}
                disabled={loading || formData.anggota.length >= 15}
              >
                Tambah Anggota
              </Button>
            </div>

            <div className="space-y-4">
              {formData.anggota.map((anggota, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <span className="font-medium">Anggota {index + 1}</span>
                      {index === 0 && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                          Ketua Tim
                        </span>
                      )}
                    </div>
                    {formData.anggota.length > 1 && index !== 0 && (
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
                        disabled={loading || index === 0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>NIM *</Label>
                      <Input
                        value={anggota.nim}
                        onChange={(e) => handleMemberChange(index, "nim", e.target.value)}
                        placeholder="NIM"
                        disabled={loading || index === 0}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Membuat Tim...
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                Buat Tim
              </>
            )}
          </Button>
        </DialogFooter>

        <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t">
          <p className="font-medium mb-1">Catatan:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Anda akan menjadi ketua tim (anggota pertama)</li>
            <li>Tim akan dibuat tanpa mengikuti turnamen terlebih dahulu</li>
            <li>Nanti Anda bisa mendaftarkan tim ini ke turnamen yang tersedia</li>
            <li>Pastikan semua data anggota benar dan valid</li>
            <li>Maksimal 15 anggota per tim</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}