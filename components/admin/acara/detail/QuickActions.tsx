import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FiUsers, 
  FiCalendar, 
  FiAward, 
  FiBarChart2, 
  FiChevronRight,
  FiBarChart,
  FiArrowRight
} from "react-icons/fi";
import Swal from "sweetalert2";

interface QuickActionsProps {
  acaraId: string;
  tipeAcara: string;
  acaraNama: string;
}

export default function QuickActions({ acaraId, tipeAcara, acaraNama }: QuickActionsProps) {
  const handleQuickAction = (actionName: string, href: string, description: string, gradient: string) => {
    // Detect current theme
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    Swal.fire({
      title: `<span class="text-foreground text-xl font-semibold">🚀 ${actionName}</span>`,
      html: `
        <div class="text-center">
          <div class="relative mb-6">
            <div class="absolute inset-0 ${gradient.replace('bg-linear-to-br', 'bg-linear-to-br')} blur-2xl opacity-20 rounded-full"></div>
            <div class="relative w-20 h-20 mx-auto ${gradient} rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <div class="mb-6">
            <p class="text-muted-foreground dark:text-gray-300 mb-3">${description}</p>
            <div class="p-4 bg-linear-to-br from-secondary to-secondary/80 rounded-xl border border-border dark:from-gray-800/50 dark:to-gray-900/50">
              <p class="text-sm text-muted-foreground dark:text-gray-400 mb-1">Acara:</p>
              <p class="font-semibold text-foreground text-lg dark:text-white">${acaraNama}</p>
            </div>
          </div>
          
          <div class="flex gap-3">
            <button id="cancelBtn" class="flex-1 bg-secondary hover:bg-secondary/80 text-foreground py-3 rounded-xl transition-all duration-200 font-medium dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
              Batal
            </button>
            <button id="confirmBtn" class="flex-1 ${gradient} hover:shadow-lg text-white py-3 rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2">
              <span>Lanjutkan</span>
              <FiArrowRight class="w-4 h-4" />
            </button>
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
        const confirmBtn = document.getElementById('confirmBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        
        if (confirmBtn) {
          confirmBtn.addEventListener('click', () => {
            window.location.href = href;
          });
        }
        
        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => {
            Swal.close();
          });
        }
      },
    });
  };

  const actions = [
    {
      label: "Kelola Peserta",
      href: `/acara/${acaraId}/peserta`,
      icon: <FiUsers className="w-5 h-5" />,
      gradient: "bg-gradient-to-br from-blue-600 to-cyan-600",
      gradientLight: "from-blue-500 to-cyan-500",
      hoverGradient: "hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-500",
      description: "Kelola data peserta dan pendaftaran acara",
      borderColor: "border-blue-200 dark:border-blue-800/30",
      bgColor: "bg-blue-50 dark:bg-blue-900/10",
    },
    {
      label: "Kelola Pertandingan",
      href: `/acara/${acaraId}/pertandingan`,
      icon: <FiCalendar className="w-5 h-5" />,
      gradient: "bg-gradient-to-br from-green-600 to-emerald-600",
      gradientLight: "from-green-500 to-emerald-500",
      hoverGradient: "hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-500",
      description: "Atur jadwal dan hasil pertandingan",
      borderColor: "border-green-200 dark:border-green-800/30",
      bgColor: "bg-green-50 dark:bg-green-900/10",
    },
  ];

  // Tambahkan aksi berdasarkan tipe acara
  if (tipeAcara === "SISTEM_GUGUR") {
    actions.push({
      label: "Lihat Bracket",
      href: `/acara/${acaraId}/bracket`,
      icon: <FiAward className="w-5 h-5" />,
      gradient: "bg-gradient-to-br from-yellow-600 to-orange-600",
      gradientLight: "from-yellow-500 to-orange-500",
      hoverGradient: "hover:bg-gradient-to-br hover:from-yellow-500 hover:to-orange-500",
      description: "Lihat bracket sistem gugur",
      borderColor: "border-yellow-200 dark:border-yellow-800/30",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/10",
    });
  }

  if (tipeAcara === "SISTEM_KOMPETISI") {
    actions.push({
      label: "Lihat Klasemen",
      href: `/acara/${acaraId}/klasemen`,
      icon: <FiBarChart2 className="w-5 h-5" />,
      gradient: "bg-gradient-to-br from-purple-600 to-pink-600",
      gradientLight: "from-purple-500 to-pink-500",
      hoverGradient: "hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500",
      description: "Lihat klasemen sistem kompetisi",
      borderColor: "border-purple-200 dark:border-purple-800/30",
      bgColor: "bg-purple-50 dark:bg-purple-900/10",
    });
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-3">
            <div className="p-2 bg-linear-to-br from-cyan-500 to-blue-500 rounded-lg dark:from-cyan-600 dark:to-blue-600">
              <FiBarChart className="w-5 h-5 text-white" />
            </div>
            <span className="text-foreground">Aksi Cepat</span>
          </CardTitle>
          <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
            {actions.length} aksi
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleQuickAction(action.label, action.href, action.description, action.gradient)}
            className={`w-full group relative overflow-hidden rounded-xl p-4 border ${action.borderColor} ${action.bgColor} hover:shadow-lg transition-all duration-300 text-left`}
          >
            {/* Background Hover Effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${action.gradient} -z-10`} />
            
            {/* Content */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${action.gradient} group-hover:scale-110 transition-transform duration-300`}>
                  {action.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-white transition-colors">
                    {action.label}
                  </h3>
                  <p className="text-xs text-muted-foreground group-hover:text-white/80 transition-colors mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground group-hover:text-white/80 hidden sm:inline transition-colors">
                  Akses
                </span>
                <FiChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          </button>
        ))}
        
        {/* Info Footer */}
        <div className="pt-4 mt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            Pilih aksi untuk mengelola detail acara
          </p>
        </div>
      </CardContent>
    </Card>
  );
}