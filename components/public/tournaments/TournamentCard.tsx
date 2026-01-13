import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Users,
  Calendar,
  CalendarDays,
  Award,
  Eye,
  UsersRound,
  Clock,
  CheckCircle,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { Acara } from "@/utils";

interface TournamentCardProps {
  tournament: Acara;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const getTournamentStatus = () => {
    if (!tournament.tanggal_mulai || !tournament.tanggal_selesai) {
      return {
        label: "Tidak Terjadwal",
        variant: "outline" as const,
        color: "text-gray-500",
        bgColor: "bg-gray-100 dark:bg-gray-800",
        icon: Calendar,
      };
    }

    const today = new Date();
    const startDate = new Date(tournament.tanggal_mulai);
    const endDate = new Date(tournament.tanggal_selesai);

    if (today < startDate) {
      return {
        label: "Akan Datang",
        variant: "secondary" as const,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        icon: Clock,
      };
    } else if (today > endDate) {
      return {
        label: "Selesai",
        variant: "destructive" as const,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        icon: CheckCircle,
      };
    } else {
      return {
        label: "Berlangsung",
        variant: "default" as const,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        icon: PlayCircle,
      };
    }
  };

  const status = getTournamentStatus();
  const timCount = tournament._count?.tim || 0;
  const pertandinganCount = tournament._count?.pertandingan || 0;
  const roundCount = tournament._count?.round || 0;

  return (
    <Card className="group overflow-hidden border-2 border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className={`h-2 ${status.bgColor}`} />
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="secondary"
                className={`${status.bgColor} ${status.color} border-0`}
              >
                <div className="flex items-center gap-1">
                  <status.icon className="w-3 h-3" />
                  <span className="text-xs font-semibold">{status.label}</span>
                </div>
              </Badge>
              {roundCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Trophy className="w-3 h-3 mr-1" />
                  {roundCount} Babak
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl font-bold mb-2">
              <Link
                href={`/tournaments/${tournament.id}`}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
              >
                {tournament.nama}
              </Link>
            </CardTitle>
            {tournament.deskripsi && (
              <CardDescription className="line-clamp-2 text-gray-600 dark:text-gray-300">
                {tournament.deskripsi}
              </CardDescription>
            )}
          </div>
          <div className="shrink-0">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`text-center p-3 rounded-lg ${status.bgColor}`}>
              <div className="flex flex-col items-center">
                <Users className="w-5 h-5 mb-1 text-gray-600 dark:text-gray-300" />
                <span className="text-lg font-bold">{timCount}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Tim
                </span>
              </div>
            </div>
            <div className={`text-center p-3 rounded-lg ${status.bgColor}`}>
              <div className="flex flex-col items-center">
                <PlayCircle className="w-5 h-5 mb-1 text-gray-600 dark:text-gray-300" />
                <span className="text-lg font-bold">{pertandinganCount}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Match
                </span>
              </div>
            </div>
            <div className={`text-center p-3 rounded-lg ${status.bgColor}`}>
              <div className="flex flex-col items-center">
                <Award className="w-5 h-5 mb-1 text-gray-600 dark:text-gray-300" />
                <span className="text-lg font-bold">{roundCount}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Babak
                </span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="font-medium mr-2">Mulai:</span>
              <span className="font-semibold">
                {tournament.tanggal_mulai
                  ? new Date(tournament.tanggal_mulai).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "Belum ditentukan"}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <CalendarDays className="w-4 h-4 mr-2" />
              <span className="font-medium mr-2">Selesai:</span>
              <span className="font-semibold">
                {tournament.tanggal_selesai
                  ? new Date(tournament.tanggal_selesai).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "Belum ditentukan"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Dibuat:{" "}
            {new Date(tournament.dibuat_pada).toLocaleDateString("id-ID")}
          </div>
          <div className="flex gap-2">
            <Link href={`/tournaments/${tournament.id}`}>
              <Button size="sm" variant="outline" className="gap-1">
                <Eye className="w-3 h-3" />
                Lihat
              </Button>
            </Link>
            <Link href={`/tournaments/${tournament.id}/register`}>
              <Button
                size="sm"
                className="gap-1 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={status.label === "Selesai"}
              >
                <UsersRound className="w-3 h-3" />
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}