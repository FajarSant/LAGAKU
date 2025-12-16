import { Badge } from "@/components/ui/badge";
import MatchCard from "./MatchCard";
import { Match } from "@/types/type";
import { ChevronRight } from "lucide-react";

interface BracketRoundProps {
  name: string;
  urutan: number;
  matches: Match[];
  isFinalRound?: boolean;
  hasNextRound?: boolean;
}

export default function BracketRound({ 
  name, 
  urutan, 
  matches,
  isFinalRound = false,
  hasNextRound = false
}: BracketRoundProps) {
  return (
    <div className="min-w-[300px] flex-shrink-0 relative">
      {/* Round Header */}
      <div className="mb-4 pb-3 border-b sticky top-0 bg-white z-20">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{name}</h3>
            {isFinalRound && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                FINAL
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            R{urutan}
          </Badge>
        </div>
        <p className="text-sm text-gray-500">
          {matches.length} pertandingan
        </p>
      </div>

      {/* Matches */}
      <div className="space-y-4">
        {matches.map((match, index) => (
          <div key={match.id} className="relative">
            <MatchCard match={match} />
            
            {/* Arrow untuk next round */}
            {hasNextRound && (
              <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Round badge untuk final */}
      {isFinalRound && matches.length > 0 && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            🏆 JUARA
          </div>
        </div>
      )}
    </div>
  );
}