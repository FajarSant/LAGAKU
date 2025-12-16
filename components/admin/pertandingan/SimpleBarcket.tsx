"use client";

import { Pertandingan, Tim } from "@/types/pertandingan";

interface Props {
  matches: Pertandingan[];
  timList: Tim[];
}

export default function SimpleBracket({ matches, timList }: Props) {
  return (
    <div className="grid gap-4">
      {matches.map((m, index) => {
        const timA = timList.find(t => t.id === m.tim_a_id);
        const timB = timList.find(t => t.id === m.tim_b_id);
        return (
          <div key={m.id} className="flex justify-between items-center p-4 rounded-lg shadow-md bg-white border border-gray-200">
            <span className="font-medium text-gray-800">{timA?.nama ?? "TBD"} ({m.skor_tim_a ?? 0})</span>
            <span className="text-gray-500 font-semibold">vs</span>
            <span className="font-medium text-gray-800">{timB?.nama ?? "TBD"} ({m.skor_tim_b ?? 0})</span>
          </div>
        );
      })}
    </div>
  );
}
