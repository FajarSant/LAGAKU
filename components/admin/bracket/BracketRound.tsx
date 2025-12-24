// components/BracketRound.tsx
import { Users, ChevronRight, Crown, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MatchCard } from "./MatchCard";
import { BracketRoundData, getRoundDisplayName, isFinalRound } from "@/utils";
interface BracketRoundProps {
  bracketRound: BracketRoundData;
  hasNextRound?: boolean;
}

export function BracketRound({ bracketRound, hasNextRound = false }: BracketRoundProps) {
  const { round, matches, isPlaceholder = false } = bracketRound;
  
  const displayName = getRoundDisplayName(round.nama, round.urutan, matches.length);
  const byeMatches = matches.filter((m) => m.is_bye);
  const normalMatches = matches.filter((m) => !m.is_bye);
  const completedMatches = normalMatches.filter((m) => m.status === "selesai").length;
  const isFinal = isFinalRound(normalMatches);

  return (
    <div className={`min-w-[320px] flex-shrink-0 ${isPlaceholder ? "opacity-75" : ""}`}>
      {/* Round Header */}
      <div className="mb-4 pb-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg tracking-tight">{displayName}</h3>
            {isFinal && !isPlaceholder && (
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                FINAL
              </Badge>
            )}
            {isPlaceholder && (
              <Badge variant="outline" className="text-xs">
                Preview
              </Badge>
            )}
          </div>
          <Badge variant="secondary" className="font-mono">
            R{round.urutan}
          </Badge>
        </div>
        
        {/* Round Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{normalMatches.length} match</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
            <span>{completedMatches} selesai</span>
          </div>
          {byeMatches.length > 0 && (
            <div className="flex items-center gap-1">
              <Crown className="h-3 w-3 text-amber-500" />
              <span>{byeMatches.length} bye</span>
            </div>
          )}
        </div>
      </div>

      {/* Matches */}
      <div className="space-y-4">
        {normalMatches.map((match, index) => (
          <div key={match.id} className="relative group">
            <MatchCard match={match} />
            
            {/* Connector Arrow */}
            {hasNextRound && !isPlaceholder && (
              <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-sm rounded-full"></div>
                  <ChevronRight className="h-5 w-5 text-primary relative" />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Bye Matches Section */}
        {byeMatches.length > 0 && (
          <div className="pt-4 border-t">
            <div className="text-xs font-medium text-muted-foreground mb-2">
              Tim dengan BYE
            </div>
            <div className="space-y-2">
              {byeMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-200 dark:border-amber-800 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-medium">
                        {match.tim_a?.nama || "TBD"}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400">
                      BYE
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-amber-600 dark:text-amber-500">
                    Langsung lolos ke round berikutnya
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Final Champion Badge */}
      {isFinal && matches.length > 0 && !isPlaceholder && matches[0].status === "selesai" && (
        <div className="absolute -top-2 -right-2 animate-pulse">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            🏆 JUARA
          </div>
        </div>
      )}
    </div>
  );
}