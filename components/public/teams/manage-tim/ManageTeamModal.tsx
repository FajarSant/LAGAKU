"use client";

import { Save, Plus, X, Settings, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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

interface ManageTeamModalProps {
  team: TeamData;
  formData: {
    nama: string;
    status: string;
    jurusan: string;
    angkatan: string;
    nomor_hp: string;
    acara_id: string;
  };
  members: TeamMember[];
  newMember: TeamMember;
  saving: boolean;
  onClose: () => void;
  onFormChange: (field: string, value: string) => void;
  onAddMember: () => void;
  onRemoveMember: (index: number) => void;
  onUpdateMember: (index: number, field: keyof TeamMember, value: string) => void;
  onNewMemberChange: (field: keyof TeamMember, value: string) => void;
  onSave: () => void;
}

export function ManageTeamModal({
  team,
  formData,
  members,
  newMember,
  saving,
  onClose,
  onFormChange,
  onAddMember,
  onRemoveMember,
  onUpdateMember,
  onNewMemberChange,
  onSave
}: ManageTeamModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Kelola Tim
              </CardTitle>
              <CardDescription>
                Edit informasi tim dan kelola anggota
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Team Info Form */}
          <div className="space-y-4">
            <h3 className="font-semibold">Informasi Tim</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama Tim *</Label>
                <Input
                  value={formData.nama}
                  onChange={(e) => onFormChange("nama", e.target.value)}
                  placeholder="Nama tim"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => onFormChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="nonaktif">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Jurusan</Label>
                <Input
                  value={formData.jurusan}
                  onChange={(e) => onFormChange("jurusan", e.target.value)}
                  placeholder="Jurusan"
                />
              </div>
              <div className="space-y-2">
                <Label>Angkatan</Label>
                <Input
                  value={formData.angkatan}
                  onChange={(e) => onFormChange("angkatan", e.target.value)}
                  placeholder="Angkatan"
                />
              </div>
              <div className="space-y-2">
                <Label>Kontak</Label>
                <Input
                  value={formData.nomor_hp}
                  onChange={(e) => onFormChange("nomor_hp", e.target.value)}
                  placeholder="Nomor telepon"
                />
              </div>
            </div>
          </div>

          {/* Members Management */}
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Anggota Tim</h3>
              <Badge variant="outline" className="gap-1">
                <Shield className="w-3 h-3" />
                Anggota pertama adalah ketua
              </Badge>
            </div>
            
            <div className="space-y-3">
              {members.map((member, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs">
                          Ketua
                        </Badge>
                      )}
                      <Input
                        value={member.nama_pemain}
                        onChange={(e) => onUpdateMember(index, "nama_pemain", e.target.value)}
                        placeholder="Nama anggota"
                        className="font-medium"
                      />
                    </div>
                    <Input
                      value={member.nim || ""}
                      onChange={(e) => onUpdateMember(index, "nim", e.target.value)}
                      placeholder="NIM (opsional)"
                    />
                  </div>
                  {index > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveMember(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Member */}
            <div className="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <h4 className="font-medium">Tambah Anggota Baru</h4>
              <div className="space-y-2">
                <Input
                  value={newMember.nama_pemain}
                  onChange={(e) => onNewMemberChange("nama_pemain", e.target.value)}
                  placeholder="Nama anggota"
                />
                <Input
                  value={newMember.nim || ""}
                  onChange={(e) => onNewMemberChange("nim", e.target.value)}
                  placeholder="NIM (opsional)"
                />
                <Button
                  onClick={onAddMember}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Anggota
                </Button>
              </div>
            </div>
          </div>
        </CardContent>

        <div className="p-6 pt-0 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            className="flex-1 gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}