// components/admin/bracket/BracketRound.tsx
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
  isPlaceholder?: boolean;
}

export default function BracketRound({ 
  name, 
  urutan, 
  matches,
  isFinalRound = false,
  hasNextRound = false,
  isPlaceholder = false
}: BracketRoundProps) {
  return (
    <div className={`min-w-[300px] flex-shrink-0 relative ${
      isPlaceholder ? "opacity-75" : ""
    }`}>
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
            {isPlaceholder && (
              <Badge variant="outline" className="text-xs">
                Preview
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
        {matches.map((match) => (
          <div key={match.id} className="relative">
            <MatchCard 
              match={match} 
              showWinnerIndicator={!isPlaceholder && urutan > 1}
            />
            
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
      {isFinalRound && matches.length > 0 && !isPlaceholder && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            🏆 JUARA
          </div>
        </div>
      )}
      
      {/* Placeholder indicator */}
      {isPlaceholder && (
        <div className="absolute -top-2 -left-2">
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            Akan datang
          </div>
        </div>
      )}
    </div>
  );
}