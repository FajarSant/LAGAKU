"use client";

import { Users, Crown, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMember {
  id?: string;
  tim_id: string;
  nama_pemain: string;
  nim?: string;
  dibuat_pada?: string;
}

interface TeamData {
  id: string;
  nama: string;
  status: string;
  acara_id?: string;
  jurusan?: string;
  angkatan?: string;
  nomor_hp?: string;
  jumlah_pemain: number;
  dibuat_pada: string;
  anggota_tim?: TeamMember[];
  acara?: {
    id: string;
    nama: string;
    deskripsi?: string;
  };
  _count?: {
    anggota_tim: number;
    pertandingan: number;
  };
}

interface TeamMembersCardProps {
  team: TeamData;
  userRole: 'ketua' | 'anggota' | 'non-anggota';
}

export function TeamMembersCard({ team, userRole }: TeamMembersCardProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Anggota Tim
          </CardTitle>
          <CardDescription>
            {team._count?.anggota_tim || 0} anggota terdaftar
          </CardDescription>
        </div>
        {userRole === 'ketua' && (
          <Badge variant="outline" className="gap-1">
            <Shield className="w-3 h-3" />
            Anda Ketua
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {team.anggota_tim?.map((member, index) => (
            <div 
              key={member.id || index}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <Avatar className="border-2 border-gray-300 dark:border-gray-700">
                  <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-500 text-white">
                    {member.nama_pemain?.charAt(0)?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {member.nama_pemain}
                      {index === 0 && (
                        <Crown className="w-4 h-4 text-yellow-500 inline ml-2" />
                      )}
                    </p>
                    {index === 0 && (
                      <Badge className="bg-linear-to-r from-yellow-500 to-amber-500 text-white border-0">
                        Ketua
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {member.nim && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        NIM: {member.nim}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {member.dibuat_pada && new Date(member.dibuat_pada).toLocaleDateString('id-ID')}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}