"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Navigation from "@/components/navigation/navigation";
import Footer from "@/components/public/Footer";
import { HeroSection } from "@/components/public/tournaments/HeroSection";
import { SearchSection } from "@/components/public/tournaments/SearchSection";
import { TournamentsLoading } from "@/components/public/tournaments/TournamentsLoading";
import { TournamentCard } from "@/components/public/tournaments/TournamentCard";
import { EmptyState } from "@/components/public/tournaments/EmptyState";
import { InfoSection } from "@/components/public/tournaments/InfoSection";
import { Acara } from "@/utils";

interface AcaraWithCount {
  id: string;
  nama: string;
  deskripsi: string | null;
  dibuat_pada: string;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  tim: { count: number }[];
  pertandingan: { count: number }[];
  round: { count: number }[];
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Acara[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("acara")
        .select(`
          *,
          tim:tim(count),
          pertandingan:pertandingan(count),
          round:round(count)
        `)
        .order("dibuat_pada", { ascending: false });

      if (error) throw error;

      const transformedData: Acara[] = (data as AcaraWithCount[]).map(
        (item) => ({
          id: item.id,
          nama: item.nama,
          deskripsi: item.deskripsi,
          dibuat_pada: item.dibuat_pada,
          tanggal_mulai: item.tanggal_mulai,
          tanggal_selesai: item.tanggal_selesai,
          _count: {
            tim: item.tim[0]?.count || 0,
            pertandingan: item.pertandingan[0]?.count || 0,
            round: item.round[0]?.count || 0,
          },
        })
      );

      setTournaments(transformedData);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tournaments berdasarkan search query
  const filteredTournaments = tournaments.filter((tournament) => {
    return (
      tournament.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false
    );
  });

  // Hitung statistik dari data tournaments
  const totalTournaments = tournaments.length;
  const totalTeams = tournaments.reduce(
    (sum, t) => sum + (t._count?.tim || 0),
    0
  );
  const totalMatches = tournaments.reduce(
    (sum, t) => sum + (t._count?.pertandingan || 0),
    0
  );

  const stats = {
    totalTournaments,
    totalTeams,
    totalMatches,
  };

  const handleResetSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      <Navigation />

      <HeroSection stats={stats} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12" id="tournaments-list">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter Section */}
          <SearchSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalResults={filteredTournaments.length}
            totalTournaments={tournaments.length}
          />

          {/* Tournaments List */}
          <div className="mb-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                Daftar Turnamen Tersedia
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Pilih turnamen yang ingin Anda ikuti atau saksikan
              </p>
            </div>

            {loading ? (
              <TournamentsLoading />
            ) : filteredTournaments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTournaments.map((tournament) => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </div>
            ) : (
              <EmptyState
                searchQuery={searchQuery}
                onResetSearch={handleResetSearch}
              />
            )}
          </div>

          {/* Info Section */}
          <InfoSection />
        </div>
      </div>

      <Footer />
    </div>
  );
}