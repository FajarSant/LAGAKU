"use client";

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
  ArrowRight,
  PlusCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { TeamWithDetails } from "@/utils";
import StatCard from "./StatCard";

interface HeroSectionProps {
  teams: TeamWithDetails[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onCreateTeam: () => void;
  onDeleteTeam: (teamId: string) => void;
}

export default function HeroSection({ 
  teams, 
  loading, 
  error, 
  onRefresh, 
  onCreateTeam, 
  onDeleteTeam 
}: HeroSectionProps) {
  // Hitung statistik sesuai dengan kode utama
  const stats = {
    totalTeams: teams.length,
    teamsWithoutAcara: teams.filter((t) => !t.acara_id).length,
    activeTeams: teams.filter(t => t.status === 'aktif').length,
    totalMatches: teams.reduce((sum, team) => sum + (team._count?.pertandingan || 0), 0),
    totalMembers: teams.reduce((sum, team) => sum + (team.anggota_tim?.length || 0), 0),
    tournamentsJoined: teams.filter(t => t.acara_id).length,
    teamsWithMatches: teams.filter(t => (t._count?.pertandingan || 0) > 0).length
  };

  // ... (sisanya sama seperti sebelumnya, hanya props interface yang diperbarui)

  if (loading) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="h-6 w-32 mb-4 bg-gray-200 dark:bg-gray-700 mx-auto" />
              <Skeleton className="h-12 w-3/4 mb-6 bg-gray-200 dark:bg-gray-700 mx-auto" />
              <Skeleton className="h-5 w-1/2 mb-8 bg-gray-200 dark:bg-gray-700 mx-auto" />
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <Skeleton className="h-6 w-20 mb-2 bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-8 w-16 bg-gray-200 dark:bg-gray-700" />
                </div>
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
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                <AlertCircle className="w-4 h-4" />
                Terjadi Kesalahan
              </div>
              <p className="text-red-600 dark:text-red-400 mb-3">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                onClick={onRefresh}
              >
                Coba Lagi
              </Button>
            </div>
          )}
          
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-1.5 bg-linear-to-r from-blue-500 to-purple-500 text-white border-0 shadow-md hover:from-blue-600 hover:to-purple-600 transition-colors">
              <Zap className="w-3 h-3 mr-1.5 animate-pulse" />
              Dashboard Tim
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Kelola Tim Anda
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Pantau dan kelola semua tim Anda dalam satu dashboard. Mulai dari pembuatan tim, pendaftaran turnamen, hingga pelacakan performa pertandingan.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <Button
                onClick={onCreateTeam}
                size="lg"
                className="px-6 py-5 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <PlusCircle className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Buat Tim Baru
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Button>
              
              <Link href="/tournaments" passHref>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 py-5 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group"
                >
                  <Trophy className="mr-2 w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:animate-bounce" />
                  Lihat Turnamen
                  <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Button>
              </Link>
              
              <Button
                onClick={onRefresh}
                size="lg"
                variant="ghost"
                className="px-6 py-5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors group"
              >
                <span className="mr-2 group-hover:rotate-180 transition-transform duration-500">⟳</span>
                Refresh Data
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            <StatCard
              icon={Users}
              label="Total Tim"
              value={stats.totalTeams}
              sublabel={`${stats.activeTeams} aktif`}
              color="text-blue-600 dark:text-blue-400"
              bgColor="bg-blue-50 dark:bg-blue-900/20"
              borderColor="border-blue-200 dark:border-blue-800"
              trend={stats.totalTeams > 0 ? "positive" : "neutral"}
            />
            <StatCard
              icon={TrendingUp}
              label="Dalam Turnamen"
              value={stats.tournamentsJoined}
              sublabel={`${stats.teamsWithoutAcara} belum daftar`}
              color="text-green-600 dark:text-green-400"
              bgColor="bg-green-50 dark:bg-green-900/20"
              borderColor="border-green-200 dark:border-green-800"
              trend={stats.tournamentsJoined > 0 ? "positive" : "neutral"}
            />
            <StatCard
              icon={UserPlus}
              label="Total Anggota"
              value={stats.totalMembers}
              sublabel={`rata-rata ${stats.totalTeams > 0 ? Math.round(stats.totalMembers / stats.totalTeams) : 0}/tim`}
              color="text-purple-600 dark:text-purple-400"
              bgColor="bg-purple-50 dark:bg-purple-900/20"
              borderColor="border-purple-200 dark:border-purple-800"
              trend={stats.totalMembers > 0 ? "positive" : "neutral"}
            />
            <StatCard
              icon={Calendar}
              label="Total Pertandingan"
              value={stats.totalMatches}
              sublabel={`${stats.teamsWithMatches} tim bertanding`}
              color="text-yellow-600 dark:text-yellow-400"
              bgColor="bg-yellow-50 dark:bg-yellow-900/20"
              borderColor="border-yellow-200 dark:border-yellow-800"
              trend={stats.totalMatches > 0 ? "positive" : "neutral"}
            />
            <StatCard
              icon={Trophy}
              label="Pencapaian"
              value={stats.activeTeams}
              sublabel="tim aktif"
              color="text-pink-600 dark:text-pink-400"
              bgColor="bg-pink-50 dark:bg-pink-900/20"
              borderColor="border-pink-200 dark:border-pink-800"
              trend={stats.activeTeams > 0 ? "positive" : "neutral"}
            />
          </div>

          {/* Quick Stats Info */}
          {stats.totalTeams === 0 && !loading && (
            <Card className="border-0 shadow-xl bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm mb-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full -translate-x-12 translate-y-12" />
              
              <CardContent className="p-6 md:p-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start mb-3">
                      <Sparkles className="w-6 h-6 mr-2 text-blue-500 animate-pulse" />
                      <CardTitle className="text-xl md:text-2xl">
                        Siap Mulai Petualangan?
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-300 max-w-md">
                      Anda belum memiliki tim. Buat tim pertama Anda sekarang dan ikuti turnamen seru bersama teman-teman!
                      Atau bergabunglah dengan tim yang sudah ada untuk memulai kompetisi.
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={onCreateTeam}
                      size="lg"
                      className="px-6 py-5 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
                    >
                      <PlusCircle className="mr-2 w-5 h-5" />
                      Buat Tim Pertama
                    </Button>
                    <Link href="/tournaments" passHref>
                      <Button
                        size="lg"
                        variant="outline"
                        className="px-6 py-5 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        <Trophy className="mr-2 w-5 h-5" />
                        Jelajahi Turnamen
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}