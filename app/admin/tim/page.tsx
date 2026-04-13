"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import TimTable, { Tim } from "@/components/admin/tim/DataTable";
import { toast } from "sonner";
import DetailAnggotaModal from "@/components/admin/tim/DetailDialogAnggota";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Swal from "sweetalert2";

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
      .select(
        `
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
      `,
      )
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
  // HANDLE DELETE WITH SWEETALERT
  // ================================================
  const handleDelete = async (tim: Tim) => {
    const result = await Swal.fire({
      title: 'Hapus Tim?',
      html: `
        <div class="text-left">
          <p class="mb-3">Apakah Anda yakin ingin menghapus tim:</p>
          <div class="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
            <p class="font-semibold text-lg text-red-700 mb-2">${tim.nama}</p>
            <div class="space-y-1 text-sm text-gray-600">
              <p><span class="font-medium">Acara:</span> ${tim.acara_nama}</p>
              <p><span class="font-medium">Jumlah Anggota:</span> ${tim.jumlah_pemain} orang</p>
              ${tim.jurusan ? `<p><span class="font-medium">Jurusan:</span> ${tim.jurusan}</p>` : ''}
              ${tim.angkatan ? `<p><span class="font-medium">Angkatan:</span> ${tim.angkatan}</p>` : ''}
            </div>
          </div>
          <p class="text-sm text-red-600 font-medium">⚠️ Peringatan: Semua anggota tim juga akan ikut terhapus!</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus Tim',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-lg',
        confirmButton: 'px-5 py-2 rounded',
        cancelButton: 'px-5 py-2 rounded'
      }
    });

    if (!result.isConfirmed) return;

    // Tampilkan loading
    Swal.fire({
      title: 'Menghapus...',
      text: 'Sedang menghapus data tim',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: 'rounded-lg'
      }
    });

    const { error } = await supabase.from("tim").delete().eq("id", tim.id);

    Swal.close();

    if (error) {
      Swal.fire({
        title: 'Gagal!',
        text: error.message || 'Terjadi kesalahan saat menghapus tim',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
        customClass: {
          popup: 'rounded-lg'
        }
      });
    } else {
      Swal.fire({
        title: 'Berhasil!',
        html: `
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Tim Berhasil Dihapus</h3>
            <p class="text-gray-600">Tim "${tim.nama}" telah dihapus dari sistem.</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-lg'
        }
      });
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
        <Link href="/admin/tim/tambah">
          <Button>Tambah Tim</Button>
        </Link>
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