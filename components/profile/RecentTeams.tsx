import { Users } from "lucide-react";
import { AnggotaTim } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RecentTeamsProps {
  teams: AnggotaTim[];
}

export default function RecentTeams({ teams }: RecentTeamsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Tim Terbaru</CardTitle>
          <Button variant="ghost" size="sm">
            Lihat Semua
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {teams.length > 0 ? (
          <div className="space-y-3">
            {teams.map((team) => (
              <div 
                key={team.id} 
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-medium">{team.tim?.nama}</p>
                  <p className="text-sm text-muted-foreground">{team.tim?.acara?.nama}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{team.nama_pemain}</span>
                    {team.nim && <span>• {team.nim}</span>}
                  </div>
                </div>
                <Badge variant={team.tim?.status === 'aktif' ? 'default' : 'secondary'}>
                  {team.tim?.status === 'aktif' ? 'Aktif' : 'Gugur'}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Belum Bergabung dengan Tim</h3>
            <p className="text-muted-foreground mb-4">
              Anda belum bergabung dengan tim dalam turnamen apapun
            </p>
            <Button>Lihat Turnamen</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}