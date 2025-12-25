"use client";

import React from "react";

export default function BracketTablePage() {
  const teams = [
    "Tim 1",
    "Tim 2",
    "Tim 3",
    "Tim 4",
    "Tim 5",
    "Tim 6",
    "Tim 7",
    "Tim 8",
    "Tim 9",
    "Tim 10",
    "Tim 11",
  ];

  const round1 = generateRound(teams);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Bracket Pertandingan</h1>

      {/* ROUND 1 */}
      <BracketSection title="Round 1 (Penyisihan)" matches={round1} />

      {/* ROUND 2 */}
      <BracketSection
        title="Round 2 (Perempat Final)"
        matches={generateNextRound(round1)}
      />

      {/* SEMIFINAL */}
      <BracketSection
        title="Semifinal"
        matches={generateNextRound(generateNextRound(round1))}
      />

      {/* FINAL */}
      <BracketSection
        title="Final"
        matches={generateNextRound(generateNextRound(generateNextRound(round1)))}
      />
    </div>
  );
}

function BracketSection({ title, matches }: { title: string; matches: any[] }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <table className="w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 w-1/3">Tim A</th>
            <th className="border p-2 w-1/6">VS</th>
            <th className="border p-2 w-1/3">Tim B</th>
          </tr>
        </thead>

        <tbody>
          {matches.map((m, i) => (
            <tr key={i}>
              <td className="border p-2">{m.teamA}</td>
              <td className="border p-2 text-center">VS</td>
              <td className="border p-2">{m.teamB}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============================ LOGIC: MATCH GENERATION ============================ */

// Round 1 generator (menangani tim ganjil → bye otomatis)
function generateRound(teams: string[]) {
  const matches = [];

  // Jika tim ganjil → kasih bye ke 1 tim terakhir
  if (teams.length % 2 === 1) {
    const byeTeam = teams.pop();
    matches.push({ teamA: byeTeam, teamB: "Bye" });
  }

  for (let i = 0; i < teams.length; i += 2) {
    matches.push({
      teamA: teams[i],
      teamB: teams[i + 1],
    });
  }

  return matches;
}

// Next rounds (winner placeholder)
function generateNextRound(previous: any[]) {
  const nextMatches = [];
  let matchNum = 1;

  for (let i = 0; i < previous.length; i += 2) {
    const a = previous[i];
    const b = previous[i + 1];

    // Jika pasangan ganjil
    if (!b) {
      nextMatches.push({
        teamA: `Winner ${matchNum}`,
        teamB: "Bye",
      });
    } else {
      nextMatches.push({
        teamA: `Winner ${matchNum}`,
        teamB: `Winner ${matchNum + 1}`,
      });
    }

    matchNum += 2;
  }

  return nextMatches;
}
