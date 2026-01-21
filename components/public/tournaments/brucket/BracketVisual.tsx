"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ChevronRight, Trophy, Users, Loader2 } from 'lucide-react';

interface Team {
  id: string;
  nama: string;
  jurusan: string | null;
}

interface Match {
  id: string;
  tim_a_id: string;
  tim_b_id: string | null;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  pemenang_id: string | null;
  status: 'dijadwalkan' | 'berlangsung' | 'selesai';
  round_id: string;
}

interface BracketVisualProps {
  eventId: string;
}

export default function BracketVisual({ eventId }: BracketVisualProps) {
  const supabase = createClient();
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [teamsData, matchesData] = await Promise.all([
        supabase
          .from('tim')
          .select('*')
          .eq('acara_id', eventId)
          .order('nama'),
        supabase
          .from('pertandingan')
          .select('*')
          .eq('acara_id', eventId)
          .order('round_id', { ascending: true })
      ]);

      if (teamsData.data) setTeams(teamsData.data);
      if (matchesData.data) setMatches(matchesData.data as Match[]);
    } catch (error) {
      console.error('Error fetching bracket data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateBracketStructure = () => {
    const teamCount = teams.length;
    let bracketSize = 8; // Default to 8

    if (teamCount <= 8) bracketSize = 8;
    else if (teamCount <= 16) bracketSize = 16;
    else if (teamCount <= 32) bracketSize = 32;

    // Calculate number of rounds
    const rounds = Math.log2(bracketSize);
    const bracketStructure = [];

    // Generate matches for each round
    for (let round = 0; round < rounds; round++) {
      const matchesInRound = Math.pow(2, rounds - round - 1);
      const roundMatches = [];

      for (let match = 0; match < matchesInRound; match++) {
        const matchId = `round-${round}-match-${match}`;
        // Find existing match for this position
        const existingMatch = matches.find(m => 
          m.round_id === `round-${round + 1}` || // Adjust based on your round naming
          matches.indexOf(m) === match
        );

        roundMatches.push({
          id: existingMatch?.id || matchId,
          position: match,
          totalMatches: matchesInRound,
          round: round + 1,
          roundName: getRoundName(round + 1, bracketSize),
          matchData: existingMatch || null
        });
      }

      bracketStructure.push({
        round: round + 1,
        roundName: getRoundName(round + 1, bracketSize),
        matches: roundMatches
      });
    }

    return bracketStructure;
  };

  const getRoundName = (round: number, bracketSize: number) => {
    if (bracketSize === 32) {
      switch (round) {
        case 1: return '32 Besar';
        case 2: return '16 Besar';
        case 3: return 'Perempat Final';
        case 4: return 'Semifinal';
        case 5: return 'Final';
        default: return `Round ${round}`;
      }
    } else if (bracketSize === 16) {
      switch (round) {
        case 1: return '16 Besar';
        case 2: return 'Perempat Final';
        case 3: return 'Semifinal';
        case 4: return 'Final';
        default: return `Round ${round}`;
      }
    } else {
      switch (round) {
        case 1: return 'Perempat Final';
        case 2: return 'Semifinal';
        case 3: return 'Final';
        default: return `Round ${round}`;
      }
    }
  };

  const getTeamName = (teamId: string | null) => {
    if (!teamId) return 'TBD';
    const team = teams.find(t => t.id === teamId);
    return team ? team.nama : 'Unknown';
  };

  const renderMatchNode = (match: any, roundIndex: number) => {
    const matchData = match.matchData;
    const isFinal = roundIndex === 0;
    const isSemiFinal = roundIndex === 1;
    const isQuarterFinal = roundIndex === 2;

    // Jika tidak ada match data, render placeholder
    if (!matchData) {
      return (
        <div key={match.id} className="relative">
          {/* Match Box */}
          <div className={`
            bg-white dark:bg-gray-800 rounded-lg border shadow-sm
            border-gray-200 dark:border-gray-700
            ${isFinal ? 'w-64' : 'w-56'}
            hover:shadow-md transition-all duration-200
          `}>
            {/* Match Header */}
            <div className={`
              px-4 py-3 rounded-t-lg
              bg-gray-50 dark:bg-gray-800
              ${isFinal ? 'border-b-2 border-yellow-500' : ''}
            `}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isFinal && <Trophy className="w-4 h-4 text-yellow-500" />}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {match.roundName}
                  </span>
                </div>
                <span className={`
                  text-xs px-2 py-1 rounded-full font-medium
                  bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200
                `}>
                  TBD
                </span>
              </div>
            </div>

            {/* Teams */}
            <div className="p-3 space-y-2">
              {/* Team A */}
              <div className="flex justify-between items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-5 bg-blue-500 rounded"></div>
                  <div className="font-medium truncate max-w-[120px]">
                    TBD
                  </div>
                </div>
                <div className="font-bold text-lg">-</div>
              </div>

              {/* Team B */}
              <div className="flex justify-between items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-5 bg-purple-500 rounded"></div>
                  <div className="font-medium truncate max-w-[120px]">
                    TBD
                  </div>
                </div>
                <div className="font-bold text-lg">-</div>
              </div>
            </div>
          </div>

          {/* Connector lines */}
          {roundIndex > 0 && (
            <>
              {/* Horizontal line to next round */}
              <div className="absolute top-1/2 -right-4 w-4 h-px bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Vertical connector for positioning */}
              {match.position % 2 === 0 && (
                <div className="absolute top-1/2 -right-12 w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
              )}
              
              {/* Vertical line connecting two matches */}
              {match.position % 2 === 0 && (
                <div className="absolute top-1/2 -right-20 w-px h-32 bg-gray-300 dark:bg-gray-600"></div>
              )}
            </>
          )}
        </div>
      );
    }

    return (
      <div key={match.id} className="relative">
        {/* Match Box */}
        <div className={`
          bg-white dark:bg-gray-800 rounded-lg border shadow-sm
          ${matchData.status === 'selesai' ? 'border-emerald-200 dark:border-emerald-800' :
            matchData.status === 'berlangsung' ? 'border-amber-200 dark:border-amber-800' :
            'border-gray-200 dark:border-gray-700'}
          ${isFinal ? 'w-64' : 'w-56'}
          hover:shadow-md transition-all duration-200
        `}>
          {/* Match Header */}
          <div className={`
            px-4 py-3 rounded-t-lg
            ${matchData.status === 'selesai' ? 'bg-emerald-50 dark:bg-emerald-900/20' :
              matchData.status === 'berlangsung' ? 'bg-amber-50 dark:bg-amber-900/20' :
              'bg-gray-50 dark:bg-gray-800'}
            ${isFinal ? 'border-b-2 border-yellow-500' : ''}
          `}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isFinal && <Trophy className="w-4 h-4 text-yellow-500" />}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {match.roundName}
                </span>
              </div>
              {matchData.status && (
                <span className={`
                  text-xs px-2 py-1 rounded-full font-medium
                  ${matchData.status === 'selesai' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' :
                    matchData.status === 'berlangsung' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}
                `}>
                  {matchData.status === 'selesai' ? '✓' : 
                   matchData.status === 'berlangsung' ? '⚡' : '⏱️'}
                </span>
              )}
            </div>
          </div>

          {/* Teams */}
          <div className="p-3 space-y-2">
            {/* Team A */}
            <div className={`
              flex justify-between items-center p-2 rounded
              ${matchData.pemenang_id === matchData.tim_a_id ? 
                'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' :
                'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
            `}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-5 bg-blue-500 rounded"></div>
                <div className="font-medium truncate max-w-[120px]">
                  {getTeamName(matchData.tim_a_id)}
                </div>
              </div>
              <div className="font-bold text-lg">
                {matchData.skor_tim_a !== null ? matchData.skor_tim_a : '-'}
              </div>
            </div>

            {/* Team B */}
            <div className={`
              flex justify-between items-center p-2 rounded
              ${matchData.pemenang_id === matchData.tim_b_id ? 
                'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' :
                'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
            `}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-5 bg-purple-500 rounded"></div>
                <div className="font-medium truncate max-w-[120px]">
                  {matchData.tim_b_id ? getTeamName(matchData.tim_b_id) : 'BYE'}
                </div>
              </div>
              <div className="font-bold text-lg">
                {matchData.tim_b_id && matchData.skor_tim_b !== null ? matchData.skor_tim_b : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Connector lines */}
        {roundIndex > 0 && (
          <>
            {/* Horizontal line to next round */}
            <div className="absolute top-1/2 -right-4 w-4 h-px bg-gray-300 dark:bg-gray-600"></div>
            
            {/* Vertical connector for positioning */}
            {match.position % 2 === 0 && (
              <div className="absolute top-1/2 -right-12 w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
            )}
            
            {/* Vertical line connecting two matches */}
            {match.position % 2 === 0 && (
              <div className="absolute top-1/2 -right-20 w-px h-32 bg-gray-300 dark:bg-gray-600"></div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderBracket = () => {
    const bracketStructure = generateBracketStructure();
    
    return (
      <div className="relative overflow-x-auto">
        <div className="flex gap-8 min-w-max p-8">
          {bracketStructure.map((round, roundIndex) => (
            <div
              key={round.round}
              className="flex flex-col gap-16"
              style={{
                marginTop: `${Math.pow(2, roundIndex) * 16}px`
              }}
            >
              {/* Round Header */}
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {round.roundName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {round.matches.length} Match
                </p>
              </div>

              {/* Matches in this round */}
              <div className="space-y-16">
                {round.matches.map((match, matchIndex) => (
                  <div key={match.id}>
                    {renderMatchNode(match, roundIndex)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Membuat bracket...</p>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Belum ada tim terdaftar
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Turnamen belum memiliki tim yang mendaftar
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Tournament info */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-gray-900 dark:text-white">
              Sistem Turnamen Gugur
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {teams.length} Tim terdaftar • {Math.pow(2, Math.ceil(Math.log2(teams.length)))} Besar
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Tim A</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Tim B</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bracket visualization */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        {renderBracket()}
      </div>

      {/* Instructions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="font-medium text-blue-800 dark:text-blue-300 mb-1">Tim Biru</div>
          <div className="text-sm text-blue-700 dark:text-blue-400">Posisi kiri (Tim A)</div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="font-medium text-purple-800 dark:text-purple-300 mb-1">Tim Ungu</div>
          <div className="text-sm text-purple-700 dark:text-purple-400">Posisi kanan (Tim B)</div>
        </div>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <div className="font-medium text-emerald-800 dark:text-emerald-300 mb-1">Pemenang</div>
          <div className="text-sm text-emerald-700 dark:text-emerald-400">Tim yang menang match</div>
        </div>
      </div>
    </div>
  );
}