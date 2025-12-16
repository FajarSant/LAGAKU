import { Card, CardContent } from "@/components/ui/card";
import { Crown, Trophy, Target } from "lucide-react";

export default function BracketLegend() {
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="font-medium text-sm mb-3">Legenda Bracket</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></div>
            <span className="text-sm">Pertandingan selesai</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300"></div>
            <span className="text-sm">Pemenang round sebelumnya</span>
            <Crown className="h-3 w-3 text-amber-500 ml-auto" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div>
            <span className="text-sm">Pertandingan berlangsung</span>
            <Target className="h-3 w-3 text-blue-500 ml-auto" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"></div>
            <span className="text-sm">Babak final</span>
            <Trophy className="h-3 w-3 text-amber-500 ml-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}