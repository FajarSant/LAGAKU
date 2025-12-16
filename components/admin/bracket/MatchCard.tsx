import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { Match } from "@/types/type";

interface MatchCardProps {
  match: Match & { isWinnerFromPrevRound?: boolean };
}

export default function MatchCard({ match }: MatchCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "selesai":
        return "bg-green-100 text-green-800 border-green-200";
      case "berlangsung":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isTeamAWinner = match.status === "selesai" && 
                       match.skor_tim_a !== null && 
                       match.skor_tim_b !== null && 
                       match.skor_tim_a > match.skor_tim_b;

  const isTeamBWinner = match.status === "selesai" && 
                       match.skor_tim_a !== null && 
                       match.skor_tim_b !== null && 
                       match.skor_tim_b > match.skor_tim_a;

  const isTeamAFromPrevWinner = match.isWinnerFromPrevRound && match.tim_a;
  const isTeamBFromPrevWinner = match.isWinnerFromPrevRound && match.tim_b;

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${
      match.status === "selesai" ? "border-green-200" : ""
    }`}>
      <CardContent className="p-4">
        {/* Status dengan pemenang indicator */}
        <div className="mb-3 flex items-center justify-between">
          <Badge className={`text-xs ${getStatusColor(match.status)} border`}>
            {match.status}
          </Badge>
          
          {(isTeamAFromPrevWinner || isTeamBFromPrevWinner) && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Crown className="h-3 w-3 text-amber-500" />
              Pemenang round sebelumnya
            </Badge>
          )}
        </div>

        {/* Teams */}
        <div className="space-y-3">
          {/* Team A */}
          <div className={`flex justify-between items-center p-2 rounded ${
            isTeamAWinner ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200" :
            isTeamAFromPrevWinner ? "bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200" :
            "bg-gray-50"
          }`}>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {match.tim_a?.nama || "BYE"}
              </span>
              {isTeamAFromPrevWinner && (
                <Crown className="h-3 w-3 text-amber-500" />
              )}
            </div>
            <span className={`font-bold text-lg ${
              isTeamAWinner ? "text-green-700" : ""
            }`}>
              {match.skor_tim_a ?? "-"}
            </span>
          </div>

          {/* Team B */}
          <div className={`flex justify-between items-center p-2 rounded ${
            isTeamBWinner ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200" :
            isTeamBFromPrevWinner ? "bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200" :
            "bg-gray-50"
          }`}>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {match.tim_b?.nama || "BYE"}
              </span>
              {isTeamBFromPrevWinner && (
                <Crown className="h-3 w-3 text-amber-500" />
              )}
            </div>
            <span className={`font-bold text-lg ${
              isTeamBWinner ? "text-green-700" : ""
            }`}>
              {match.skor_tim_b ?? "-"}
            </span>
          </div>
        </div>

        {/* Winner announcement */}
        {match.status === "selesai" &&
          match.skor_tim_a !== null &&
          match.skor_tim_b !== null && (
            <div className="mt-3 pt-3 border-t border-green-200">
              {isTeamAWinner ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-green-600 font-medium">
                    🏆 {match.tim_a?.nama} menang
                  </p>
                  <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                    Lolos ke round berikutnya
                  </Badge>
                </div>
              ) : isTeamBWinner ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-green-600 font-medium">
                    🏆 {match.tim_b?.nama} menang
                  </p>
                  <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                    Lolos ke round berikutnya
                  </Badge>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Hasil seri</p>
              )}
            </div>
          )}
      </CardContent>
    </Card>
  );
}