import { Award } from "lucide-react";
import { Pertandingan } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface RecentMatchesProps {
  matches: Pertandingan[];
}

export default function RecentMatches({ matches }: RecentMatchesProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'selesai': return 'default';
      case 'berlangsung': return 'secondary';
      case 'dijadwalkan': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Pertandingan Terbaru</CardTitle>
          <Button variant="ghost" size="sm">
            Lihat Semua
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((match) => (
              <div 
                key={match.id} 
                className="p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={getStatusVariant(match.status)}>
                    {match.status === 'selesai' ? 'Selesai' :
                     match.status === 'berlangsung' ? 'Berlangsung' :
                     'Dijadwalkan'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(match.tanggal_pertandingan)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{match.tim_a?.nama || "Tim A"}</span>
                    <span className="font-bold text-lg">{match.skor_tim_a || 0}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{match.tim_b?.nama || "Tim B"}</span>
                    <span className="font-bold text-lg">{match.skor_tim_b || 0}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                  <span>{match.acara?.nama || "Turnamen"}</span>
                  <span>{match.round?.nama || "Babak"}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Pertandingan</h3>
            <p className="text-muted-foreground mb-4">
              Anda belum memiliki riwayat pertandingan
            </p>
            <Button>Lihat Jadwal</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}