import { EnumJenisKelamin } from "@/types/type";
import { Pengguna } from "@/utils";
import { 
  MapPin, 
  Save, 
  Building, 
  BookOpen, 
  User as UserIcon, 
  Cake, 
  Home, 
  Phone, 
  Edit,
  X
} from "lucide-react";

// shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface ProfileContentProps {
  user: Pengguna | null;
  isEditing: boolean;
  editForm: Partial<Pengguna>;
  onEditToggle: () => void; // Tambahkan prop ini
  onEditFormChange: (form: Partial<Pengguna>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProfileContent({ 
  user, 
  isEditing, 
  editForm, 
  onEditToggle, // Tambahkan prop ini
  onEditFormChange, 
  onSave, 
  onCancel 
}: ProfileContentProps) {
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const getGenderText = (gender?: EnumJenisKelamin) => {
    if (!gender) return "-";
    return gender === "L" ? "Laki-laki" : "Perempuan";
  };

  const handleInputChange = (field: keyof Pengguna, value: string) => {
    onEditFormChange({ ...editForm, [field]: value });
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Edit Profil</CardTitle>
              <CardDescription>
                Perbarui informasi profil Anda
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onEditToggle}>
              <X className="mr-2 h-4 w-4" />
              Batal Edit
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input
                  id="nama"
                  value={editForm.nama || ""}
                  onChange={(e) => handleInputChange("nama", e.target.value)}
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nim">NIM</Label>
                <Input
                  id="nim"
                  value={editForm.nim || ""}
                  onChange={(e) => handleInputChange("nim", e.target.value)}
                  placeholder="Masukkan NIM"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fakultas">Fakultas</Label>
                <Input
                  id="fakultas"
                  value={editForm.fakultas || ""}
                  onChange={(e) => handleInputChange("fakultas", e.target.value)}
                  placeholder="Masukkan fakultas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="program_studi">Program Studi</Label>
                <Input
                  id="program_studi"
                  value={editForm.program_studi || ""}
                  onChange={(e) => handleInputChange("program_studi", e.target.value)}
                  placeholder="Masukkan program studi"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                <Select
                  value={editForm.jenis_kelamin || ""}
                  onValueChange={(value: EnumJenisKelamin) => handleInputChange("jenis_kelamin", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Laki-laki</SelectItem>
                    <SelectItem value="P">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                <Input
                  id="tanggal_lahir"
                  type="date"
                  value={editForm.tanggal_lahir || ""}
                  onChange={(e) => handleInputChange("tanggal_lahir", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Textarea
                  id="alamat"
                  value={editForm.alamat || ""}
                  onChange={(e) => handleInputChange("alamat", e.target.value)}
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomor_hp">Nomor HP</Label>
                <Input
                  id="nomor_hp"
                  type="tel"
                  value={editForm.nomor_hp || ""}
                  onChange={(e) => handleInputChange("nomor_hp", e.target.value)}
                  placeholder="Masukkan nomor HP"
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Simpan Perubahan
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // View Mode
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Detail Informasi</CardTitle>
            <CardDescription>
              Informasi lengkap profil Anda
            </CardDescription>
          </div>
          <Button onClick={onEditToggle}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profil
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-8">
          {/* Informasi Akademik */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Informasi Akademik</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm font-normal text-muted-foreground">Fakultas</Label>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{user?.fakultas || "-"}</p>
                  </div>
                </div>
                <Separator />
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm font-normal text-muted-foreground">Program Studi</Label>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{user?.program_studi || "-"}</p>
                  </div>
                </div>
                <Separator />
              </div>
            </div>
          </div>

          {/* Informasi Pribadi */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Informasi Pribadi</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm font-normal text-muted-foreground">Jenis Kelamin</Label>
                  <p className="font-medium">{getGenderText(user?.jenis_kelamin)}</p>
                </div>
                <Separator />
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm font-normal text-muted-foreground">Tanggal Lahir</Label>
                  <div className="flex items-center gap-2">
                    <Cake className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{formatDate(user?.tanggal_lahir)}</p>
                  </div>
                </div>
                <Separator />
              </div>
            </div>
          </div>

          {/* Kontak & Alamat */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Kontak & Alamat</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm font-normal text-muted-foreground">Alamat</Label>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <p className="font-medium break-words">{user?.alamat || "-"}</p>
                  </div>
                </div>
                <Separator />
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm font-normal text-muted-foreground">Nomor HP</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{user?.nomor_hp || "-"}</p>
                  </div>
                </div>
                <Separator />
              </div>
            </div>
          </div>

          {/* Informasi Akun */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Informasi Akun</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm font-normal text-muted-foreground">Email</Label>
                  <p className="font-medium">{user?.email || "-"}</p>
                </div>
                <Separator />
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm font-normal text-muted-foreground">Bergabung Sejak</Label>
                  <p className="font-medium">
                    {user?.dibuat_pada ? new Date(user.dibuat_pada).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    }) : "-"}
                  </p>
                </div>
                <Separator />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}