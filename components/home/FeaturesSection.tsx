import { Trophy, Users, Shield, BarChart3, Clock, Award, Globe, Zap } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

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
  {
    icon: Globe,
    title: "Multi-Platform",
    description: "Akses dari desktop dan mobile dengan pengalaman yang konsisten di semua perangkat.",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Perform Optimal",
    description: "Platform cepat dan responsif dengan teknologi terbaru untuk pengalaman mulus.",
    gradient: "from-amber-500 to-orange-500",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Mengapa Memilih{" "}
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SportConnect?
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Platform turnamen olahraga terintegrasi dengan fitur-fitur lengkap untuk pengalaman kompetisi terbaik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <CardContent className="p-6 relative z-10">
                  {/* Icon */}
                  <div className={`mb-4 p-3 rounded-xl bg-linear-to-br ${feature.gradient} w-fit`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-200">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>

                  {/* Hover Effect Line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
      
      </div>
    </section>
  );
} 