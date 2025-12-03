"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function MatchScore({
  skorTuanRumah,
  skorTamu,
}: {
  skorTuanRumah: number;
  skorTamu: number;
}) {
  return (
    <Card className="mt-4">
      <CardContent className="flex items-center justify-center py-6">
        <p className="text-5xl font-bold">
          {skorTuanRumah}
          <span className="text-3xl mx-4 text-muted-foreground">:</span>
          {skorTamu}
        </p>
      </CardContent>
    </Card>
  );
}
