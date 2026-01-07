"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { EnumStatusMatch } from "@/utils";
import { SupabasePertandingan } from "@/app/(public)/jadwal-pertandingan/page";
import { formatDate, formatTime, getStatusConfig } from "@/utils/schedule-utils";

interface MatchDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: SupabasePertandingan | null;
}

export default function MatchDetailsDialog({
  open,
  onOpenChange,
  match,
}: MatchDetailsDialogProps) {
  if (!match) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detail Pertandingan</DialogTitle>
          <DialogDescription>
            Informasi lengkap pertandingan {match.acara?.nama}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">
                {match.acara?.nama}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Babak: {match.round?.nama}
              </p>
            </div>
            <StatusBadgeInline status={match.status} />
          </div>

          <div className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6">
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="text-center">
                <div className="font-bold text-lg mb-2">
                  {match.tim_a?.nama || "BYE"}
                </div>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {match.skor_tim_a || 0}
                </div>
                {match.tim_a && (
                  <Badge className="mt-2" variant="outline">
                    {match.tim_a.status}
                  </Badge>
                )}
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                  VS
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {formatDate(match.tanggal_pertandingan)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatTime(match.waktu_pertandingan)}
                </div>
              </div>

              <div className="text-center">
                <div className="font-bold text-lg mb-2">
                  {match.tim_b?.nama || "BYE"}
                </div>
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                  {match.skor_tim_b || 0}
                </div>
                {match.tim_b && (
                  <Badge className="mt-2" variant="outline">
                    {match.tim_b.status}
                  </Badge>
                )}
              </div>
            </div>

            {match.pemenang_id && (
              <div className="mt-6 text-center">
                <Badge className="px-4 py-2 bg-linear-to-r from-green-500 to-emerald-500 text-white border-0">
                  <Trophy className="w-4 h-4 mr-2" />
                  Pemenang:{" "}
                  {match.pemenang_id === match.tim_a_id
                    ? match.tim_a?.nama
                    : match.tim_b?.nama}
                </Badge>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                Informasi Waktu
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Tanggal:
                  </span>
                  <span>
                    {formatDate(match.tanggal_pertandingan)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Waktu:
                  </span>
                  <span>
                    {formatTime(match.waktu_pertandingan)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Durasi:
                  </span>
                  <span>
                    {match.durasi_pertandingan || 0} menit
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                Informasi Lokasi
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Lokasi:
                  </span>
                  <span>
                    {match.lokasi_lapangan || "Belum ditentukan"}
                  </span>
                </div>
                {match.url_lokasi_maps && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">
                      Google Maps:
                    </span>
                    <Button size="sm" variant="link" asChild>
                      <a
                        href={match.url_lokasi_maps}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lihat Lokasi
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Dibuat pada: {formatDate(match.dibuat_pada)}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Komponen inline untuk StatusBadge
function StatusBadgeInline({ status }: { status: EnumStatusMatch }) {
  const config = getStatusConfig(status);
  
  return (
    <Badge
      variant="outline"
      className={`${config.bg} ${config.text} ${config.border} font-medium px-3 py-1`}
    >
      {config.label}
    </Badge>
  );
}