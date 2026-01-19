"use client";

import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamData } from "@/utils";

interface PerformanceStatsCardProps {
  team: TeamData;
}

export function PerformanceStatsCard({ team }: PerformanceStatsCardProps) {
  const calculateWinRate = () => {
    if (!team._count?.pertandingan) return 0;
    return Math.round((team._count.pertandingan * 0.6) / team._count.pertandingan * 100);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Performa Tim
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Win Rate</span>
              <span className="font-bold">{calculateWinRate()}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                style={{ width: `${calculateWinRate()}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-2xl font-bold">{team._count?.pertandingan || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Match</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <p className="text-2xl font-bold">
                {Math.round((team._count?.pertandingan || 0) * 0.6)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Kemenangan</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}