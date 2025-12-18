"use client";

import { useState, useEffect } from "react";
import StatusFilter from "@/components/home/StatusFilter";
import MatchesList from "@/components/home/MatchesList";
import Navigation from "@/components/navigation/navigation";
import FeaturesSection from "@/components/home/FeaturesSection";
import { Trophy, TrendingUp, Users, CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function HomePage() {
  const [selectedStatus, setSelectedStatus] = useState("berlangsung");
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({
    tournaments: 0,
    matches: 0,
    activeTeams: 0,
    todayMatches: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const supabase = createClient();
      
      // Fetch semua statistik secara paralel
      const [
        tournamentsData,
        matchesData,
        teamsData,
        todayMatchesData
      ] = await Promise.all([
        // Jumlah turnamen
        supabase.from('acara').select('id', { count: 'exact' }),
        
        // Jumlah pertandingan
        supabase.from('pertandingan').select('id', { count: 'exact' }),
        
        // Jumlah tim aktif
        supabase.from('tim').select('id', { count: 'exact' }).eq('status', 'aktif'),
        
        // Pertandingan hari ini
        supabase.from('pertandingan')
          .select('id', { count: 'exact' })
          .eq('tanggal_pertandingan', new Date().toISOString().split('T')[0])
      ]);

      setStats({
        tournaments: tournamentsData.count || 0,
        matches: matchesData.count || 0,
        activeTeams: teamsData.count || 0,
        todayMatches: todayMatchesData.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white pb-20 md:pb-0">
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Selamat Datang di Arena Kompetisi
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              Platform turnamen terpadu untuk mengatur, ikuti, dan saksikan pertandingan seru
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-500 transition">
                <div className="flex flex-col items-center">
                  <Trophy className="w-10 h-10 text-yellow-500 mb-3" />
                  {loadingStats ? (
                    <div className="h-8 w-16 bg-gray-700 rounded animate-pulse mb-2"></div>
                  ) : (
                    <span className="text-3xl font-bold">{stats.tournaments}</span>
                  )}
                  <span className="text-gray-400 text-sm">Turnamen</span>
                </div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-green-500 transition">
                <div className="flex flex-col items-center">
                  <TrendingUp className="w-10 h-10 text-green-500 mb-3" />
                  {loadingStats ? (
                    <div className="h-8 w-16 bg-gray-700 rounded animate-pulse mb-2"></div>
                  ) : (
                    <span className="text-3xl font-bold">{stats.matches}</span>
                  )}
                  <span className="text-gray-400 text-sm">Pertandingan</span>
                </div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-red-500 transition">
                <div className="flex flex-col items-center">
                  <Users className="w-10 h-10 text-red-500 mb-3" />
                  {loadingStats ? (
                    <div className="h-8 w-16 bg-gray-700 rounded animate-pulse mb-2"></div>
                  ) : (
                    <span className="text-3xl font-bold">{stats.activeTeams}</span>
                  )}
                  <span className="text-gray-400 text-sm">Tim Aktif</span>
                </div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500 transition">
                <div className="flex flex-col items-center">
                  <CalendarDays className="w-10 h-10 text-purple-500 mb-3" />
                  {loadingStats ? (
                    <div className="h-8 w-16 bg-gray-700 rounded animate-pulse mb-2"></div>
                  ) : (
                    <span className="text-3xl font-bold">{stats.todayMatches}</span>
                  )}
                  <span className="text-gray-400 text-sm">Hari Ini</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Pertandingan</h2>
          <p className="text-gray-400">Lacak pertandingan dengan filter status</p>
        </div>

        <StatusFilter
          selectedStatus={selectedStatus}
          setSelectedStatus={(v) => {
            setSelectedStatus(v);
            setPage(1); // Reset page saat tab diganti
          }}
        />

        <div className="mt-8">
          <MatchesList
            selectedStatus={selectedStatus}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>

      <FeaturesSection />

      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    SportConnect
                  </h3>
                  <p className="text-xs text-gray-400">Competition Hub</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Platform turnamen olahraga terdepan untuk kompetisi yang adil dan transparan.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Navigasi</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition">Beranda</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Turnamen</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Tim</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Jadwal</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition">Buat Turnamen</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Daftar Tim</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Live Score</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Statistik</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Kontak</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Email: support@sportconnect.id</li>
                <li>Telepon: (021) 1234-5678</li>
                <li>Alamat: Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500">© 2025 SportConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}