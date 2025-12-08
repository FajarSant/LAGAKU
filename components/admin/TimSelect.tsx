"use client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TimSelectProps {
  value?: string;
  onChange: (val: string) => void;
  timList?: { id: string; nama: string }[];
  label?: string;
}

export default function TimSelect({ value = "", onChange, timList = [], label = "Tim" }: TimSelectProps) {
  return (
    <div className="flex flex-col">
      <Label className="mb-1">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Pilih ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {timList.length > 0 ? (
            timList.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.nama}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>
              Tidak ada tim
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
