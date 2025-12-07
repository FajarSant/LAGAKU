"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TimMultiSelectProps {
  selected: string[];
  onChange: (ids: string[]) => void;
  timList?: { id: string; nama: string }[];
  label?: string;
}

export default function TimMultiSelect({
  selected,
  onChange,
  timList = [],
  label = "Pilih Tim yang Akan Bertanding",
}: TimMultiSelectProps) {
  return (
    <div className="flex flex-col">
      <Label className="mb-1">{label}</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto border rounded p-2">
        {timList.length > 0 ? (
          timList.map((t) => (
            <div key={t.id} className="flex items-center gap-2">
              <Checkbox
                id={t.id}
                checked={selected.includes(t.id)}
                onCheckedChange={(checked) => {
                  if (checked) onChange([...selected, t.id]);
                  else onChange(selected.filter((id) => id !== t.id));
                }}
              />
              <label htmlFor={t.id} className="select-none">
                {t.nama}
              </label>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">Tidak ada tim tersedia</div>
        )}
      </div>
    </div>
  );
}
