"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Trophy, Swords, Eye, ExternalLink } from "lucide-react";
import Link from "next/link";

interface EventCardProps {
  event: {
    id: string;
    nama: string;
    deskripsi: string | null;
    lokasi_lapangan: string | null;
    tanggal_mulai_pertandingan: string;
    total_pertandingan?: number;
    pertandingan_selesai?: number;
    total_tim?: number;
  };
  variant?: "default" | "compact";
}

export default function EventCard({ event, variant = "default" }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getEventStatus = (startDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    
    if (now < start) {
      return {
        text: "Segera",
        color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
      };
    } else {
      return {
        text: "Berlangsung",
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      };
    }
  };

  const status = getEventStatus(event.tanggal_mulai_pertandingan);

  if (variant === "compact") {
    return (
      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
              {event.nama}
            </CardTitle>
            <Badge className={`${status.color} border-0`}>
              {status.text}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pb-3">
          {event.deskripsi && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {event.deskripsi}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(event.tanggal_mulai_pertandingan)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {event.total_tim || 0}
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-between w-full">
            <Link href={`/tournaments/${event.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Detail
              </Button>
            </Link>
            <Link href={`/match/${event.id}`}>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500">
                <Swords className="w-4 h-4 mr-1" />
                Bracket
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <Badge className={`${status.color} border-0 font-medium`}>
          {status.text}
        </Badge>
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
            <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Detail Turnamen
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href={`/match/${event.id}`}>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500">
                <Swords className="w-4 h-4 mr-1" />
                Lihat Bracket
              </Button>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}