"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import AcaraHeader from "@/components/admin/acara/AcaraHeader";
import SearchFilter from "@/components/admin/acara/SearchFilter";
import AcaraSkeleton from "@/components/admin/acara/AcaraSkeleton";
import AcaraGrid from "@/components/admin/acara/AcaraGird";
import EmptyState from "@/components/admin/acara/EmptyState";

interface Acara {
  id: string;
  nama: string;
  deskripsi: string | null;
  tipe_acara: "SISTEM_GUGUR" | "SISTEM_KOMPETISI" | "SISTEM_CAMPURAN";
  dibuat_pada: string;
  lokasi?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  status?: string;
}

export default function AcaraPage() {
  const supabase = createClient();

  const [acara, setAcara] = useState<Acara[]>([]);
  const [filtered, setFiltered] = useState<Acara[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const fetchAcara = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("acara")
        .select("*")
        .order("dibuat_pada", { ascending: false });

      if (error) throw error;

      setAcara(data || []);
      applyFilters(data || [], search, selectedFilter);
    } catch (error) {
      toast.error("Gagal memuat data acara");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcara();
  }, []);

  useEffect(() => {
    applyFilters(acara, search, selectedFilter);
  }, [search, selectedFilter, acara]);

  const applyFilters = (data: Acara[], searchTerm: string, filter: string) => {
    let filteredData = data;

    // Search filter
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.nama.toLowerCase().includes(s) ||
          (item.deskripsi && item.deskripsi.toLowerCase().includes(s))
      );
    }

    // Type filter
    if (filter !== "all") {
      filteredData = filteredData.filter((item) => item.tipe_acara === filter);
    }

    setFiltered(filteredData);
  };

  const handleRefresh = () => {
    fetchAcara();
  };

  return (
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        <AcaraHeader
          acaraCount={acara.length}
          filteredCount={filtered.length}
          onRefresh={handleRefresh}
        />

        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          onRefresh={handleRefresh}
          acaraCount={acara.length}
          filteredCount={filtered.length}
        />

        {loading ? (
          <AcaraSkeleton />
        ) : (
          <>
            {filtered.length > 0 ? (
              <AcaraGrid acara={filtered} />
            ) : (
              <EmptyState
                hasSearch={!!search}
                hasFilter={selectedFilter !== "all"}
                onAddNew={() => (window.location.href = "/admin/acara/tambah")}
              />
            )}
          </>
        )}

        {/* Footer Info */}
        {!loading && filtered.length > 0 && (
          <div className="mt-8 pt-4 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Menampilkan {filtered.length} dari {acara.length} acara
              </p>
            </div>
          </div>
        )}
      </div>
  );
}
