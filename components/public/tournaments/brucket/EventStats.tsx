"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Swords, CheckCircle, TrendingUp } from "lucide-react";

interface EventStatsProps {
  stats: {
    totalEvents: number;
    ongoingEvents: number;
    upcomingEvents: number;
    totalTeams: number;
    totalMatches: number;
    completedMatches: number;
  };
}

export default function EventStats({ stats }: EventStatsProps) {
  const statCards = [
    {
      icon: Trophy,
      label: "Total Turnamen",
      value: stats.totalEvents,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      icon: TrendingUp,
      label: "Sedang Berlangsung",
      value: stats.ongoingEvents,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: Users,
      label: "Total Tim",
      value: stats.totalTeams,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: Swords,
      label: "Total Pertandingan",
      value: stats.totalMatches,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {stat.label}
                </p>
                <h3 className={`text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}