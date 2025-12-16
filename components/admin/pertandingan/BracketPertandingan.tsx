"use client";

import React from "react";
import { Bracket } from "react-brackets";
import type { IRoundProps } from "react-brackets";
import { Pertandingan, Tim } from "@/types/pertandingan";

interface Props {
  pertandinganList: Pertandingan[];
  timList: Tim[];
}

/** Ambil nama tim */
const getTimNama = (timList: Tim[], id?: string | null): string => {
  if (!id) return "TBD";
  return timList.find((t) => t.id === id)?.nama ?? "TBD";
};

/** Format Tanggal */
const formatTanggal = (tanggal: string | null): string => {
  if (!tanggal) return "";
  try {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return tanggal;
  }
};

/** Get Winner */
const getWinnerId = (match: Pertandingan): string | null => {
  if (match.status !== "selesai") return null;
  if (match.skor_tim_a == null || match.skor_tim_b == null) return null;

  if (match.skor_tim_a > match.skor_tim_b) return match.tim_a_id;
  if (match.skor_tim_b > match.skor_tim_a) return match.tim_b_id;

  return null;
};

/**
 * BRACKET OTOMATIS
 * Menampilkan skor, nama tim, dan auto round transition
 */
function generateBracketAutoNextRound(
  pertandinganList: Pertandingan[],
  timList: Tim[]
): IRoundProps[] {
  if (timList.length === 0) return [];

  const totalTeams = timList.length;
  const totalRounds = Math.ceil(Math.log2(totalTeams));

  // Urutkan pertandingan
  const sorted = [...pertandinganList].sort(
    (a, b) =>
      new Date(a.dibuat_pada).getTime() -
      new Date(b.dibuat_pada).getTime()
  );

  const rounds: IRoundProps[] = [];
  let matchIndex = 0;
  let matchesThisRound = Math.ceil(totalTeams / 2);

  let lastRoundWinners: (string | null)[] = [];

  for (let roundNumber = 1; roundNumber <= totalRounds; roundNumber++) {
    const seeds = [];
    const thisRoundWinners: (string | null)[] = [];

    for (let i = 0; i < matchesThisRound; i++) {
      const match = sorted[matchIndex];

      let timA = "TBD";
      let timB = "TBD";
      let tanggal = "";
      let skorA: number | null = null;
      let skorB: number | null = null;

      if (roundNumber === 1) {
        if (match) {
          timA = getTimNama(timList, match.tim_a_id);
          timB = getTimNama(timList, match.tim_b_id);

          skorA = match.skor_tim_a;
          skorB = match.skor_tim_b;

          tanggal = formatTanggal(match.tanggal_pertandingan);

          const winner = getWinnerId(match);
          thisRoundWinners.push(winner);
        } else {
          thisRoundWinners.push(null);
        }
      } else {
        // Round lanjutan: ambil pemenang sebelumnya
        const prevA = lastRoundWinners[i * 2];
        const prevB = lastRoundWinners[i * 2 + 1];

        timA = getTimNama(timList, prevA);
        timB = getTimNama(timList, prevB);

        skorA = null;
        skorB = null;

        thisRoundWinners.push(null);
      }

      seeds.push({
        id: `r${roundNumber}-m${i}`,
        title: tanggal,
        teams: [
          { name: skorA != null ? `${timA} (${skorA})` : timA },
          { name: skorB != null ? `${timB} (${skorB})` : timB },
        ],
      });

      matchIndex++;
    }

    rounds.push({
      title: `Round ${roundNumber}`,
      seeds,
    });

    lastRoundWinners = thisRoundWinners;
    matchesThisRound = Math.ceil(matchesThisRound / 2);
  }

  return rounds;
}

export default function BracketPertandingan({
  pertandinganList,
  timList,
}: Props) {
  const rounds = generateBracketAutoNextRound(pertandinganList, timList);

  return (
    <div className="mt-6 p-4 bg-white border rounded shadow">
      <Bracket rounds={rounds} mobileBreakpoint={992} rtl={false} />
    </div>
  );
}
