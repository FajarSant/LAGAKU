import { UserStats } from "@/utils";
import { Award, Users, Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileStatsProps {
  stats: UserStats;
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Turnamen Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-sm"></div>
                <Award className="relative w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold">{stats.tournamentsJoined}</div>
              <p className="text-sm text-muted-foreground">Turnamen</p>
            </div>
          </CardContent>
        </Card>

        {/* Tim Aktif Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-green-500/10 rounded-full blur-sm"></div>
                <Users className="relative w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold">{stats.activeTeams}</div>
              <p className="text-sm text-muted-foreground">Tim Aktif</p>
            </div>
          </CardContent>
        </Card>

        {/* Pertandingan Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-sm"></div>
                <Clock className="relative w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{stats.totalMatches}</div>
              <p className="text-sm text-muted-foreground">Pertandingan</p>
            </div>
          </CardContent>
        </Card>

        {/* Akan Datang Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-sm"></div>
                <Calendar className="relative w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">{stats.upcomingMatches}</div>
              <p className="text-sm text-muted-foreground">Akan Datang</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}