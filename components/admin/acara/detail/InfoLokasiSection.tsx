import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FiMapPin, FiUser, FiInfo } from "react-icons/fi";
import Swal from "sweetalert2";
import { calculateProgress } from "@/utils/formatters";

interface InfoLokasiSectionProps {
  lokasi?: string;
  pesertaMaksimal?: number;
  pesertaCount: number;
}

export default function InfoLokasiSection({ 
  lokasi, 
  pesertaMaksimal, 
  pesertaCount 
}: InfoLokasiSectionProps) {
  const progress = calculateProgress(pesertaCount, pesertaMaksimal);
  
  const showLocationDetails = () => {
    if (!lokasi) return;
    
    // Detect current theme
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    Swal.fire({
      title: '<span class="text-foreground text-lg font-semibold">Detail Lokasi</span>',
      html: `
        <div class="text-left">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-3 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl dark:from-emerald-600 dark:to-teal-600">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-muted-foreground dark:text-gray-400">Lokasi Acara</p>
              <p class="text-foreground font-medium dark:text-white">${lokasi}</p>
            </div>
          </div>
          <div class="mt-4 p-4 bg-secondary/50 rounded-xl border dark:bg-gray-800/50 dark:border-gray-700/50">
            <p class="text-sm text-muted-foreground mb-2 dark:text-gray-300">📌 Alamat lengkap:</p>
            <p class="text-foreground dark:text-white">${lokasi}</p>
            <div class="mt-3 flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
              </svg>
              <span>Pastikan untuk datang tepat waktu</span>
            </div>
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Mengerti",
      confirmButtonColor: isDarkMode ? "#10b981" : "#059669",
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#f9fafb' : '#111827',
      customClass: {
        popup: 'rounded-2xl border border-border',
        confirmButton: 'px-4 py-2 rounded-lg font-medium',
      },
    });
  };

  const showCapacityDetails = () => {
    if (!pesertaMaksimal) return;
    
    // Detect current theme
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    Swal.fire({
      title: '<span class="text-foreground text-lg font-semibold">Detail Kapasitas</span>',
      html: `
        <div class="text-left">
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-linear-to-br from-blue-100 to-cyan-100 rounded-xl border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30">
              <p class="text-sm text-muted-foreground dark:text-gray-300 mb-1">Terisi</p>
              <p class="text-2xl font-bold text-foreground dark:text-white">${pesertaCount}</p>
              <p class="text-xs text-muted-foreground dark:text-gray-400">Peserta</p>
            </div>
            <div class="p-4 bg-linear-to-br from-green-100 to-emerald-100 rounded-xl border border-green-200 dark:bg-green-900/20 dark:border-green-800/30">
              <p class="text-sm text-muted-foreground dark:text-gray-300 mb-1">Maksimal</p>
              <p class="text-2xl font-bold text-foreground dark:text-white">${pesertaMaksimal}</p>
              <p class="text-xs text-muted-foreground dark:text-gray-400">Peserta</p>
            </div>
          </div>
          <div class="mb-4">
            <div class="flex justify-between text-sm text-muted-foreground dark:text-gray-300 mb-2">
              <span>Progress Pendaftaran</span>
              <span>${Math.round(progress)}%</span>
            </div>
            <div class="h-3 bg-secondary rounded-full overflow-hidden dark:bg-gray-800">
              <div class="h-full bg-linear-to-r from-blue-500 to-cyan-500" style="width: ${progress}%"></div>
            </div>
          </div>
          ${pesertaCount >= pesertaMaksimal ? 
            `<div class="p-3 bg-linear-to-br from-red-50 to-rose-50 rounded-xl border border-red-200 dark:bg-red-900/20 dark:border-red-800/30 mt-4">
              <p class="text-sm text-red-700 dark:text-red-300 font-medium">⚠️ Kapasitas Penuh</p>
              <p class="text-xs text-red-600/80 dark:text-red-200/80 mt-1">Pendaftaran sudah mencapai batas maksimal</p>
            </div>` : 
            `<div class="p-3 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 dark:bg-green-900/20 dark:border-green-800/30 mt-4">
              <p class="text-sm text-green-700 dark:text-green-300 font-medium">✅ Masih Tersedia</p>
              <p class="text-xs text-green-600/80 dark:text-green-200/80 mt-1">Sisa ${pesertaMaksimal - pesertaCount} kuota tersedia</p>
            </div>`
          }
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Tutup",
      confirmButtonColor: isDarkMode ? "#3b82f6" : "#2563eb",
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#f9fafb' : '#111827',
      customClass: {
        popup: 'rounded-2xl border border-border',
        confirmButton: 'px-4 py-2 rounded-lg font-medium',
      },
    });
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-3">
          <div className="p-2 bg-linear-to-br from-emerald-500 to-teal-500 rounded-lg dark:from-emerald-600 dark:to-teal-600">
            <FiMapPin className="w-5 h-5 text-white" />
          </div>
          <span className="text-foreground">Lokasi & Kapasitas</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          {/* Lokasi Section */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-secondary/50 rounded-lg dark:bg-secondary/70">
              <FiMapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Lokasi</p>
              <div className="flex items-center justify-between">
                <p className="text-foreground font-medium truncate mr-2 dark:text-white">
                  {lokasi || "Lokasi belum ditentukan"}
                </p>
                {lokasi && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-secondary"
                    onClick={showLocationDetails}
                    title="Lihat detail lokasi"
                  >
                    <FiInfo className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Separator */}
          <div className="h-px bg-linear-to-r from-transparent via-border to-transparent"></div>
          
          {/* Kapasitas Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FiUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-muted-foreground">Kapasitas Peserta</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground dark:text-white">
                  {pesertaMaksimal 
                    ? `${pesertaCount} / ${pesertaMaksimal}`
                    : `${pesertaCount} peserta`
                  }
                </span>
                {pesertaMaksimal && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-secondary"
                    onClick={showCapacityDetails}
                    title="Lihat detail kapasitas"
                  >
                    <FiInfo className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            {pesertaMaksimal && (
              <>
                <Progress 
                  value={progress} 
                  className="h-2 bg-secondary dark:bg-secondary/70"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>0%</span>
                  <span>{Math.round(progress)}% terisi</span>
                  <span>100%</span>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}