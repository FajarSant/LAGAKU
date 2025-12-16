interface BracketStatsProps {
  rounds: number;
  matches: number;
}

export default function BracketStats({ rounds, matches }: BracketStatsProps) {
  // Hitung persentase selesai (asumsi)
  const completionPercentage = Math.min(100, Math.round((matches * 0.7) / rounds * 100));

  return (
    <div className="border-t pt-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{rounds}</div>
          <div className="text-sm text-gray-600">Total Babak</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{matches}</div>
          <div className="text-sm text-gray-600">Total Pertandingan</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
          <div className="text-sm text-blue-600">Progress Turnamen</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{rounds > 0 ? "Final" : "-"}</div>
          <div className="text-sm text-amber-600">Babak Akhir</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress Turnamen</span>
          <span className="font-medium">{completionPercentage}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}