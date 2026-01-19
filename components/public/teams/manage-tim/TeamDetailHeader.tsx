"use client";

import { ArrowLeft, Share2, Settings, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {  TeamWithDetails } from "@/utils";

interface TeamDetailHeaderProps {
  team: TeamWithDetails;
  userRole: 'ketua' | 'anggota' | 'non-anggota';
  onBack: () => void;
  onShare: () => void;
  onManage: () => void;
}

export function TeamDetailHeader({ 
  team, 
  userRole, 
  onBack, 
  onShare, 
  onManage 
}: TeamDetailHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {team.nama}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge 
                variant={team.status === 'aktif' ? 'default' : 'secondary'}
                className={`${team.status === 'aktif' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {team.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
              </Badge>
              {team.acara && (
                <Badge variant="outline" className="gap-1">
                  <Trophy className="w-3 h-3" />
                  {team.acara.nama}
                </Badge>
              )}
              <Badge variant="secondary" className="gap-1">
                <Users className="w-3 h-3" />
                {team._count?.anggota_tim || 0} Anggota
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onShare}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            Bagikan
          </Button>
          {userRole === 'ketua' && (
            <Button
              onClick={onManage}
              className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Settings className="w-4 h-4" />
              Kelola
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}