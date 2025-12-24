// components/BracketLegend.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Award, Trophy } from "lucide-react";

export function BracketLegend() {
  return (
    <Card className="border">
      <CardContent className="p-6">
        <h4 className="font-semibold text-sm mb-4 text-muted-foreground">
          LEGENDA
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Match selesai</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Sedang berlangsung</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Dijadwalkan</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Crown className="h-4 w-4 text-amber-500" />
              <span>BYE (langsung lolos)</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="h-4 w-4 text-green-500" />
              <span>Pemenang match</span>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>Babak final</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}