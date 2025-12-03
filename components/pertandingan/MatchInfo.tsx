"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Pertandingan } from "@/types/pertandingan";

export default function MatchInfo({ match }: { match: Pertandingan }) {
  return (
    <Card className="rounded-xl border border-border shadow-sm bg-card">
      <CardHeader>
        <h3 className="font-semibold text-xl tracking-wide">Detail Pertandingan</h3>
      </CardHeader>

      <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">

        <div>
          <span className="font-medium text-foreground">Status:</span>
          {" "}{match.status}
        </div>

        <div>
          <span className="font-medium text-foreground">Tanggal:</span>{" "}
          {match.tanggal_pertandingan
            ? new Date(match.tanggal_pertandingan).toLocaleString()
            : "-"}
        </div>

        <div>
          <span className="font-medium text-foreground">Lokasi:</span>{" "}
          {match.lokasi_lapangan ?? "-"}
        </div>

        <div>
          <span className="font-medium text-foreground">Durasi:</span>{" "}
          {match.durasi_menit} menit
        </div>

        <div>
          <span className="font-medium text-foreground">Menit Saat Ini:</span>{" "}
          {match.menit_saat_ini}
        </div>

        <div>
          <span className="font-medium text-foreground">Dibuat Pada:</span>{" "}
          {new Date(match.dibuat_pada).toLocaleString()}
        </div>

        {match.acara?.nama_acara && (
          <div>
            <span className="font-medium text-foreground">Acara:</span>{" "}
            {match.acara.nama_acara}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
