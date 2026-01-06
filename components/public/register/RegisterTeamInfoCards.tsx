import { Card, CardContent } from "@/components/ui/card";
import { Shield, GraduationCap, Phone } from "lucide-react";

export default function RegisterTeamInfoCards() {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-semibold">Ketua Tim</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Ketua tim otomatis terdaftar sebagai anggota dan menjadi kontak utama
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-100 dark:border-purple-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
              <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-semibold">Verifikasi Data</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Pastikan NIM dan nama sesuai dengan data akademik
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-100 dark:border-emerald-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-lg">
              <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold">Kontak Aktif</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Nomor HP digunakan untuk notifikasi dan komunikasi penting
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}