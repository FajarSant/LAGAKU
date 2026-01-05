"use client";

import { Flame, CalendarCheck, Trophy, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface StatusFilterProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

const statusOptions = [
  {
    value: "berlangsung",
    label: "Berlangsung",
    icon: Flame,
    color: "text-red-500",
    activeColor: "from-red-500 to-orange-500",
    lightBg: "bg-red-50 dark:bg-red-500/10",
    darkBg: "bg-gradient-to-br from-red-500/20 to-orange-500/20 dark:from-red-900/30 dark:to-orange-900/30",
    badgeColor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    value: "dijadwalkan",
    label: "Dijadwalkan",
    icon: Clock,
    color: "text-blue-500",
    activeColor: "from-blue-500 to-cyan-500",
    lightBg: "bg-blue-50 dark:bg-blue-500/10",
    darkBg: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-900/30 dark:to-cyan-900/30",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    value: "selesai",
    label: "Selesai",
    icon: Trophy,
    color: "text-green-500",
    activeColor: "from-green-500 to-emerald-500",
    lightBg: "bg-green-50 dark:bg-green-500/10",
    darkBg: "bg-gradient-to-br from-green-500/20 to-emerald-500/20 dark:from-green-900/30 dark:to-emerald-900/30",
    badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    value: "semua",
    label: "Semua",
    icon: CalendarCheck,
    color: "text-purple-500",
    activeColor: "from-purple-500 to-pink-500",
    lightBg: "bg-purple-50 dark:bg-purple-500/10",
    darkBg: "bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-900/30 dark:to-pink-900/30",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
];

export default function StatusFilter({
  selectedStatus,
  setSelectedStatus,
}: StatusFilterProps) {
  const [counts, setCounts] = useState({
    berlangsung: 0,
    dijadwalkan: 0,
    selesai: 0,
    semua: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const supabase = createClient();

      const [berlangsung, dijadwalkan, selesai, semua] = await Promise.all([
        supabase
          .from("pertandingan")
          .select("id", { count: "exact" })
          .eq("status", "berlangsung"),
        supabase
          .from("pertandingan")
          .select("id", { count: "exact" })
          .eq("status", "dijadwalkan"),
        supabase
          .from("pertandingan")
          .select("id", { count: "exact" })
          .eq("status", "selesai"),
        supabase.from("pertandingan").select("id", { count: "exact" }),
      ]);

      setCounts({
        berlangsung: berlangsung.count || 0,
        dijadwalkan: dijadwalkan.count || 0,
        selesai: selesai.count || 0,
        semua: semua.count || 0,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="w-full">
        {/* Grid dengan ukuran konsisten */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
          {statusOptions.map((option) => {
            const Icon = option.icon;
            const isActive = selectedStatus === option.value;
            const count = counts[option.value as keyof typeof counts];

            return (
              <Tooltip key={option.value}>
                <TooltipTrigger asChild>
                  <Card
                    className={`
                      relative cursor-pointer transition-all duration-300 
                      hover:scale-[1.02] hover:shadow-lg
                      border-2 h-28 md:h-32 flex flex-col justify-center
                      ${isActive ? option.darkBg : "bg-white dark:bg-gray-800"}
                      ${isActive ? "border-gray-300 dark:border-gray-600" : "border-gray-100 dark:border-gray-700"}
                      hover:border-gray-300 dark:hover:border-gray-600
                    `}
                    onClick={() => setSelectedStatus(option.value)}
                  >
                    <div className="p-4 flex flex-col items-center justify-center h-full">
                      {/* Icon Container - Ukuran Konsisten */}
                      <div className={`
                        mb-3 p-3 rounded-xl flex items-center justify-center
                        ${isActive ? option.darkBg : option.lightBg}
                        w-12 h-12 md:w-14 md:h-14
                      `}>
                        <Icon className={`h-6 w-6 md:h-7 md:w-7 ${option.color}`} />
                      </div>
                      
                      {/* Label dan Count - Terpusat */}
                      <div className="text-center space-y-1 w-full">
                        <h3 className={`
                          font-semibold text-sm md:text-base
                          ${isActive 
                            ? `bg-linear-to-r ${option.activeColor} bg-clip-text text-transparent font-bold`
                            : "text-gray-800 dark:text-gray-200"
                          }
                        `}>
                          {option.label}
                        </h3>
                        
                        <div className="flex items-center justify-center">
                          {loading ? (
                            <Skeleton className="h-4 w-12" />
                          ) : (
                            <Badge 
                              variant="outline" 
                              className={`
                                text-xs px-2 py-0.5 min-w-8 h-5
                                ${option.badgeColor} border-0
                                ${isActive ? 'opacity-90' : 'opacity-100'}
                              `}
                            >
                              {count}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute inset-0 border-2 rounded-lg border-gray-400 dark:border-gray-500 pointer-events-none" />
                    )}
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Lihat {option.label.toLowerCase()} pertandingan</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

      
      </div>
    </TooltipProvider>
  );
}