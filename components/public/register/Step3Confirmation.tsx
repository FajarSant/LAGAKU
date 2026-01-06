import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trophy, Shield } from "lucide-react";
import { Acara, TeamMemberForm, TeamRegistrationData, Pengguna } from "@/utils";

interface Step3ConfirmationProps {
  formData: TeamRegistrationData;
  anggotaTim: TeamMemberForm[];
  selectedAcara: Acara | null;
  isCaptain: boolean;
  currentUser: Pengguna | null;
}

export default function Step3Confirmation({
  formData,
  anggotaTim,
  selectedAcara,
  isCaptain,
  currentUser,
}: Step3ConfirmationProps) {
  return (
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nama Tim
                  </p>
                  <p className="font-semibold text-lg">{formData.nama}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Jurusan
                  </p>
                  <p className="font-medium">{formData.jurusan}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Angkatan
                  </p>
                  <p className="font-medium">{formData.angkatan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nomor HP
                  </p>
                  <p className="font-medium">{formData.nomor_hp}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Event Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-lg">
              Kompetisi
            </h3>
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
              <Badge variant="outline">{anggotaTim.length} Pemain</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {anggotaTim.map((anggota, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isCaptain && 
                    currentUser && 
                    anggota.nim === currentUser.nim
                      ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700"
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
                        {isCaptain && 
                         currentUser && 
                         anggota.nim === currentUser.nim && (
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-0">
                            <Shield className="h-3 w-3 mr-1" />
                            Ketua
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {anggota.nim}
                      </p>
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
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Data sudah lengkap!
          </strong>
          <p className="mt-1">
            Klik "Daftarkan Tim" untuk menyelesaikan pendaftaran.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}