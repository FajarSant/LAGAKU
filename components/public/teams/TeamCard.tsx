"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Trophy,
  Calendar,
  MapPin,
  Phone,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Sword,
  Crown,
} from "lucide-react";
import { TeamWithDetails } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface TeamCardProps {
  team: TeamWithDetails;
  onRefresh: () => void;
  onDeleteTeam: (teamId: string) => void;
}

export default function TeamCard({
  team,
  onRefresh,
  onDeleteTeam,
}: TeamCardProps) {
  // Anggota tim dengan penanganan undefined
  const anggotaTim = team.anggota_tim || [];
  const anggotaCount = team._count?.anggota_tim || anggotaTim.length;
  const pertandinganCount = team._count?.pertandingan || 0;

  // Anggota pertama dianggap sebagai ketua jika tidak ada properti is_ketua
  const ketuaTim = anggotaTim.length > 0 ? anggotaTim[0] : null;

  const handleDelete = () => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus tim "${team.nama}"? Tindakan ini tidak dapat dibatalkan.`,
      )
    ) {
      onDeleteTeam(team.id);
    }
  };

  // Format tanggal dengan penanganan error
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Tanggal tidak tersedia";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "Tanggal tidak valid";
    }
  };

  // Format nama untuk ditampilkan
  const formatName = (name?: string) => {
    if (!name) return "Nama tidak tersedia";
    return name.length > 30 ? name.substring(0, 30) + "..." : name;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800 overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <CardTitle className="flex items-center gap-2 text-lg truncate">
              {formatName(team.nama)}
              <Badge
                variant={team.status === "aktif" ? "default" : "secondary"}
                className={
                  team.status === "aktif"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                }
              >
                {team.status === "aktif" ? "Aktif" : "Nonaktif"}
              </Badge>
            </CardTitle>
            {team.acara?.nama && (
              <CardDescription className="flex items-center gap-1 mt-1">
                <Trophy className="w-3 h-3" />
                {team.acara.nama.length > 40
                  ? team.acara.nama.substring(0, 40) + "..."
                  : team.acara.nama}
              </CardDescription>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Eye className="w-4 h-4" />
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Edit className="w-4 h-4" />
                Edit Tim
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-red-600 dark:text-red-400 cursor-pointer"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
                Hapus Tim
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-blue-500" />
              <span>{anggotaCount} Anggota</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sword className="w-4 h-4 text-red-500" />
              <span>{pertandinganCount} Pertandingan</span>
            </div>
          </div>

          {/* Team Info */}
          {(team.jurusan || team.angkatan) && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {team.jurusan && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  {team.jurusan}
                  {team.angkatan && ` • Angkatan ${team.angkatan}`}
                </div>
              )}
            </div>
          )}

          {/* Captain */}
          {ketuaTim && (
            <div className="text-sm">
              <div className="flex items-center gap-2 font-medium">
                <Crown className="w-3 h-3 text-yellow-500" />
                Ketua Tim:
              </div>
              <div className="ml-5 text-gray-600 dark:text-gray-400">
                {ketuaTim.nama_pemain || "Nama tidak tersedia"}
                {ketuaTim.nim && ` • ${ketuaTim.nim}`}
              </div>
            </div>
          )}

          {/* Contact */}
          {team.nomor_hp && (
            <div className="text-sm flex items-center gap-2">
              <Phone className="w-3 h-3" />
              {team.nomor_hp}
            </div>
          )}

          {/* Created Date */}
          <div className="text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
            Dibuat: {formatDate(team.dibuat_pada)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/my-teams/${team.id}`}>
              <Eye className="w-4 h-4 mr-2" />
              Detail
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
