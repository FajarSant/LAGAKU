"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function MatchHeader({
  home,
  away,
  homeLogo,
  awayLogo
}: {
  home: string;
  away: string;
  homeLogo?: string | null;
  awayLogo?: string | null;
}) {
  return (
    <Card className="rounded-xl border border-border shadow-sm bg-card">
      <CardHeader className="flex flex-row items-center gap-6">

        {/* Tuan Rumah */}
        <div className="flex flex-col items-center flex-1">
          {homeLogo ? (
            <img
              src={homeLogo}
              alt={home}
              className="w-14 h-14 object-contain rounded-full border"
            />
          ) : (
            <div className="w-14 h-14 bg-muted rounded-full" />
          )}
          <p className="mt-2 font-semibold">{home}</p>
        </div>

        <p className="text-muted-foreground text-xl font-light">vs</p>

        {/* Tamu */}
        <div className="flex flex-col items-center flex-1">
          {awayLogo ? (
            <img
              src={awayLogo}
              alt={away}
              className="w-14 h-14 object-contain rounded-full border"
            />
          ) : (
            <div className="w-14 h-14 bg-muted rounded-full" />
          )}
          <p className="mt-2 font-semibold">{away}</p>
        </div>

      </CardHeader>
    </Card>
  );
}
