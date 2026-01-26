"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/navigation/navigation";
import Footer from "@/components/public/Footer";
import Bracket from "@/components/public/tournaments/brucket/Bracket";
import { createClient } from "@/lib/supabase/client";
import {
  Trophy,
  Calendar,
  Users,
  MapPin,
  Clock,
  ChevronLeft,
  RefreshCw,
  Award,
  Swords,
  Home,
  ArrowLeft,
  CalendarCheck
} from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  nama: string;
  deskripsi: string | null;
  lokasi_lapangan: string | null;
  url_lokasi_maps: string | null;
  tanggal_mulai_pertandingan: string;
  tanggal_selesai_pertandingan: string;
  deadline_pendaftaran: string;
}

export default function TournamentBracketPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMatches: 0,
    completedMatches: 0,
    totalTeams: 0,
    ongoingMatches: 0,
  });

  const eventId = params.id as string;

  useEffect(() => {
    if (eventId) {
      fetchEventData();
      fetchStats();
    }
  }, [eventId]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      
      const { data: eventData, error } = await supabase
        .from("acara")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) throw error;
      setEvent(eventData);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [
        { count: totalMatches },
        { count: completedMatches },
        { count: totalTeams },
        { count: ongoingMatches }
      ] = await Promise.all([
        supabase
          .from("pertandingan")
          .select("*", { count: "exact", head: true })
          .eq("acara_id", eventId),
        supabase
          .from("pertandingan")
          .select("*", { count: "exact", head: true })
          .eq("acara_id", eventId)
          .eq("status", "selesai"),
        supabase
          .from("tim")
          .select("*", { count: "exact", head: true })
          .eq("acara_id", eventId),
        supabase
          .from("pertandingan")
          .select("*", { count: "exact", head: true })
          .eq("acara_id", eventId)
          .eq("status", "berlangsung"),
      ]);

      setStats({
        totalMatches: totalMatches || 0,
        completedMatches: completedMatches || 0,
        totalTeams: totalTeams || 0,
        ongoingMatches: ongoingMatches || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto text-center">
            <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Turnamen Tidak Ditemukan
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Turnamen yang Anda cari tidak ditemukan atau telah dihapus
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/match">
                <Button>
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Kembali ke Daftar Turnamen
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  <Home className="mr-2 w-4 h-4" />
                  Beranda
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navigation />

      {/* Header Section */}
      <div className="bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <Link href="/match" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Turnamen
              </Link>
              <ChevronLeft className="w-4 h-4 rotate-180" />
              <span className="text-gray-900 dark:text-white font-medium">
                Bracket
              </span>
            </div>

            {/* Event Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {event.nama}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.tanggal_mulai_pertandingan)}
                  </span>
                  {event.lokasi_lapangan && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.lokasi_lapangan}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    fetchEventData();
                    fetchStats();
                  }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Link href={`/tournaments/${eventId}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    Detail Turnamen
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="border border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Tim</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.totalTeams}
                      </p>
                    </div>
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Pertandingan</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats.totalMatches}
                      </p>
                    </div>
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                      <Swords className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Selesai</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {stats.completedMatches}
                      </p>
                    </div>
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <CalendarCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Berlangsung</p>
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {stats.ongoingMatches}
                      </p>
                    </div>
                    <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                      <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Bracket Section */}
          <Card className="border border-gray-200 dark:border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Tournament Bracket
              </CardTitle>
              <CardDescription>
                Sistem turnamen gugur dengan bracket visual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Bracket eventId={eventId} />
            </CardContent>
          </Card>

          {/* Event Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Left Column - Event Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Informasi Turnamen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.deskripsi && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Deskripsi</h4>
                      <p className="text-gray-600 dark:text-gray-300">{event.deskripsi}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Jadwal</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Mulai:</span>
                          <span className="font-medium">{formatDateTime(event.tanggal_mulai_pertandingan)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Selesai:</span>
                          <span className="font-medium">{formatDateTime(event.tanggal_selesai_pertandingan)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Deadline Daftar:</span>
                          <span className="font-medium">{formatDateTime(event.deadline_pendaftaran)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {event.lokasi_lapangan && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Lokasi</h4>
                        <p className="text-gray-600 dark:text-gray-300">{event.lokasi_lapangan}</p>
                        {event.url_lokasi_maps && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => window.open(event.url_lokasi_maps!, '_blank')}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Buka di Maps
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Navigation */}
            <div className="space-y-6">
              <Card className="border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle>Navigasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/match">
                    <Button variant="outline" className="w-full justify-start">
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Kembali ke Daftar Turnamen
                    </Button>
                  </Link>
                  <Link href={`/tournaments/${eventId}`}>
                    <Button variant="outline" className="w-full justify-start">
                      <Award className="mr-2 w-4 h-4" />
                      Detail Turnamen
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full justify-start">
                      <Home className="mr-2 w-4 h-4" />
                      Beranda
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle>Sistem Turnamen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-gray-600 dark:text-gray-300">Sistem Gugur (Knockout)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-gray-600 dark:text-gray-300">Pemenang maju ke babak berikutnya</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-gray-600 dark:text-gray-300">BYE untuk tim ganjil</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}