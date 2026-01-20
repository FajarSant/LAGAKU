"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/navigation/navigation";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Trophy,
  Calendar,
  Users,
  MapPin,
  Clock,
  ChevronRight,
  Filter,
  Building,
  Award,
  Swords,
  CalendarDays,
  CalendarCheck,
  Eye,
  ExternalLink,
  ArrowRight,
  Search,
  RefreshCw
} from "lucide-react";

interface Event {
  id: string;
  nama: string;
  deskripsi: string | null;
  lokasi_lapangan: string | null;
  url_lokasi_maps: string | null;
  tanggal_mulai_pertandingan: string;
  tanggal_selesai_pertandingan: string;
  deadline_pendaftaran: string;
  total_pertandingan?: number;
  pertandingan_selesai?: number;
  total_tim?: number;
}

export default function EventsPage() {
  const supabase = createClient();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const { data: eventsData, error: eventsError } = await supabase
        .from('acara')
        .select('*')
        .order('tanggal_mulai_pertandingan', { ascending: false });

      if (eventsError) throw eventsError;

      const eventsWithStats = await Promise.all(
        (eventsData || []).map(async (event) => {
          const { count: totalMatches } = await supabase
            .from('pertandingan')
            .select('*', { count: 'exact', head: true })
            .eq('acara_id', event.id);

          const { count: completedMatches } = await supabase
            .from('pertandingan')
            .select('*', { count: 'exact', head: true })
            .eq('acara_id', event.id)
            .eq('status', 'selesai');

          const { count: totalTeams } = await supabase
            .from('tim')
            .select('*', { count: 'exact', head: true })
            .eq('acara_id', event.id);

          return {
            ...event,
            total_pertandingan: totalMatches || 0,
            pertandingan_selesai: completedMatches || 0,
            total_tim: totalTeams || 0
          };
        })
      );

      setEvents(eventsWithStats);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getEventStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      return {
        text: 'Segera',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-100'
      };
    } else if (now >= start && now <= end) {
      return {
        text: 'Berlangsung',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-100'
      };
    } else {
      return {
        text: 'Selesai',
        color: 'bg-slate-100 text-slate-800 border-slate-200',
        bgColor: 'bg-slate-50',
        borderColor: 'border-slate-100'
      };
    }
  };

  const filteredEvents = events.filter(event =>
    event.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.deskripsi && event.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                <Trophy className="w-3 h-3 mr-1.5" />
                Turnamen
              </Badge>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Daftar Turnamen
              </h1>

              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Temukan dan ikuti turnamen seru yang sedang berlangsung dan akan datang
              </p>
            </div>

            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari turnamen..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Semua Turnamen
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {loading ? 'Memuat...' : `${filteredEvents.length} turnamen ditemukan`}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchEvents}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 mb-4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Tidak ada turnamen ditemukan
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery ? 'Coba dengan kata kunci lain' : 'Belum ada turnamen yang tersedia'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const status = getEventStatus(event.tanggal_mulai_pertandingan, event.tanggal_selesai_pertandingan);
                
                return (
                  <Card 
                    key={event.id} 
                    className={`border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-200 ${status.borderColor}`}
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className={`${status.color} border-0 font-medium`}>
                        {status.text}
                      </Badge>
                    </div>

                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${status.bgColor}`}>
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                            {event.nama}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(event.tanggal_mulai_pertandingan)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-4">
                      {/* Description */}
                      {event.deskripsi && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {event.deskripsi}
                        </p>
                      )}

                      {/* Info Grid */}
                      <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {event.total_tim || 0}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Tim</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {event.total_pertandingan || 0}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Match</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {event.pertandingan_selesai || 0}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Selesai</div>
                        </div>
                      </div>

                      {/* Location */}
                      {event.lokasi_lapangan && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-4">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{event.lokasi_lapangan}</span>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex justify-between w-full">
                        <Link href={`/tournaments/${event.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Detail Turnamen
                          </Button>
                        </Link>
                        <div className="flex gap-2">
                          {event.url_lokasi_maps && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(event.url_lokasi_maps!, '_blank')}
                              className="p-2"
                              title="Lokasi Maps"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                          <Link href={`/match/${event.id}`}>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-500 to-purple-500"
                            >
                              <Swords className="w-4 h-4 mr-1" />
                              Bracket
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Quick Stats */}
          {!loading && events.length > 0 && (
            <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {events.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Turnamen</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {events.filter(e => {
                      const now = new Date();
                      const start = new Date(e.tanggal_mulai_pertandingan);
                      const end = new Date(e.tanggal_selesai_pertandingan);
                      return now >= start && now <= end;
                    }).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sedang Berlangsung</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {events.filter(e => new Date() < new Date(e.tanggal_mulai_pertandingan)).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Segera Datang</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                    {events.reduce((acc, event) => acc + (event.total_tim || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Tim</div>
                </div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Siap Bergabung dengan Turnamen?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Daftarkan tim Anda sekarang dan raih kemenangan dalam kompetisi seru
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/match">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                  Lihat Semua Pertandingan
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/guide">
                <Button variant="outline">
                  Panduan Turnamen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}