import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiStar, FiCalendar, FiDownload, FiCopy, FiInfo } from "react-icons/fi";
import Swal from "sweetalert2";
import { formatDateTime } from "@/utils/formatters";

interface MetadataSectionProps {
  dibuatPada: string;
  acaraId: string;
  onCopyId: () => void;
}

export default function MetadataSection({ 
  dibuatPada, 
  acaraId, 
  onCopyId 
}: MetadataSectionProps) {
  const showCreatedDetails = () => {
    const date = new Date(dibuatPada);
    const formattedFullDate = date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const timeDiff = Date.now() - date.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    // Detect current theme
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    Swal.fire({
      title: '<span class="text-foreground text-lg font-semibold">Detail Pembuatan</span>',
      html: `
        <div class="text-left">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-3 bg-linear-to-br from-gray-600 to-gray-700 rounded-xl dark:from-gray-700 dark:to-gray-800">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-muted-foreground dark:text-gray-400">Dibuat Pada</p>
              <p class="text-foreground font-medium dark:text-white">${formattedFullDate}</p>
            </div>
          </div>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-secondary/50 rounded-xl border dark:bg-gray-800/50 dark:border-gray-700/50">
                <p class="text-sm text-muted-foreground dark:text-gray-300 mb-1">Hari</p>
                <p class="text-foreground dark:text-white">${date.toLocaleDateString('id-ID', { weekday: 'long' })}</p>
              </div>
              <div class="p-3 bg-secondary/50 rounded-xl border dark:bg-gray-800/50 dark:border-gray-700/50">
                <p class="text-sm text-muted-foreground dark:text-gray-300 mb-1">Jam</p>
                <p class="text-foreground dark:text-white">${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            <div class="p-3 ${
              daysDiff < 7 
                ? 'bg-linear-to-br from-green-100 to-emerald-100 rounded-xl border border-green-200 dark:bg-green-900/20 dark:border-green-800/30' 
                : 'bg-linear-to-br from-blue-100 to-cyan-100 rounded-xl border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30'
            }">
              <p class="text-sm ${
                daysDiff < 7 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-blue-700 dark:text-blue-300'
              } font-medium mb-1">
                ${daysDiff < 7 ? '🆕 Baru Dibuat' : '📅 Sudah Lama'}
              </p>
              <p class="text-xs ${
                daysDiff < 7 
                  ? 'text-green-600/80 dark:text-green-200/80' 
                  : 'text-blue-600/80 dark:text-blue-200/80'
              }">
                Dibuat ${daysDiff} hari yang lalu
              </p>
            </div>
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Tutup",
      confirmButtonColor: isDarkMode ? "#6b7280" : "#9ca3af",
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#f9fafb' : '#111827',
      customClass: {
        popup: 'rounded-2xl border border-border',
        confirmButton: 'px-4 py-2 rounded-lg font-medium',
      },
    });
  };

  const showIdDetails = () => {
    // Detect current theme
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    Swal.fire({
      title: '<span class="text-foreground text-lg font-semibold">ID Acara</span>',
      html: `
        <div class="text-left">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-3 bg-linear-to-br from-indigo-500 to-violet-500 rounded-xl dark:from-indigo-600 dark:to-violet-600">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-muted-foreground dark:text-gray-400">ID Unik</p>
              <p class="text-foreground font-mono text-sm dark:text-white">${acaraId}</p>
            </div>
          </div>
          <div class="space-y-3">
            <div class="p-3 bg-secondary/50 rounded-xl border dark:bg-gray-800/50 dark:border-gray-700/50">
              <p class="text-sm text-muted-foreground dark:text-gray-300 mb-1">📝 Fungsi ID</p>
              <p class="text-foreground text-sm dark:text-white">ID ini digunakan untuk mengidentifikasi acara secara unik dalam sistem</p>
            </div>
            <div class="p-3 bg-linear-to-br from-purple-100 to-pink-100 rounded-xl border border-purple-200 dark:bg-purple-900/20 dark:border-purple-800/30">
              <p class="text-sm text-purple-700 dark:text-purple-300 font-medium mb-1">🔑 Penting!</p>
              <p class="text-xs text-purple-600/80 dark:text-purple-200/80">
                Simpan ID ini untuk referensi atau berbagi acara dengan orang lain
              </p>
            </div>
            <div class="flex gap-2 mt-4">
              <button id="copyBtn" class="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 rounded-lg transition-all duration-200 font-medium">
                Salin ID
              </button>
              <button id="closeBtn" class="flex-1 bg-secondary hover:bg-secondary/80 text-foreground py-2 rounded-lg transition-all duration-200 font-medium dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white">
                Tutup
              </button>
            </div>
          </div>
        </div>
      `,
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#f9fafb' : '#111827',
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-2xl border border-border',
      },
      didOpen: () => {
        const copyBtn = document.getElementById('copyBtn');
        const closeBtn = document.getElementById('closeBtn');
        
        if (copyBtn) {
          copyBtn.addEventListener('click', () => {
            onCopyId();
            Swal.close();
          });
        }
        
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            Swal.close();
          });
        }
      },
    });
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-3">
          <div className="p-2 bg-linear-to-br from-gray-600 to-gray-700 rounded-lg dark:from-gray-700 dark:to-gray-800">
            <FiStar className="w-5 h-5 text-white" />
          </div>
          <span className="text-foreground">Informasi Sistem</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dibuat Pada Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <FiCalendar className="w-4 h-4" />
              Dibuat Pada
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-secondary"
              onClick={showCreatedDetails}
              title="Lihat detail waktu pembuatan"
            >
              <FiInfo className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-foreground font-medium dark:text-white">
            {formatDateTime(dibuatPada)}
          </p>
        </div>
        
        {/* ID Acara Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <FiDownload className="w-4 h-4" />
              ID Acara
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-secondary"
              onClick={showIdDetails}
              title="Lihat detail ID"
            >
              <FiInfo className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between bg-secondary/50 border border-border/50 p-3 rounded-xl">
            <code className="text-sm text-foreground font-mono truncate mr-2 dark:text-gray-300">
              {acaraId}
            </code>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-secondary"
                onClick={onCopyId}
                title="Salin ID"
              >
                <FiCopy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}