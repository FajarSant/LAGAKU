"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { AcaraSimple, EnumStatusMatch, EnumStatusTim } from "@/utils";
import ScheduleHeader from "@/components/public/jadwal-pertandingan/ScheduleHeader";
import ScheduleStats from "@/components/public/jadwal-pertandingan/ScheduleStats";
import ScheduleFilters from "@/components/public/jadwal-pertandingan/ScheduleFilters";
import ScheduleTable from "@/components/public/jadwal-pertandingan/ScheduleTable";
import ScheduleCalendar from "@/components/public/jadwal-pertandingan/ScheduleCalendar";
import MatchDetailsDialog from "@/components/public/jadwal-pertandingan/MatchDetailsDialog";

interface Tim {
  id: string;
  nama: string;
  status: EnumStatusTim;
  acara_id?: string;
  jurusan?: string;
  angkatan?: string;
  nomor_hp?: string;
  jumlah_pemain?: number;
  dibuat_pada?: string;
}

export type SupabasePertandingan = {
  id: string;
  status: EnumStatusMatch;
  tanggal_pertandingan: string | null;
  waktu_pertandingan: string | null;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  tim_a_id: string | null;
  tim_b_id: string | null;
  pemenang_id: string | null;
  acara_id: string;
  round_id: string;
  lokasi_lapangan: string | null;
  url_lokasi_maps: string | null;
  durasi_pertandingan: number | null;
  dibuat_pada: string;
  tim_a: Tim | null;
  tim_b: Tim | null;
  acara: { nama: string } | null;
  round: { nama: string; urutan: number } | null;
};

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<SupabasePertandingan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("semua");
  const [statusFilter, setStatusFilter] = useState<EnumStatusMatch | "semua">(
    "semua"
  );
  const [acaraFilter, setAcaraFilter] = useState<string>("semua");
  const [acaraList, setAcaraList] = useState<AcaraSimple[]>([]);
  const [selectedMatch, setSelectedMatch] =
    useState<SupabasePertandingan | null>(null);
  const [showMatchDetails, setShowMatchDetails] = useState(false);

  // Fetch acara list on mount
  useEffect(() => {
    fetchAcaraList();
  }, []);

  // Fetch schedule with debounce when filters change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSchedule();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, dateFilter, statusFilter, acaraFilter]);

  const fetchAcaraList = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("acara")
        .select("id, nama")
        .order("nama");

      if (error) throw error;
      setAcaraList(data || []);
    } catch (error) {
      console.error("Error fetching acara list:", error);
    }
  };

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Build query - HANYA tampilkan yang belum selesai (berlangsung atau dijadwalkan)
      let query = supabase
        .from("pertandingan")
        .select(
          `
          *,
          tim_a:tim_a_id (
            nama,
            status
          ),
          tim_b:tim_b_id (
            nama,
            status
          ),
          acara:acara_id (
            nama
          ),
          round:round_id (
            nama,
            urutan
          )
        `
        )
        .in("status", ["berlangsung", "dijadwalkan"]) // Hanya status berlangsung dan dijadwalkan
        .order("status", { ascending: false }) // Berlangsung diatas, lalu dijadwalkan
        .order("tanggal_pertandingan", { ascending: true })
        .order("waktu_pertandingan", { ascending: true });

      // Apply search filter
      if (searchQuery.trim()) {
        query = query.or(
          `tim_a.nama.ilike.%${searchQuery}%,tim_b.nama.ilike.%${searchQuery}%,acara.nama.ilike.%${searchQuery}%`
        );
      }

      // Apply status filter (jika user pilih filter tertentu)
      if (statusFilter !== "semua") {
        query = query.eq("status", statusFilter);
      }

      // Apply acara filter
      if (acaraFilter !== "semua") {
        query = query.eq("acara_id", acaraFilter);
      }

      // Apply date filter
      if (dateFilter !== "semua") {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const thisWeek = new Date(today);
        thisWeek.setDate(thisWeek.getDate() + 7);

        switch (dateFilter) {
          case "hari-ini":
            query = query.eq(
              "tanggal_pertandingan",
              today.toISOString().split("T")[0]
            );
            break;
          case "besok":
            query = query.eq(
              "tanggal_pertandingan",
              tomorrow.toISOString().split("T")[0]
            );
            break;
          case "minggu-ini":
            query = query
              .gte("tanggal_pertandingan", today.toISOString().split("T")[0])
              .lte(
                "tanggal_pertandingan",
                thisWeek.toISOString().split("T")[0]
              );
            break;
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to match our interface
      const transformedData: SupabasePertandingan[] = (data || []).map(
        (item) => ({
          id: item.id,
          status: item.status as EnumStatusMatch,
          tanggal_pertandingan: item.tanggal_pertandingan,
          waktu_pertandingan: item.waktu_pertandingan,
          skor_tim_a: item.skor_tim_a,
          skor_tim_b: item.skor_tim_b,
          tim_a_id: item.tim_a_id,
          tim_b_id: item.tim_b_id,
          pemenang_id: item.pemenang_id,
          acara_id: item.acara_id,
          round_id: item.round_id,
          lokasi_lapangan: item.lokasi_lapangan,
          url_lokasi_maps: item.url_lokasi_maps,
          durasi_pertandingan: item.durasi_pertandingan,
          dibuat_pada: item.dibuat_pada,
          tim_a: item.tim_a
            ? {
                id: item.tim_a_id || "",
                nama: item.tim_a.nama,
                status: item.tim_a.status as EnumStatusTim,
              }
            : null,
          tim_b: item.tim_b
            ? {
                id: item.tim_b_id || "",
                nama: item.tim_b.nama,
                status: item.tim_b.status as EnumStatusTim,
              }
            : null,
          acara: item.acara ? { nama: item.acara.nama } : null,
          round: item.round
            ? {
                nama: item.round.nama,
                urutan: item.round.urutan,
              }
            : null,
        })
      );

      setSchedule(transformedData);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMatchDetails = (match: SupabasePertandingan) => {
    setSelectedMatch(match);
    setShowMatchDetails(true);
  };

  const handleRefresh = () => {
    fetchSchedule();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setDateFilter("semua");
    setStatusFilter("semua");
    setAcaraFilter("semua");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <ScheduleHeader
          onRefresh={handleRefresh}
          onClearFilters={handleClearFilters}
          hasFilters={
            searchQuery !== "" ||
            dateFilter !== "semua" ||
            statusFilter !== "semua" ||
            acaraFilter !== "semua"
          }
        />

        {/* Statistics Cards - Updated to show only active matches */}
        <ScheduleStats loading={loading} schedule={schedule} />

        {/* Filters Section */}
        <ScheduleFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          acaraFilter={acaraFilter}
          setAcaraFilter={setAcaraFilter}
          acaraList={acaraList}
          loading={loading}
        />

        {/* Schedule Table */}
        <ScheduleTable
          loading={loading}
          schedule={schedule}
          onViewMatchDetails={handleViewMatchDetails}
        />

        {/* Calendar View (Coming Soon) */}
        <ScheduleCalendar />
      </div>

      {/* Match Details Dialog */}
      <MatchDetailsDialog
        open={showMatchDetails}
        onOpenChange={setShowMatchDetails}
        match={selectedMatch}
      />
    </div>
  );
}
