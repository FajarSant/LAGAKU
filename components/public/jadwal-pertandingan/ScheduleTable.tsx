"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MapPin, Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { SupabasePertandingan } from "@/app/(public)/schadule/page";
import { formatDate, formatTime } from "@/utils/schedule-utils";
import { Button } from "@/components/ui/button";

interface ScheduleTableProps {
  loading: boolean;
  schedule: SupabasePertandingan[];
  onViewMatchDetails: (match: SupabasePertandingan) => void;
}

export default function ScheduleTable({
  loading,
  schedule,
  onViewMatchDetails,
}: ScheduleTableProps) {
  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          Daftar Jadwal Pertandingan
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {loading
            ? "Memuat jadwal..."
            : `${schedule.length} pertandingan ditemukan`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                <TableHead className="font-medium text-gray-700 dark:text-gray-300 py-3">
                  Tanggal & Waktu
                </TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300 py-3">
                  Turnamen
                </TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300 py-3">
                  Babak
                </TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300 py-3">
                  Tim A vs Tim B
                </TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300 py-3">
                  Skor
                </TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300 py-3">
                  Status
                </TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300 py-3">
                  Lokasi
                </TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300 py-3 text-right">
                  Detail
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="border-b border-gray-100 dark:border-gray-800">
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
                      <Skeleton className="h-3 w-20 mt-2 bg-gray-200 dark:bg-gray-700" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-6 w-16 bg-gray-200 dark:bg-gray-700" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-28 mb-1 bg-gray-200 dark:bg-gray-700" />
                      <Skeleton className="h-3 w-6 bg-gray-200 dark:bg-gray-700 mx-auto" />
                      <Skeleton className="h-4 w-28 mt-1 bg-gray-200 dark:bg-gray-700" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-6 w-12 bg-gray-200 dark:bg-gray-700" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-6 w-20 bg-gray-200 dark:bg-gray-700" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-28 bg-gray-200 dark:bg-gray-700" />
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <Skeleton className="h-8 w-16 ml-auto bg-gray-200 dark:bg-gray-700" />
                    </TableCell>
                  </TableRow>
                ))
              ) : schedule.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tidak ada jadwal ditemukan
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Coba ubah filter pencarian Anda
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                schedule.map((match) => (
                  <TableRow
                    key={match.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(match.tanggal_pertandingan)}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatTime(match.waktu_pertandingan)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                        {match.acara?.nama || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800 font-medium px-2.5 py-0.5"
                      >
                        {match.round?.nama || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`font-medium truncate ${
                              match.pemenang_id === match.tim_a_id
                                ? "font-bold text-green-600 dark:text-green-400"
                                : "text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {match.tim_a?.nama || "BYE"}
                          </span>
                          {match.tim_a && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs shrink-0 px-2 py-0.5 ${
                                match.tim_a.status === "aktif"
                                  ? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-300 bg-green-50 dark:bg-green-900/20"
                                  : "border-red-200 text-red-700 dark:border-red-800 dark:text-red-300 bg-red-50 dark:bg-red-900/20"
                              }`}
                            >
                              {match.tim_a.status === "aktif" ? "Aktif" : "Gugur"}
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-center">
                          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                            VS
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`font-medium truncate ${
                              match.pemenang_id === match.tim_b_id
                                ? "font-bold text-green-600 dark:text-green-400"
                                : "text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {match.tim_b?.nama || "BYE"}
                          </span>
                          {match.tim_b && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs shrink-0 px-2 py-0.5 ${
                                match.tim_b.status === "aktif"
                                  ? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-300 bg-green-50 dark:bg-green-900/20"
                                  : "border-red-200 text-red-700 dark:border-red-800 dark:text-red-300 bg-red-50 dark:bg-red-900/20"
                              }`}
                            >
                              {match.tim_b.status === "aktif" ? "Aktif" : "Gugur"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {match.status === "selesai" ? (
                        <div className="font-bold text-xl text-gray-900 dark:text-gray-100 text-center">
                          {match.skor_tim_a || 0} <span className="text-gray-400 dark:text-gray-500 mx-1">-</span> {match.skor_tim_b || 0}
                        </div>
                      ) : (
                        <div className="text-gray-300 dark:text-gray-600 text-xl font-medium text-center">
                          -
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-start">
                        <StatusBadge status={match.status} />
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 max-w-[150px]">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {match.lokasi_lapangan || "Belum ditentukan"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewMatchDetails(match)}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        >
                          <Eye className="w-4 h-4 mr-1.5" />
                          <span className="text-xs font-medium">Detail</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}