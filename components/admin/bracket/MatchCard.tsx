// components/MatchCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Crown } from "lucide-react";
import { formatMatchDate, getMatchStatusConfig, Pertandingan } from "@/utils";

interface MatchCardProps {
  match: Pertandingan;
}

export function MatchCard({ match }: MatchCardProps) {
  const config = getMatchStatusConfig(match.status);
  const isTeamAWinner = match.status === "selesai" && match.pemenang_id === match.tim_a_id;
  const isTeamBWinner = match.status === "selesai" && match.pemenang_id === match.tim_b_id;
  const isByeMatch = match.is_bye;

  const getStatusText = () => {
    if (match.status === "selesai") return "SELESAI";
    if (match.status === "berlangsung") return "BERLANGSUNG";
    return "DIJADWALKAN";
  };

  return (
    <Card className={`overflow-hidden border hover:shadow-lg transition-all duration-200 ${config.border} ${isByeMatch ? "border-dashed" : ""}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <Badge 
            variant="outline" 
            className={`${config.text} ${config.border} font-medium`}
          >
            {getStatusText()}
            {isByeMatch && " • BYE"}
          </Badge>
          
          {match.tanggal_pertandingan && (
            <div className="text-xs text-muted-foreground">
              {formatMatchDate(match.tanggal_pertandingan)}
            </div>
          )}
        </div>

        {/* Match Content */}
        <div className="space-y-2">
          {/* Team A */}
          <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${
            isTeamAWinner 
              ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-200 dark:border-green-800" 
              : "bg-muted/50 hover:bg-muted"
          }`}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-background border">
                <span className="text-xs font-bold">A</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${isTeamAWinner ? "text-green-700 dark:text-green-400" : ""}`}>
                  {match.tim_a?.nama || "TBD"}
                </span>
                {isTeamAWinner && (
                  <Award className="h-4 w-4 text-amber-500" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {match.status === "selesai" ? (
                <span className={`text-lg font-bold ${isTeamAWinner ? "text-green-700 dark:text-green-400" : ""}`}>
                  {match.skor_tim_a ?? 0}
                </span>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
          </div>

          {/* VS Separator */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative bg-background px-2">
              <span className="text-xs font-medium text-muted-foreground">VS</span>
            </div>
          </div>

          {/* Team B - only show if not BYE */}
          {!isByeMatch ? (
            <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              isTeamBWinner 
                ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-200 dark:border-green-800" 
                : "bg-muted/50 hover:bg-muted"
            }`}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-background border">
                  <span className="text-xs font-bold">B</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${isTeamBWinner ? "text-green-700 dark:text-green-400" : ""}`}>
                    {match.tim_b?.nama || "TBD"}
                  </span>
                  {isTeamBWinner && (
                    <Award className="h-4 w-4 text-amber-500" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {match.status === "selesai" ? (
                  <span className={`text-lg font-bold ${isTeamBWinner ? "text-green-700 dark:text-green-400" : ""}`}>
                    {match.skor_tim_b ?? 0}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 dark:bg-amber-900/30 rounded-full">
                <Crown className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                  BYE - Tim langsung lolos
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Winner Info */}
        {match.status === "selesai" && (
          <div className={`mt-3 pt-3 border-t ${config.border}`}>
            {isTeamAWinner && match.tim_a ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    {match.tim_a.nama} menang
                  </span>
                </div>
                <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                  Lolos
                </Badge>
              </div>
            ) : isTeamBWinner && match.tim_b ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    {match.tim_b.nama} menang
                  </span>
                </div>
                <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                  Lolos
                </Badge>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}