import { SupabasePertandingan } from "@/app/(public)/jadwal-pertandingan/page";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Clock, Calendar, Trophy } from "lucide-react";

interface ScheduleStatsProps {
  loading: boolean;
  schedule: SupabasePertandingan[];
}

export default function ScheduleStats({ loading, schedule }: ScheduleStatsProps) {
  // Calculate statistics
  const stats = {
    total: schedule.length,
    berlangsung: schedule.filter(m => m.status === "berlangsung").length,
    dijadwalkan: schedule.filter(m => m.status === "dijadwalkan").length,
    selesai: schedule.filter(m => m.status === "selesai").length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Jadwal</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? (
                  <Skeleton className="h-8 w-16 bg-gray-200 dark:bg-gray-700" />
                ) : (
                  stats.total
                )}
              </h3>
            </div>
            <CalendarDays className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Berlangsung</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? (
                  <Skeleton className="h-8 w-16 bg-gray-200 dark:bg-gray-700" />
                ) : (
                  stats.berlangsung
                )}
              </h3>
            </div>
            <Clock className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dijadwalkan</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? (
                  <Skeleton className="h-8 w-16 bg-gray-200 dark:bg-gray-700" />
                ) : (
                  stats.dijadwalkan
                )}
              </h3>
            </div>
            <Calendar className="w-8 h-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Selesai</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {loading ? (
                  <Skeleton className="h-8 w-16 bg-gray-200 dark:bg-gray-700" />
                ) : (
                  stats.selesai
                )}
              </h3>
            </div>
            <Trophy className="w-8 h-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}