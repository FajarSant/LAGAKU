// components/BracketStats.tsx
import { Card, CardContent } from "@/components/ui/card";
import { calculateCompletionPercentage, StatsData } from "@/utils";
import { Trophy, Users, Award, Loader2 } from "lucide-react";

interface BracketStatsProps {
  stats: StatsData;
}

export function BracketStats({ stats }: BracketStatsProps) {
  const { rounds, totalMatches, completedMatches, totalTeams } = stats;
  const completionPercentage = calculateCompletionPercentage(completedMatches, totalMatches);

  const statItems = [
    {
      label: "Total Babak",
      value: rounds,
      icon: <Trophy className="h-4 w-4" />,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10 dark:bg-blue-900/30"
    },
    {
      label: "Total Tim",
      value: totalTeams,
      icon: <Users className="h-4 w-4" />,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10 dark:bg-purple-900/30"
    },
    {
      label: "Total Match",
      value: totalMatches,
      icon: <Award className="h-4 w-4" />,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-500/10 dark:bg-green-900/30"
    },
    {
      label: "Progress",
      value: `${completionPercentage}%`,
      icon: completionPercentage === 100 
        ? <Trophy className="h-4 w-4" /> 
        : <Loader2 className="h-4 w-4" />,
      color: completionPercentage === 100 
        ? "text-amber-600 dark:text-amber-400" 
        : "text-orange-600 dark:text-orange-400",
      bg: completionPercentage === 100 
        ? "bg-amber-500/10 dark:bg-amber-900/30" 
        : "bg-orange-500/10 dark:bg-orange-900/30"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <Card key={index} className="border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {item.label}
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                  {item.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress Turnamen</span>
          <span className="font-medium">{completionPercentage}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              completionPercentage === 100
                ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                : "bg-gradient-to-r from-blue-500 to-sky-500"
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}