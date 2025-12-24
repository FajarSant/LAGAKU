// components/EmptyBracket.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users } from "lucide-react";

interface EmptyBracketProps {
  acaraId: string;
  onCreateMatch: (acaraId: string) => void;
}

export function EmptyBracket({ acaraId, onCreateMatch }: EmptyBracketProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-12 text-center">
        <div className="max-w-sm mx-auto space-y-4">
          <div className="inline-flex p-3 rounded-lg bg-muted">
            <Trophy className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Belum Ada Bracket</h3>
            <p className="text-sm text-muted-foreground">
              Belum ada bracket yang dibuat untuk acara ini. Mulai dengan membuat pertandingan.
            </p>
          </div>
          <div className="pt-4">
            <Button
              onClick={() => onCreateMatch(acaraId)}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Buat Pertandingan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}