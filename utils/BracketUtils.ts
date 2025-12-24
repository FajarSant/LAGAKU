// utils/bracketUtils.ts
import { Pertandingan, MatchStatusConfig } from "@/types/type";

export const getMatchStatusConfig = (status: string): MatchStatusConfig => {
  const configs: Record<string, MatchStatusConfig> = {
    "selesai": {
      bg: "bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-900/30 dark:to-emerald-900/30",
      text: "text-green-700 dark:text-green-400",
      border: "border-green-200 dark:border-green-800"
    },
    "berlangsung": {
      bg: "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 dark:from-yellow-900/30 dark:to-amber-900/30",
      text: "text-yellow-700 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-yellow-800"
    },
    "dijadwalkan": {
      bg: "bg-gradient-to-r from-blue-500/10 to-sky-500/10 dark:from-blue-900/30 dark:to-sky-900/30",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800"
    }
  };

  return configs[status] || {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-700"
  };
};

export const getRoundDisplayName = (nama: string, urutan: number, matchCount: number): string => {
  if (matchCount === 1) return "Final";
  if (matchCount === 2) return "Semifinal";
  if (matchCount === 4) return "Quarterfinal";
  if (nama.toLowerCase().includes("final")) return nama;
  return `Round ${urutan}`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatMatchDate = (dateString: string | null): string => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short"
  });
};

export const calculateCompletionPercentage = (completed: number, total: number): number => {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

export const isFinalRound = (matches: Pertandingan[]): boolean => {
  return matches.length === 1 && matches.every((m) => !m.is_bye);
};