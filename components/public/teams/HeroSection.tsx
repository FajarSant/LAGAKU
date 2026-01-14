import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  UserPlus,
  Zap,
  Sparkles,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { TeamWithDetails } from "@/utils";
import StatCard from "./StatCard";

interface HeroSectionProps {
  teams: TeamWithDetails[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export default function HeroSection({ teams, loading, error, onRefresh }: HeroSectionProps) {
  // Hitung statistik termasuk turnamen yang diikuti
  const tournamentIds = new Set(teams.map(team => team.acara_id));
  const stats = {
    totalTeams: teams.length,
    activeTeams: teams.filter(t => t.status === "aktif").length,
    totalMatches: teams.reduce((sum, team) => sum + (team._count?.pertandingan || 0), 0),
    totalMembers: teams.reduce((sum, team) => sum + (team._count?.anggota_tim || 0), 0),
    tournamentsJoined: tournamentIds.size
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-12 w-64 mb-8 bg-gray-200 dark:bg-gray-700 mx-auto" />
            <Skeleton className="h-16 w-3/4 mb-6 bg-gray-200 dark:bg-gray-700 mx-auto" />
            <Skeleton className="h-6 w-1/2 mb-8 bg-gray-200 dark:bg-gray-700 mx-auto" />
            
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-32 bg-gray-200 dark:bg-gray-700" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />

      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={onRefresh}
              >
                Coba Lagi
              </Button>
            </div>
          )}
          
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-1.5 bg-linear-to-r from-blue-500 to-purple-500 text-white border-0 shadow-md">
              <Zap className="w-3 h-3 mr-1.5" />
              Tim & Turnamen Saya
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Dashboard Tim
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Kelola dan pantau tim Anda di berbagai turnamen. Lacak performa, anggota tim, dan pertandingan dalam satu tempat.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            <StatCard
              icon={Users}
              label="Total Tim"
              value={stats.totalTeams}
              color="text-blue-600 dark:text-blue-400"
              bgColor="bg-blue-100 dark:bg-blue-900/30"
              textColor="text-blue-700 dark:text-blue-300"
            />
            <StatCard
              icon={TrendingUp}
              label="Tim Aktif"
              value={stats.activeTeams}
              color="text-green-600 dark:text-green-400"
              bgColor="bg-green-100 dark:bg-green-900/30"
              textColor="text-green-700 dark:text-green-300"
            />
            <StatCard
              icon={Trophy}
              label="Turnamen Diikuti"
              value={stats.tournamentsJoined}
              color="text-yellow-600 dark:text-yellow-400"
              bgColor="bg-yellow-100 dark:bg-yellow-900/30"
              textColor="text-yellow-700 dark:text-yellow-300"
            />
            <StatCard
              icon={Calendar}
              label="Total Pertandingan"
              value={stats.totalMatches}
              color="text-purple-600 dark:text-purple-400"
              bgColor="bg-purple-100 dark:bg-purple-900/30"
              textColor="text-purple-700 dark:text-purple-300"
            />
            <StatCard
              icon={UserPlus}
              label="Total Anggota"
              value={stats.totalMembers}
              color="text-pink-600 dark:text-pink-400"
              bgColor="bg-pink-100 dark:bg-pink-900/30"
              textColor="text-pink-700 dark:text-pink-300"
            />
          </div>

          {/* CTA Section */}
          <Card className="border-0 shadow-xl bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div>
                  <CardTitle className="text-xl md:text-2xl mb-2 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                    Ingin Bergabung dengan Tim Lain?
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Jelajahi turnamen yang sedang berlangsung dan temukan tim yang sesuai dengan kemampuan Anda.
                  </CardDescription>
                </div>
                <Link href="/tournaments" passHref>
                  <Button
                    size="lg"
                    className="px-6 py-5 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg group"
                  >
                    <Trophy className="mr-2 w-4 h-4 group-hover:animate-bounce" />
                    Jelajahi Turnamen
                    <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}