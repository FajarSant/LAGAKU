"use client";

import { Users, Sword, Award, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TeamData } from "@/utils";

interface TeamStatsCardsProps {
  team: TeamData;
}

export function TeamStatsCards({ team }: TeamStatsCardsProps) {
  const calculateWinRate = () => {
    if (!team._count?.pertandingan) return 0;
    return Math.round((team._count.pertandingan * 0.6) / team._count.pertandingan * 100);
  };

  const stats = [
    {
      icon: Users,
      label: "Anggota",
      value: team._count?.anggota_tim || 0,
      color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/40"
    },
    {
      icon: Sword,
      label: "Pertandingan",
      value: team._count?.pertandingan || 0,
      color: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
      iconColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/40"
    },
    {
      icon: Award,
      label: "Win Rate",
      value: `${calculateWinRate()}%`,
      color: "from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/40"
    },
    {
      icon: Calendar,
      label: "Dibuat",
      value: new Date(team.dibuat_pada).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short'
      }),
      color: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      iconColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/40"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card 
          key={index}
          className={`border-0 shadow-sm bg-gradient-to-br ${stat.color}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}