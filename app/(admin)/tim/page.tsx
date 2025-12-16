"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import TimTable, { Tim } from "@/components/admin/tim/DataTable";
import { toast } from "sonner";
import DetailAnggotaModal from "@/components/admin/tim/DetailDialogAnggota";
import { Skeleton } from "@/components/ui/skeleton";

export default function TimPage() {
  const router = useRouter();
  const supabase = createClient();

  const [timList, setTimList] = useState<Tim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimId, setSelectedTimId] = useState<string | null>(null);

  // ================================================
  // LOAD DATA TIM + JUMLAH ANGGOTA + ACARA
  // ================================================
  const loadTim = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("tim")
      .select(`
        id,
        nama,
        jurusan,
        angkatan,
        nomor_hp,
        dibuat_pada,
        acara:acara_id (
          id,
          nama
        ),
        anggota_tim(count)
      `)
      .order("dibuat_pada", { ascending: false });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const formatted: Tim[] = data.map((item: any) => ({
      id: item.id,
      nama: item.nama,
      jurusan: item.jurusan,
      angkatan: item.angkatan,
      nomor_hp: item.nomor_hp,
      dibuat_pada: item.dibuat_pada,
      jumlah_pemain: item.anggota_tim?.[0]?.count || 0,
      acara_nama: item.acara?.nama || "-",
    }));

    setTimList(formatted);
    setLoading(false);
  };

  useEffect(() => {
    loadTim();
  }, []);

  // ================================================
  // HANDLE DELETE
  // ================================================
  const handleDelete = async (tim: Tim) => {
    if (!confirm(`Hapus tim ${tim.nama}? Semua anggota juga akan dihapus.`))
      return;

    const { error } = await supabase.from("tim").delete().eq("id", tim.id);

    if (error) toast.error(error.message);
    else {
      toast.success("Tim berhasil dihapus");
      loadTim();
    }
  };

  const handleDetail = (tim: Tim) => {
    setSelectedTimId(tim.id);
  };

  // ================================================
  // RENDER PAGE
  // ================================================
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Data Tim</h1>
        <Button onClick={() => router.push("/admin/tim/tambah")}>
          Tambah Tim
        </Button>
      </div>

      {/* LOADING SKELETON */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <TimTable
          data={timList}
          onDelete={handleDelete}
          onDetail={handleDetail}
          onEdit={(tim) => router.push(`/admin/tim/edit/${tim.id}`)}
        />
      )}

      {/* DETAIL MODAL */}
      {selectedTimId && (
        <DetailAnggotaModal
          timId={selectedTimId}
          onClose={() => setSelectedTimId(null)}
        />
      )}
    </div>
  );
}
