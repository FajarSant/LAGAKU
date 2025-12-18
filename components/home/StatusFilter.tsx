"use client";

import { Flame, CalendarCheck, Trophy, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface StatusFilterProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

const statusOptions = [
  {
    value: "berlangsung",
    label: "Berlangsung",
    icon: Flame,
    color: "from-red-500 to-orange-500",
    bgColor: "bg-gradient-to-r from-red-500/20 to-orange-500/20",
    borderColor: "border-red-500/30",
  },
  {
    value: "dijadwalkan",
    label: "Dijadwalkan",
    icon: Clock,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
  },
  {
    value: "selesai",
    label: "Selesai",
    icon: Trophy,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
  },
  {
    value: "semua",
    label: "Semua",
    icon: CalendarCheck,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
  },
];

export default function StatusFilter({ selectedStatus, setSelectedStatus }: StatusFilterProps) {
  const [counts, setCounts] = useState({
    berlangsung: 0,
    dijadwalkan: 0,
    selesai: 0,
    semua: 0
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const supabase = createClient();
      
      // Fetch counts untuk setiap status
      const [berlangsung, dijadwalkan, selesai, semua] = await Promise.all([
        supabase.from('pertandingan').select('id', { count: 'exact' }).eq('status', 'berlangsung'),
        supabase.from('pertandingan').select('id', { count: 'exact' }).eq('status', 'dijadwalkan'),
        supabase.from('pertandingan').select('id', { count: 'exact' }).eq('status', 'selesai'),
        supabase.from('pertandingan').select('id', { count: 'exact' })
      ]);

      setCounts({
        berlangsung: berlangsung.count || 0,
        dijadwalkan: dijadwalkan.count || 0,
        selesai: selesai.count || 0,
        semua: semua.count || 0
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700">
      {statusOptions.map((option) => {
        const Icon = option.icon;
        const isActive = selectedStatus === option.value;
        
        return (
          <button
            key={option.value}
            onClick={() => setSelectedStatus(option.value)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 ${
              isActive
                ? `${option.bgColor} border ${option.borderColor} shadow-lg`
                : "bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700"
            }`}
          >
            <div className={`p-2 rounded-lg ${isActive ? 'bg-white/10' : 'bg-gray-700'}`}>
              <Icon className={`w-5 h-5 ${
                isActive 
                  ? `text-${option.color.split('-')[1]}-400` 
                  : 'text-gray-400'
              }`} />
            </div>
            <span className={`font-medium ${
              isActive 
                ? `bg-gradient-to-r ${option.color} bg-clip-text text-transparent` 
                : 'text-gray-300'
            }`}>
              {option.label}
            </span>
            {counts[option.value as keyof typeof counts] > 0 && (
              <div className="ml-2 px-2 py-1 text-xs rounded-full bg-white/10">
                <span className="text-white font-medium">
                  {counts[option.value as keyof typeof counts]}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}