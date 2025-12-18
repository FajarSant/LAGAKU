import { Trophy, Users, Shield, BarChart3, Clock, Award } from "lucide-react";

const features = [
  {
    icon: Trophy,
    title: "Turnamen Terorganisir",
    description: "Kelola turnamen dengan sistem gugur otomatis, jadwal fleksibel, dan hasil real-time.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Users,
    title: "Manajemen Tim",
    description: "Daftarkan tim, kelola anggota, dan pantau statistik performa dengan mudah.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Fair Play System",
    description: "Sistem penilaian adil dengan wasit terverifikasi dan pelaporan transparan.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Analisis Statistik",
    description: "Pantau performa tim dengan statistik mendetail dan prediksi pertandingan.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Clock,
    title: "Live Updates",
    description: "Update skor langsung, notifikasi real-time, dan streaming pertandingan.",
    gradient: "from-red-500 to-pink-500",
  },
  {
    icon: Award,
    title: "Sistem Poin & Ranking",
    description: "Akumulasi poin, peringkat dinamis, dan penghargaan otomatis untuk pemenang.",
    gradient: "from-indigo-500 to-purple-500",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900/50 to-gray-950/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Mengapa Memilih{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SportConnect?
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Platform turnaman olahraga terintegrasi dengan fitur-fitur lengkap untuk pengalaman kompetisi terbaik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`mb-6 p-3 rounded-xl bg-gradient-to-br ${feature.gradient} w-fit`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>

                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
            <h3 className="text-2xl font-bold mb-4">Siap untuk Kompetisi?</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Bergabung dengan ratusan tim dan ribuan pemain dalam turnamen seru. Daftar sekarang dan raih kemenangan!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all transform hover:scale-105">
                Daftar Turnamen
              </button>
              <button className="px-8 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg font-semibold transition">
                Lihat Panduan
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}