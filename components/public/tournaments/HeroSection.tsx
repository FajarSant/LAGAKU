import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "./StatCard";
import { Sparkles, Target, ArrowRight, CalendarRange, Trophy, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  stats: {
    totalTournaments: number;
    totalTeams: number;
    totalMatches: number;
  };
}

export function HeroSection({ stats }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-6 px-4 py-1.5 bg-linear-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Arena Kompetisi Mahasiswa
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Turnamen Kampus
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Temukan dan ikuti berbagai turnamen kompetitif antar mahasiswa.
              Tunjukkan bakat Anda, raih prestasi, dan bangun jaringan dengan
              sesama mahasiswa!
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-16">
              <Link href="#tournaments-list" passHref>
                <Button
                  size="lg"
                  className="px-8 py-6 text-base bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Target className="mr-2 w-5 h-5" />
                  Jelajahi Turnamen
                  <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Button>
              </Link>
              <Link href="/guide" passHref>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-base border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
                >
                  <CalendarRange className="mr-2 w-5 h-5" />
                  Panduan Turnamen
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            <StatCard
              title="Total Turnamen"
              value={stats.totalTournaments}
              description="Semua turnamen"
              icon={Trophy}
              color="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
            />
            <StatCard
              title="Total Tim"
              value={stats.totalTeams}
              description="Tim terdaftar"
              icon={Users}
              color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            />
            <StatCard
              title="Total Match"
              value={stats.totalMatches}
              description="Pertandingan"
              icon={TrendingUp}
              color="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}