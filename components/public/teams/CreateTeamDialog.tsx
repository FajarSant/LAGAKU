"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
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
import {
  Loader2,
  Plus,
  X,
  Users,
  Phone,
  User,
  Crown,
  Trash2,
  Shield,
} from "lucide-react";
import { Pengguna } from "@/utils";
import { Badge } from "@/components/ui/badge";

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
    }
  }, [open, user]);

  const validate = () => {
    if (!formData.nama.trim()) {
      toast.error("Nama tim wajib diisi");
      return false;
    }
    if (!formData.jurusan.trim()) {
      toast.error("Jurusan wajib diisi");
      return false;
    }
    if (!formData.angkatan.trim()) {
      toast.error("Angkatan wajib diisi");
      return false;
    }
    if (!formData.nomor_hp.trim()) {
      toast.error("Nomor HP wajib diisi");
      return false;
    }
    
    for (let i = 0; i < formData.anggota.length; i++) {
      const member = formData.anggota[i];
      if (!member.nama_pemain.trim()) {
        toast.error(`Nama anggota ${i + 1} wajib diisi`);
        return false;
      }
      if (!member.nim.trim()) {
        toast.error(`NIM anggota ${i + 1} wajib diisi`);
        return false;
      }
      if (!/^[A-Za-z]?\d{9,15}$/.test(member.nim.trim())) {
        toast.error(`Format NIM anggota ${i + 1} tidak valid`);
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    const toastId = toast.loading("Membuat tim...");

    try {
      // Cek nama tim
      const { data: existingTeam } = await supabase
        .from("tim")
        .select("id")
        .ilike("nama", formData.nama.trim())
        .maybeSingle();

      if (existingTeam) {
        throw new Error("Nama tim sudah digunakan");
      }

      // Buat tim
      const { data: team, error: teamError } = await supabase
        .from("tim")
        .insert({
          nama: formData.nama.trim(),
          jurusan: formData.jurusan.trim(),
          angkatan: formData.angkatan.trim(),
          nomor_hp: formData.nomor_hp.replace(/\D/g, ""),
          jumlah_pemain: formData.anggota.length,
          acara_id: null,
          status: "aktif",
          dibuat_pada: new Date().toISOString(),
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Buat anggota
      const anggotaData = formData.anggota.map(member => ({
        tim_id: team.id,
        nama_pemain: member.nama_pemain.trim(),
        nim: member.nim.trim().toUpperCase(),
      }));

      const { error: anggotaError } = await supabase
        .from("anggota_tim")
        .insert(anggotaData);

      if (anggotaError) throw anggotaError;

      toast.dismiss(toastId);
      toast.success(`Tim "${formData.nama}" berhasil dibuat!`);

      setTimeout(() => {
        onOpenChange(false);
        onTeamCreated();
      }, 1000);

    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error.message || "Gagal membuat tim");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Buat Tim Baru</DialogTitle>
          <DialogDescription>
            Bentuk tim untuk persiapan mengikuti turnamen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info Tim */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Nama Tim *</Label>
              <Input
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                placeholder="Nama tim"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label>Angkatan *</Label>
              <Input
                value={formData.angkatan}
                onChange={(e) => setFormData({...formData, angkatan: e.target.value})}
                placeholder="2023"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label>Jurusan *</Label>
              <Input
                value={formData.jurusan}
                onChange={(e) => setFormData({...formData, jurusan: e.target.value})}
                placeholder="Jurusan"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> Nomor HP *
              </Label>
              <Input
                value={formData.nomor_hp}
                onChange={(e) => setFormData({...formData, nomor_hp: e.target.value})}
                placeholder="081234567890"
                disabled={loading}
              />
            </div>
          </div>

          {/* Anggota */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">Anggota Tim</Label>
              <Badge variant="outline">
                {formData.anggota.length} anggota
              </Badge>
            </div>

            {/* Ketua */}
            <div className="mb-3 p-3 bg-primary/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Ketua Tim</span>
                </div>
                <Badge>Anda</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={formData.anggota[0].nama_pemain}
                  readOnly
                  className="text-sm"
                />
                <Input
                  value={formData.anggota[0].nim}
                  readOnly
                  className="text-sm"
                />
              </div>
            </div>

            {/* Anggota lain */}
            {formData.anggota.slice(1).map((member, index) => (
              <div key={index} className="mb-2 p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Anggota {index + 2}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newAnggota = formData.anggota.filter((_, i) => i !== index + 1);
                      setFormData({...formData, anggota: newAnggota});
                    }}
                    disabled={loading}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={member.nama_pemain}
                    onChange={(e) => {
                      const newAnggota = [...formData.anggota];
                      newAnggota[index + 1].nama_pemain = e.target.value;
                      setFormData({...formData, anggota: newAnggota});
                    }}
                    placeholder="Nama"
                    disabled={loading}
                    className="text-sm"
                  />
                  <Input
                    value={member.nim}
                    onChange={(e) => {
                      const newAnggota = [...formData.anggota];
                      newAnggota[index + 1].nim = e.target.value;
                      setFormData({...formData, anggota: newAnggota});
                    }}
                    placeholder="NIM"
                    disabled={loading}
                    className="text-sm"
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (formData.anggota.length < 15) {
                  setFormData({
                    ...formData,
                    anggota: [...formData.anggota, { nama_pemain: "", nim: "" }]
                  });
                }
              }}
              disabled={loading || formData.anggota.length >= 15}
              className="w-full mt-2 gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Anggota
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="gap-2">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
            Buat Tim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}