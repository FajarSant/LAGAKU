"use client";

import { Trophy, MapPin, Phone, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { TeamData } from "@/utils";

interface TeamInfoCardProps {
  team: TeamData;
}

export function TeamInfoCard({ team }: TeamInfoCardProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Informasi Tim
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-sm text-gray-500 dark:text-gray-400">Nama Tim</Label>
              <p className="font-medium">{team.nama}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-gray-500 dark:text-gray-400">Status</Label>
              <p className="font-medium capitalize">{team.status}</p>
            </div>
            {team.jurusan && (
              <div className="space-y-1">
                <Label className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Jurusan
                </Label>
                <p className="font-medium">{team.jurusan}</p>
              </div>
            )}
            {team.angkatan && (
              <div className="space-y-1">
                <Label className="text-sm text-gray-500 dark:text-gray-400">Angkatan</Label>
                <p className="font-medium">{team.angkatan}</p>
              </div>
            )}
            {team.nomor_hp && (
              <div className="space-y-1">
                <Label className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Kontak
                </Label>
                <p className="font-medium">{team.nomor_hp}</p>
              </div>
            )}
            <div className="space-y-1">
              <Label className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Dibuat
              </Label>
              <p className="font-medium">
                {new Date(team.dibuat_pada).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {team.acara && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  Turnamen
                </Label>
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <p className="font-medium">{team.acara.nama}</p>
                  {team.acara.deskripsi && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {team.acara.deskripsi}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}