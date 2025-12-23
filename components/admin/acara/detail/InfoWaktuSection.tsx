import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiCalendar, FiClock, FiInfo } from "react-icons/fi";
import Swal from "sweetalert2";
import { formatTanggal, formatTime } from "@/utils/formatters";

interface InfoWaktuSectionProps {
  tanggalMulai?: string;
  tanggalSelesai?: string;
}

export default function InfoWaktuSection({ tanggalMulai, tanggalSelesai }: InfoWaktuSectionProps) {
  const showDateTimeDetails = (type: 'mulai' | 'selesai') => {
    const dateString = type === 'mulai' ? tanggalMulai : tanggalSelesai;
    if (!dateString) return;
    
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Detect current theme
    const isDarkMode = document.documentElement.classList.contains('dark');
    const gradientClass = type === 'mulai' 
      ? 'from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600' 
      : 'from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600';
    const textColor = type === 'mulai' 
      ? 'text-blue-600 dark:text-blue-300' 
      : 'text-green-600 dark:text-green-300';
    const bgColor = type === 'mulai' 
      ? 'bg-blue-900/20 dark:bg-blue-900/20' 
      : 'bg-green-900/20 dark:bg-green-900/20';
    const borderColor = type === 'mulai' 
      ? 'border-blue-800/30 dark:border-blue-800/30' 
      : 'border-green-800/30 dark:border-green-800/30';
    const confirmButtonColor = type === 'mulai' 
      ? (isDarkMode ? "#3b82f6" : "#2563eb") 
      : (isDarkMode ? "#10b981" : "#059669");
    
    Swal.fire({
      title: `<span class="text-foreground text-lg font-semibold">Detail Waktu ${type === 'mulai' ? 'Mulai' : 'Selesai'}</span>`,
      html: `
        <div class="text-left">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-3 bg-linear-to-br ${gradientClass} rounded-xl">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-muted-foreground dark:text-gray-400">${type === 'mulai' ? 'Mulai' : 'Selesai'}</p>
              <p class="text-foreground font-medium dark:text-white">${formattedDate}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="p-3 bg-secondary/50 rounded-xl border dark:bg-gray-800/50 dark:border-gray-700/50">
              <p class="text-sm text-muted-foreground dark:text-gray-300 mb-1">Hari</p>
              <p class="text-foreground font-medium dark:text-white">${date.toLocaleDateString('id-ID', { weekday: 'long' })}</p>
            </div>
            <div class="p-3 bg-secondary/50 rounded-xl border dark:bg-gray-800/50 dark:border-gray-700/50">
              <p class="text-sm text-muted-foreground dark:text-gray-300 mb-1">Jam</p>
              <p class="text-foreground font-medium dark:text-white">${formattedTime}</p>
            </div>
          </div>
          <div class="p-3 ${bgColor} rounded-xl border ${borderColor}">
            <p class="text-sm ${textColor} font-medium mb-1">${type === 'mulai' ? '⏰ Waktu Mulai' : '🏁 Waktu Selesai'}</p>
            <p class="text-xs ${textColor}/80">Pastikan untuk datang ${type === 'mulai' ? '15 menit sebelum acara dimulai' : 'mengikuti acara hingga selesai'}</p>
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Mengerti",
      confirmButtonColor: confirmButtonColor,
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#f9fafb' : '#111827',
      customClass: {
        popup: 'rounded-2xl border border-border',
        confirmButton: 'px-4 py-2 rounded-lg font-medium',
      },
    });
  };

  const showDurationInfo = () => {
    if (!tanggalMulai || !tanggalSelesai) return;
    
    const startDate = new Date(tanggalMulai);
    const endDate = new Date(tanggalSelesai);
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    const durationHours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    // Detect current theme
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    Swal.fire({
      title: '<span class="text-foreground text-lg font-semibold">Durasi Acara</span>',
      html: `
        <div class="text-left">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-3 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl dark:from-purple-600 dark:to-pink-600">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-muted-foreground dark:text-gray-400">Total Durasi</p>
              <p class="text-foreground font-medium dark:text-white">${durationDays} hari ${durationHours} jam</p>
            </div>
          </div>
          <div class="space-y-3">
            <div class="p-3 bg-secondary/50 rounded-xl border dark:bg-gray-800/50 dark:border-gray-700/50">
              <p class="text-sm text-muted-foreground dark:text-gray-300 mb-1">Mulai</p>
              <p class="text-foreground dark:text-white">${formatTanggal(tanggalMulai)}</p>
              <p class="text-sm text-muted-foreground dark:text-gray-400">${formatTime(tanggalMulai)}</p>
            </div>
            <div class="p-3 bg-secondary/50 rounded-xl border dark:bg-gray-800/50 dark:border-gray-700/50">
              <p class="text-sm text-muted-foreground dark:text-gray-300 mb-1">Selesai</p>
              <p class="text-foreground dark:text-white">${formatTanggal(tanggalSelesai)}</p>
              <p class="text-sm text-muted-foreground dark:text-gray-400">${formatTime(tanggalSelesai)}</p>
            </div>
          </div>
          ${durationDays > 7 ? 
            `<div class="p-3 bg-linear-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/30 mt-4">
              <p class="text-sm text-yellow-700 dark:text-yellow-300 font-medium">📅 Acara Panjang</p>
              <p class="text-xs text-yellow-600/80 dark:text-yellow-200/80 mt-1">Acara ini berlangsung selama ${durationDays} hari</p>
            </div>` :
            `<div class="p-3 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 dark:bg-green-900/20 dark:border-green-800/30 mt-4">
              <p class="text-sm text-green-700 dark:text-green-300 font-medium">⏱️ Durasi Normal</p>
              <p class="text-xs text-green-600/80 dark:text-green-200/80 mt-1">Acara berlangsung dalam waktu yang wajar</p>
            </div>`
          }
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Tutup",
      confirmButtonColor: isDarkMode ? "#8b5cf6" : "#7c3aed",
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
          <div className="p-2 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg dark:from-purple-600 dark:to-pink-600">
            <FiCalendar className="w-5 h-5 text-white" />
          </div>
          <span className="text-foreground">Waktu Pelaksanaan</span>
          {tanggalMulai && tanggalSelesai && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 ml-auto hover:bg-secondary"
              onClick={showDurationInfo}
              title="Lihat detail durasi"
            >
              <FiInfo className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          {/* Tanggal Mulai */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-secondary/50 rounded-lg dark:bg-secondary/70">
              <FiClock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Tanggal Mulai</p>
              <div className="flex items-center justify-between">
                <p className="text-foreground font-medium dark:text-white">
                  {formatTanggal(tanggalMulai)}
                </p>
                {tanggalMulai && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-secondary"
                    onClick={() => showDateTimeDetails('mulai')}
                    title="Lihat detail waktu mulai"
                  >
                    <FiInfo className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Separator */}
          <div className="h-px bg-linear-to-r from-transparent via-border to-transparent"></div>
          
          {/* Tanggal Selesai */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-secondary/50 rounded-lg dark:bg-secondary/70">
              <FiClock className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Tanggal Selesai</p>
              <div className="flex items-center justify-between">
                <p className="text-foreground font-medium dark:text-white">
                  {formatTanggal(tanggalSelesai)}
                </p>
                {tanggalSelesai && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-secondary"
                    onClick={() => showDateTimeDetails('selesai')}
                    title="Lihat detail waktu selesai"
                  >
                    <FiInfo className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}