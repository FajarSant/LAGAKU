"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { AcaraSimple, EnumStatusMatch } from "@/utils";

interface ScheduleFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  statusFilter: EnumStatusMatch | "semua";
  setStatusFilter: (filter: EnumStatusMatch | "semua") => void;
  acaraFilter: string;
  setAcaraFilter: (filter: string) => void;
  acaraList: AcaraSimple[];
  loading: boolean;
}

export default function ScheduleFilters({
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter,
  statusFilter,
  setStatusFilter,
  acaraFilter,
  setAcaraFilter,
  acaraList,
  loading,
}: ScheduleFiltersProps) {
  return (
    <Card className="border border-gray-200 dark:border-gray-800 mb-8">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <h3 className="font-medium text-gray-700 dark:text-gray-300">Filter Jadwal</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari tim, turnamen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Select value={dateFilter} onValueChange={setDateFilter} disabled={loading}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Tanggal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Tanggal</SelectItem>
                <SelectItem value="hari-ini">Hari Ini</SelectItem>
                <SelectItem value="besok">Besok</SelectItem>
                <SelectItem value="minggu-ini">Minggu Ini</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as EnumStatusMatch | "semua")}
              disabled={loading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Status</SelectItem>
                <SelectItem value="berlangsung">Berlangsung</SelectItem>
                <SelectItem value="dijadwalkan">Dijadwalkan</SelectItem>
                {/* Hapus opsi 'selesai' karena tidak ditampilkan untuk user */}
              </SelectContent>
            </Select>

            <Select value={acaraFilter} onValueChange={setAcaraFilter} disabled={loading}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Turnamen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Turnamen</SelectItem>
                {acaraList.map((acara) => (
                  <SelectItem key={acara.id} value={acara.id}>
                    {acara.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Informasi bahwa hanya pertandingan aktif yang ditampilkan */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium text-blue-600 dark:text-blue-400">Info:</span> Hanya menampilkan pertandingan yang sedang berlangsung atau dijadwalkan
          </p>
        </div>
      </CardContent>
    </Card>
  );
}