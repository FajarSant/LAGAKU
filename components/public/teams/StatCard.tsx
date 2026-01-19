"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  sublabel?: string;
  color: string;
  bgColor: string;
  borderColor?: string;
  trend?: 'positive' | 'negative' | 'neutral';
}

export default function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  sublabel, 
  color, 
  bgColor, 
  borderColor = 'border-gray-200 dark:border-gray-800',
  trend = 'neutral'
}: StatCardProps) {
  const trendColors = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-gray-500'
  };

  return (
    <Card className={`border ${borderColor} shadow-sm hover:shadow-md transition-shadow`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg ${bgColor}`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          {trend !== 'neutral' && (
            <span className={`text-xs font-medium ${trendColors[trend]}`}>
              {trend === 'positive' ? '↑' : '↓'}
            </span>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {value.toLocaleString('id-ID')}
          </div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </div>
          {sublabel && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {sublabel}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}