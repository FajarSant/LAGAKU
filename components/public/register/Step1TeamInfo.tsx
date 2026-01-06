import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, Phone, Trophy } from "lucide-react";
import { Acara, TeamRegistrationData } from "@/utils";


interface Step1TeamInfoProps {
  formData: TeamRegistrationData;
  acaraList: Acara[];
  selectedAcara: Acara | null;
  loadingAcara: boolean;
  updateFormData: (data: Partial<TeamRegistrationData>) => void;
  setSelectedAcara: (acara: Acara | null) => void;
}

export default function Step1TeamInfo({
  formData,
  acaraList,
  selectedAcara,
  loadingAcara,
  updateFormData,
  setSelectedAcara
}: Step1TeamInfoProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleAcaraSelect = (value: string) => {
    updateFormData({ acara_id: value });
    const selected = acaraList.find(acara => acara.id === value);
    setSelectedAcara(selected || null);
  };

  return (
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
  );
}