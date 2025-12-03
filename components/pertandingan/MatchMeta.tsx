"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function MatchMeta({
  tanggal,
  lokasi,
  status,
}: {
  tanggal: string | null;
  lokasi: string | null;
  status: string;
}) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <h3 className="font-semibold text-lg">Informasi Pertandingan</h3>
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Tanggal:</strong> {tanggal ? new Date(tanggal).toLocaleString() : "-"}</p>
        <p><strong>Lokasi:</strong> {lokasi ?? "-"}</p>
      </CardContent>
    </Card>
  );
}
