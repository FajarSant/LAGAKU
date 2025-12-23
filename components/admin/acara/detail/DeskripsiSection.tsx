import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiInfo, FiEdit, FiAlertCircle } from "react-icons/fi";
import Swal from "sweetalert2";

interface DeskripsiSectionProps {
  deskripsi: string | null;
}

export default function DeskripsiSection({ deskripsi }: DeskripsiSectionProps) {
  const showFullDescription = () => {
    if (!deskripsi) return;
    
    // Detect current theme
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    Swal.fire({
      title: '<span class="text-foreground text-lg font-semibold">Deskripsi Lengkap</span>',
      html: `
        <div class="text-left max-h-96 overflow-y-auto pr-2">
          <div class="prose max-w-none">
            <div class="whitespace-pre-line text-muted-foreground leading-relaxed dark:text-gray-300">
              ${deskripsi.replace(/\n/g, '<br>')}
            </div>
          </div>
          ${deskripsi.length > 500 ? 
            `<div class="mt-4 p-3 bg-linear-to-br from-blue-100 to-cyan-100 rounded-xl border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30">
              <p class="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">📝 Deskripsi Panjang</p>
              <p class="text-xs text-blue-600/80 dark:text-blue-200/80">Deskripsi ini memiliki ${deskripsi.length} karakter</p>
            </div>` : ''
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
      width: '600px',
    });
  };

  const showNoDescriptionAlert = () => {
    // Detect current theme
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    Swal.fire({
      title: '<span class="text-foreground text-lg font-semibold">Deskripsi Kosong</span>',
      html: `
        <div class="text-left">
          <div class="flex items-center justify-center mb-4">
            <div class="w-16 h-16 bg-linear-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center dark:from-yellow-600 dark:to-amber-600">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <p class="text-muted-foreground text-center mb-4 dark:text-gray-300">Acara ini belum memiliki deskripsi</p>
          <div class="p-4 bg-linear-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/30">
            <p class="text-sm text-yellow-800 dark:text-yellow-300 font-medium mb-2">💡 Saran:</p>
            <ul class="text-xs text-yellow-700/80 dark:text-yellow-200/80 space-y-1 ml-2">
              <li class="flex items-center gap-2">• Tambahkan deskripsi untuk memberikan informasi lebih detail</li>
              <li class="flex items-center gap-2">• Jelaskan tujuan dan aturan acara</li>
              <li class="flex items-center gap-2">• Sertakan informasi penting lainnya</li>
            </ul>
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Edit Deskripsi",
      confirmButtonColor: isDarkMode ? "#f59e0b" : "#d97706",
      showCancelButton: true,
      cancelButtonText: "Nanti Saja",
      cancelButtonColor: isDarkMode ? "#6b7280" : "#9ca3af",
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#f9fafb' : '#111827',
      customClass: {
        popup: 'rounded-2xl border border-border',
        confirmButton: 'px-4 py-2 rounded-lg font-medium',
        cancelButton: 'px-4 py-2 rounded-lg font-medium',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `/acara/edit/${window.location.pathname.split('/').pop()}`;
      }
    });
  };

  return (
    <div className="relative group">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/5 to-pink-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 dark:from-blue-500/5 dark:via-purple-500/3 dark:to-pink-500/3"></div>
      
      <Card className="relative bg-card/50 backdrop-blur-sm border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-400/30 dark:hover:border-blue-500/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-blue-600 to-cyan-600 rounded-lg dark:from-blue-500 dark:to-cyan-600">
                <FiInfo className="w-5 h-5 text-white" />
              </div>
              <span className="text-foreground">Deskripsi Acara</span>
            </CardTitle>
            {deskripsi && deskripsi.length > 300 && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-secondary/50"
                onClick={showFullDescription}
              >
                <FiEdit className="w-4 h-4" />
                Baca Lengkap
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-4 dark:text-gray-300">
              {deskripsi || (
                <div className="text-center py-4">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-linear-to-br from-yellow-100 to-amber-100 rounded-full dark:from-yellow-900/30 dark:to-amber-900/30">
                      <FiAlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span className="text-muted-foreground italic dark:text-gray-400">
                      Belum ada deskripsi untuk acara ini.
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 border-border hover:bg-secondary/50"
                      onClick={showNoDescriptionAlert}
                    >
                      <FiEdit className="w-4 h-4 mr-2" />
                      Tambahkan Deskripsi
                    </Button>
                  </div>
                </div>
              )}
            </p>
          </div>
          {deskripsi && deskripsi.length > 300 && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full gap-2 hover:bg-secondary/50 text-muted-foreground"
                onClick={showFullDescription}
              >
                <FiInfo className="w-4 h-4" />
                Tampilkan Deskripsi Lengkap ({deskripsi.length} karakter)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}