"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface JenisSelectProps {
  value: "fun" | "cup" | "liga";
  onChange: (val: "fun" | "cup" | "liga") => void;
}

export default function JenisSelect({ value, onChange }: JenisSelectProps) {
  return (
    <div>
      <Label>Jenis Pertandingan</Label>
      <Select value={value} onValueChange={(v) => onChange(v as "fun" | "cup" | "liga")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih jenis" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fun">Fun Match</SelectItem>
          <SelectItem value="cup">Cup (Bracket)</SelectItem>
          <SelectItem value="liga">Liga (Round Robin)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
