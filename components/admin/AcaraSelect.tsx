"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AcaraSelectProps {
  value: string | undefined;
  onChange: (val: string) => void;
  acaraList: { id: string; nama: string }[];
}

export default function AcaraSelect({ value, onChange, acaraList }: AcaraSelectProps) {
  return (
    <div>
      <Label>Acara</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih acara" />
        </SelectTrigger>
        <SelectContent>
          {acaraList.map((ac) => (
            <SelectItem key={ac.id} value={ac.id}>
              {ac.nama}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
