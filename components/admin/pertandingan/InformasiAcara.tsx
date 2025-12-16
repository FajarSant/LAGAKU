"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  nama: string;
  tipe_acara: string;
  deskripsi?: string | null;
}

export default function InformasiAcara({ nama, tipe_acara, deskripsi }: Props) {
  return (
    <Card className="bg-white shadow-md border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Informasi Acara</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p><strong>Nama:</strong> {nama}</p>
        <p><strong>Tipe:</strong> {tipe_acara.replace("_", " ").toUpperCase()}</p>
        {deskripsi && <p><strong>Deskripsi:</strong> {deskripsi}</p>}
      </CardContent>
    </Card>
  );
}
