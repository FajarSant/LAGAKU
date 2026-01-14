"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical, Settings, ExternalLink } from "lucide-react";
import Link from "next/link";
import { TeamWithDetails } from "@/utils";

interface TeamCardProps {
  team: TeamWithDetails;
  onRefresh: () => void;
}

export default function TeamCard({ team, onRefresh }: TeamCardProps) {
  const supabase = createClient();
  const [isManaging, setIsManaging] = useState(false);

  const handleRemoveTeam = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus tim ini? Aksi ini tidak dapat dibatalkan.")) return;
    
    try {
      const { error: teamError } = await supabase
        .from("tim")
        .delete()
        .eq("id", team.id);

      if (teamError) throw teamError;
      
      alert("Tim berhasil dihapus!");
      onRefresh();
    } catch (error) {
      console.error("Error removing team:", error);
      alert("Gagal menghapus tim. Pastikan tidak ada pertandingan yang terkait.");
    }
  };

  const anggotaTimCount = team._count?.anggota_tim || 0;

  return (
    <Card className="hover:shadow-lg transition-all relative border border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{team.nama}</CardTitle>
              <Badge variant={team.status === "aktif" ? "default" : "destructive"}>
                {team.status === "aktif" ? "Aktif" : "Gugur"}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              {team.acara?.nama || "Turnamen"}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsManaging(!isManaging)}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="space-y-4">
          {/* Team Members */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Anggota Tim ({anggotaTimCount})
              </p>
            </div>
            <div className="space-y-2">
              {team.anggota_tim?.slice(0, 3).map(member => (
                <div key={member.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
                      {member.nama_pemain.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{member.nama_pemain}</p>
                    <p className="text-xs text-gray-500">{member.nim || "-"}</p>
                  </div>
                </div>
              ))}
              {anggotaTimCount > 3 && (
                <p className="text-sm text-gray-500 text-center">
                  +{anggotaTimCount - 3} anggota lainnya
                </p>
              )}
            </div>
          </div>

          {/* Team Info */}
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {team.jurusan && (
                <div>
                  <span className="text-gray-500">Jurusan:</span>
                  <p className="font-medium">{team.jurusan}</p>
                </div>
              )}
              {team.angkatan && (
                <div>
                  <span className="text-gray-500">Angkatan:</span>
                  <p className="font-medium">{team.angkatan}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {team.nomor_hp && (
                <div>
                  <span className="text-gray-500">Kontak:</span>
                  <p className="font-medium">{team.nomor_hp}</p>
                </div>
              )}
              <div>
                <span className="text-gray-500">Pertandingan:</span>
                <p className="font-medium">{team._count?.pertandingan || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
        {team.acara?.id && (
          <Link href={`/tournaments/${team.acara.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Lihat Turnamen
            </Button>
          </Link>
        )}
        <Button size="sm" className="flex-1">
          <Settings className="w-4 h-4 mr-2" />
          Kelola
        </Button>
      </CardFooter>

      {/* Management Dropdown */}
      {isManaging && (
        <div className="absolute right-4 top-12 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-2 z-10 min-w-[120px]">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
            onClick={handleRemoveTeam}
          >
            Hapus Tim
          </Button>
        </div>
      )}
    </Card>
  );
}