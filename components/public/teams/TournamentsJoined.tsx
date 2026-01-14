import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Acara, TeamWithDetails } from "@/utils";

interface TournamentsJoinedProps {
  tournaments: Acara[];
  teams: TeamWithDetails[];
}

export default function TournamentsJoined({ tournaments, teams }: TournamentsJoinedProps) {
  const tournamentsJoined = tournaments.filter(tournament => 
    teams.some(team => team.acara_id === tournament.id)
  );

  if (tournamentsJoined.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 border border-gray-200 dark:border-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Trophy className="w-5 h-5" />
          Turnamen yang Diikuti
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Daftar turnamen tempat Anda berpartisipasi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tournamentsJoined.map(tournament => {
            const userTeamsInTournament = teams.filter(team => team.acara_id === tournament.id);
            
            return (
              <Card key={tournament.id} className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-lg">{tournament.nama}</h4>
                    <Link href={`/tournaments/${tournament.id}`}>
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {tournament.deskripsi || "Turnamen kompetitif"}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tim Anda:</span>
                      <span className="font-medium">
                        {userTeamsInTournament.length} tim
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {userTeamsInTournament.map(team => (
                        <Badge 
                          key={team.id} 
                          variant={team.status === "aktif" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {team.nama}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}