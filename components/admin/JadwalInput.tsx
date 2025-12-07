"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JadwalInputProps {
  tanggal?: string;
  waktu?: string;
  lokasi?: string;
  onChange: (data: { tanggal: string; waktu: string; lokasi: string }) => void;
}

export default function JadwalInput({ tanggal, waktu, lokasi, onChange }: JadwalInputProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Tanggal</Label>
        <Input
          type="date"
          value={tanggal || ""}
          onChange={(e) => onChange({ tanggal: e.target.value, waktu: waktu || "", lokasi: lokasi || "" })}
        />
      </div>
      <div>
        <Label>Waktu</Label>
        <Input
          type="time"
          value={waktu || ""}
          onChange={(e) => onChange({ tanggal: tanggal || "", waktu: e.target.value, lokasi: lokasi || "" })}
        />
      </div>
      <div className="md:col-span-2">
        <Label>Lokasi (Opsional)</Label>
        <Input
          type="text"
          value={lokasi || ""}
          placeholder="Contoh: Lapangan A, GOR ..."
          onChange={(e) => onChange({ tanggal: tanggal || "", waktu: waktu || "", lokasi: e.target.value })}
        />
      </div>
    </div>
  );
}
