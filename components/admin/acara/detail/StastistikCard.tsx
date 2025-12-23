import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FiUsers, FiGrid, FiSettings, FiActivity, FiInfo } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { ConfigItem } from "@/constants/config";

interface StatistikCardsProps {
  pesertaCount: number;
  jumlahPertandingan: number;
  jumlahGrup: number;
  jenisAcaraConfig: ConfigItem;
}

export default function StatistikCards({
  pesertaCount,
  jumlahPertandingan,
  jumlahGrup,
  jenisAcaraConfig,
}: StatistikCardsProps) {
  const stats = [
    {
      label: "Total Peserta",
      value: pesertaCount,
      icon: <FiUsers className="w-6 h-6 text-white" />,
      gradient: "from-blue-600 to-cyan-600",
      darkGradient: "from-blue-600 to-cyan-600",
      lightGradient: "from-blue-500 to-cyan-500",
      borderColor: "dark:hover:border-blue-500/50 light:hover:border-blue-400/50",
      bgGradient: "dark:from-blue-600/20 dark:to-cyan-600/20 light:from-blue-100 light:to-cyan-100",
      description: "Jumlah total peserta yang terdaftar dalam acara ini",
      showDetails: () => showPesertaDetails(),
    },
    {
      label: "Pertandingan",
      value: jumlahPertandingan,
      icon: <span className="text-2xl">⚽</span>,
      gradient: "from-green-600 to-emerald-600",
      darkGradient: "from-green-600 to-emerald-600",
      lightGradient: "from-green-500 to-emerald-500",
      borderColor: "dark:hover:border-green-500/50 light:hover:border-green-400/50",
      bgGradient: "dark:from-green-600/20 dark:to-emerald-600/20 light:from-green-100 light:to-emerald-100",
      description: "Jumlah pertandingan yang telah dijadwalkan",
      showDetails: () => showPertandinganDetails(),
    },
    {
      label: "Grup",
      value: jumlahGrup,
      icon: <FiGrid className="w-6 h-6 text-white" />,
      gradient: "from-purple-600 to-pink-600",
      darkGradient: "from-purple-600 to-pink-600",
      lightGradient: "from-purple-500 to-pink-500",
      borderColor: "dark:hover:border-purple-500/50 light:hover:border-purple-400/50",
      bgGradient: "dark:from-purple-600/20 dark:to-pink-600/20 light:from-purple-100 light:to-pink-100",
      description: "Jumlah grup yang dibentuk dalam acara",
      showDetails: () => showGrupDetails(),
    },
    {
      label: "Sistem Acara",
      value: jenisAcaraConfig.label,
      icon: <FiSettings className="w-6 h-6 text-white" />,
      gradient: "from-red-600 to-orange-600",
      darkGradient: "from-red-600 to-orange-600",
      lightGradient: "from-red-500 to-orange-500",
      borderColor: "dark:hover:border-red-500/50 light:hover:border-red-400/50",
      bgGradient: "dark:from-red-600/20 dark:to-orange-600/20 light:from-red-100 light:to-orange-100",
      description: "Sistem kompetisi yang digunakan dalam acara",
      showDetails: () => showSystemDetails(),
    },
  ];

  const showPesertaDetails = () => {
    Swal.fire({
      title: '<span class="dark:text-white light:text-gray-800 text-lg font-semibold">Detail Peserta</span>',
      html: `
        <div class="text-left">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-3 bg-linear-to-br from-blue-600 to-cyan-600 rounded-xl">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 4.65V18a2 2 0 01-2 2h-2a2 2 0 01-2-2v-1.35" />
              </svg>
            </div>
            <div>
              <p class="text-sm dark:text-gray-400 light:text-gray-500">Total Peserta</p>
              <p class="text-2xl font-bold dark:text-white light:text-gray-800">${pesertaCount}</p>
            </div>
          </div>
          <div class="space-y-3">
            <div class="p-3 dark:bg-gray-800/50 light:bg-gray-100 rounded-xl border dark:border-gray-700/50 light:border-gray-300">
              <p class="text-sm dark:text-gray-300 light:text-gray-600 mb-1">📊 Statistik</p>
              <p class="dark:text-white light:text-gray-800">${pesertaCount} peserta terdaftar</p>
            </div>
            <div class="p-3 ${pesertaCount > 0 ? 'bg-linear-to-br from-green-600/20 to-emerald-600/20 border border-green-800/30' : 'bg-linear-to-br from-yellow-600/20 to-amber-600/20 border border-yellow-800/30'} rounded-xl">
              <p class="text-sm ${pesertaCount > 0 ? 'text-green-600' : 'text-yellow-600'} font-medium mb-1">
                ${pesertaCount > 0 ? '✅ Ada Peserta' : '⚠️ Belum Ada Peserta'}
              </p>
              <p class="text-xs ${pesertaCount > 0 ? 'text-green-600/80' : 'text-yellow-600/80'}">
                ${pesertaCount > 0 ? 'Acara sudah memiliki peserta yang terdaftar' : 'Belum ada peserta yang terdaftar dalam acara ini'}
              </p>
            </div>
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Tutup",
      confirmButtonColor: "#3b82f6",
      background: 'rgb(var(--background))',
      color: 'rgb(var(--foreground))',
      customClass: {
        popup: 'rounded-2xl border dark:border-gray-800 light:border-gray-200',
        confirmButton: 'px-4 py-2 rounded-lg',
      },
    });
  };

  const showPertandinganDetails = () => {
    Swal.fire({
      title: '<span class="dark:text-white light:text-gray-800 text-lg font-semibold">Detail Pertandingan</span>',
      html: `
        <div class="text-left">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-3 bg-linear-to-br from-green-600 to-emerald-600 rounded-xl">
              <span class="text-2xl">⚽</span>
            </div>
            <div>
              <p class="text-sm dark:text-gray-400 light:text-gray-500">Total Pertandingan</p>
              <p class="text-2xl font-bold dark:text-white light:text-gray-800">${jumlahPertandingan}</p>
            </div>
          </div>
          <div class="space-y-3">
            <div class="p-3 dark:bg-gray-800/50 light:bg-gray-100 rounded-xl border dark:border-gray-700/50 light:border-gray-300">
              <p class="text-sm dark:text-gray-300 light:text-gray-600 mb-1">📅 Jadwal</p>
              <p class="dark:text-white light:text-gray-800">${jumlahPertandingan} pertandingan dijadwalkan</p>
            </div>
            <div class="p-3 ${jumlahPertandingan > 0 ? 'bg-linear-to-br from-green-600/20 to-emerald-600/20 border border-green-800/30' : 'bg-linear-to-br from-blue-600/20 to-cyan-600/20 border border-blue-800/30'} rounded-xl">
              <p class="text-sm ${jumlahPertandingan > 0 ? 'text-green-600' : 'text-blue-600'} font-medium mb-1">
                ${jumlahPertandingan > 0 ? '🎯 Pertandingan Terjadwal' : '📝 Siap Dijadwalkan'}
              </p>
              <p class="text-xs ${jumlahPertandingan > 0 ? 'text-green-600/80' : 'text-blue-600/80'}">
                ${jumlahPertandingan > 0 ? 'Beberapa pertandingan sudah dijadwalkan' : 'Belum ada pertandingan yang dijadwalkan'}
              </p>
            </div>
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Tutup",
      confirmButtonColor: "#10b981",
      background: 'rgb(var(--background))',
      color: 'rgb(var(--foreground))',
      customClass: {
        popup: 'rounded-2xl border dark:border-gray-800 light:border-gray-200',
        confirmButton: 'px-4 py-2 rounded-lg',
      },
    });
  };

  const showGrupDetails = () => {
    Swal.fire({
      title: '<span class="dark:text-white light:text-gray-800 text-lg font-semibold">Detail Grup</span>',
      html: `
        <div class="text-left">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-3 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p class="text-sm dark:text-gray-400 light:text-gray-500">Total Grup</p>
              <p class="text-2xl font-bold dark:text-white light:text-gray-800">${jumlahGrup}</p>
            </div>
          </div>
          <div class="space-y-3">
            <div class="p-3 dark:bg-gray-800/50 light:bg-gray-100 rounded-xl border dark:border-gray-700/50 light:border-gray-300">
              <p class="text-sm dark:text-gray-300 light:text-gray-600 mb-1">🏆 Pembagian</p>
              <p class="dark:text-white light:text-gray-800">Acara terbagi dalam ${jumlahGrup} grup</p>
            </div>
            <div class="p-3 ${jumlahGrup > 0 ? 'bg-linear-to-br from-purple-600/20 to-pink-600/20 border border-purple-800/30' : 'bg-linear-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-800/30'} rounded-xl">
              <p class="text-sm ${jumlahGrup > 0 ? 'text-purple-600' : 'text-indigo-600'} font-medium mb-1">
                ${jumlahGrup > 0 ? '👥 Grup Terbentuk' : '🗂️ Siap Dibagi'}
              </p>
              <p class="text-xs ${jumlahGrup > 0 ? 'text-purple-600/80' : 'text-indigo-600/80'}">
                ${jumlahGrup > 0 ? 'Peserta sudah dibagi ke dalam grup' : 'Belum ada grup yang dibentuk untuk acara ini'}
              </p>
            </div>
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Tutup",
      confirmButtonColor: "#8b5cf6",
      background: 'rgb(var(--background))',
      color: 'rgb(var(--foreground))',
      customClass: {
        popup: 'rounded-2xl border dark:border-gray-800 light:border-gray-200',
        confirmButton: 'px-4 py-2 rounded-lg',
      },
    });
  };

  const showSystemDetails = () => {
    Swal.fire({
      title: '<span class="dark:text-white light:text-gray-800 text-lg font-semibold">Detail Sistem</span>',
      html: `
        <div class="text-left">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-3 bg-linear-to-br from-red-600 to-orange-600 rounded-xl">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm dark:text-gray-400 light:text-gray-500">Sistem Acara</p>
              <p class="text-2xl font-bold dark:text-white light:text-gray-800">${jenisAcaraConfig.label}</p>
            </div>
          </div>
          <div class="space-y-3">
            <div class="p-3 dark:bg-gray-800/50 light:bg-gray-100 rounded-xl border dark:border-gray-700/50 light:border-gray-300">
              <p class="text-sm dark:text-gray-300 light:text-gray-600 mb-1">📋 Deskripsi Sistem</p>
              <p class="dark:text-white light:text-gray-800">${jenisAcaraConfig.label === "Sistem Gugur" 
                ? "Peserta yang kalah akan langsung gugur dari turnamen" 
                : jenisAcaraConfig.label === "Sistem Kompetisi" 
                ? "Peserta mengumpulkan poin dari setiap pertandingan" 
                : "Kombinasi fase grup dan fase knockout"}</p>
            </div>
            <div class="p-3 bg-linear-to-br from-red-600/20 to-orange-600/20 rounded-xl border border-red-800/30">
              <p class="text-sm text-red-600 font-medium mb-1">🎯 Sistem ${jenisAcaraConfig.label}</p>
              <p class="text-xs text-red-600/80">
                Sistem ini ${jenisAcaraConfig.label === "Sistem Gugur" 
                  ? "cocok untuk turnamen dengan waktu terbatas" 
                  : jenisAcaraConfig.label === "Sistem Kompetisi" 
                  ? "cocok untuk liga atau kompetisi panjang" 
                  : "cocok untuk turnamen besar dengan banyak peserta"}
              </p>
            </div>
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Tutup",
      confirmButtonColor: "#ef4444",
      background: 'rgb(var(--background))',
      color: 'rgb(var(--foreground))',
      customClass: {
        popup: 'rounded-2xl border dark:border-gray-800 light:border-gray-200',
        confirmButton: 'px-4 py-2 rounded-lg',
      },
    });
  };

  return (
    <Card className="dark:bg-gray-900/40 light:bg-white/80 backdrop-blur-sm border dark:border-gray-800/50 light:border-gray-300/50 rounded-2xl shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-3 dark:text-white light:text-gray-800">
          <div className="p-2 bg-linear-to-br from-orange-600 to-yellow-600 rounded-lg">
            <FiActivity className="w-5 h-5 text-white" />
          </div>
          Statistik Acara
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 ${stat.bgGradient} rounded-xl blur-lg group-hover:blur-xl transition-all duration-300`}></div>
              <div 
                className={`relative dark:bg-gray-900/50 light:bg-white/80 backdrop-blur-sm border dark:border-gray-800/50 light:border-gray-300/50 rounded-xl p-5 text-center ${stat.borderColor} transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
                onClick={stat.showDetails}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-12 h-12 bg-linear-to-br dark:${stat.darkGradient} light:${stat.lightGradient} rounded-xl flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 dark:hover:bg-gray-700/50 light:hover:bg-gray-200/50 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      stat.showDetails();
                    }}
                    title={`Lihat detail ${stat.label}`}
                  >
                    <FiInfo className="w-4 h-4 dark:text-gray-400 light:text-gray-600" />
                  </Button>
                </div>
                <p className={`text-3xl font-bold dark:text-white light:text-gray-800 mb-1 ${typeof stat.value === 'string' ? 'text-lg' : ''}`}>
                  {stat.value}
                </p>
                <p className="text-sm dark:text-gray-400 light:text-gray-600">{stat.label}</p>
                <p className="text-xs dark:text-gray-500 light:text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Klik untuk detail
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}