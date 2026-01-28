"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Swal from "sweetalert2";

// Import icons untuk error state
import { FiArrowLeft, FiCheckCircle, FiXCircle } from "react-icons/fi";
import {
  Acara,
  JENIS_ACARA_CONFIG,
  STATUS_ACARA_CONFIG,
} from "@/constants/config";
import LoadingSkeleton from "@/components/admin/acara/detail/LoadingSkeleton";
import DetailHeader from "@/components/admin/acara/detail/DetailHeader";
import DeskripsiSection from "@/components/admin/acara/detail/DeskripsiSection";
import InfoWaktuSection from "@/components/admin/acara/detail/InfoWaktuSection";
import InfoLokasiSection from "@/components/admin/acara/detail/InfoLokasiSection";
import StatistikCards from "@/components/admin/acara/detail/StastistikCard";
import QuickActions from "@/components/admin/acara/detail/QuickActions";
// import SistemInfoSection from "@/components/admin/acara/detail/SistemInfoSection";
import MetadataSection from "@/components/admin/acara/detail/MetadataSection";
import { formatDateTime } from "@/utils/formatters";

export default function DetailAcaraPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [acara, setAcara] = useState<Acara | null>(null);
  const [loading, setLoading] = useState(true);
  const [pesertaCount, setPesertaCount] = useState(0);
  const [jumlahPertandingan, setJumlahPertandingan] = useState(0);
  const [jumlahGrup, setJumlahGrup] = useState(0);

  useEffect(() => {
    if (id) {
      fetchAcara();
      fetchStatistik();
    }
  }, [id]);

  const fetchAcara = async () => {
    try {
      const { data, error } = await supabase
        .from("acara")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setAcara(data);
      } else {
        throw new Error("Acara tidak ditemukan");
      }
    } catch (error) {
      Swal.fire({
        title: "Acara Tidak Ditemukan",
        text: "Acara yang Anda cari tidak ditemukan atau telah dihapus.",
        icon: "error",
        confirmButtonText: "Kembali ke Daftar",
        background: "#1f2937",
        color: "#f9fafb",
        confirmButtonColor: "#3b82f6",
        customClass: {
          popup: "rounded-2xl border border-gray-800 shadow-2xl",
          confirmButton:
            "px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200",
        },
      }).then(() => {
        router.push("/acara");
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistik = async () => {
    try {
      // Fetch jumlah peserta
      const { count: pesertaCount, error: pesertaError } = await supabase
        .from("peserta_acara")
        .select("*", { count: "exact", head: true })
        .eq("acara_id", id);

      if (!pesertaError && pesertaCount !== null) {
        setPesertaCount(pesertaCount);
      }

      // Fetch jumlah pertandingan
      const { count: pertandinganCount, error: pertandinganError } =
        await supabase
          .from("pertandingan")
          .select("*", { count: "exact", head: true })
          .eq("acara_id", id);

      if (!pertandinganError && pertandinganCount !== null) {
        setJumlahPertandingan(pertandinganCount);
      }

      // Fetch jumlah grup
      const { count: grupCount, error: grupError } = await supabase
        .from("grup_acara")
        .select("*", { count: "exact", head: true })
        .eq("acara_id", id);

      if (!grupError && grupCount !== null) {
        setJumlahGrup(grupCount);
      }
    } catch (error) {
      console.error("Error fetching statistik:", error);
    }
  };

  const handleDelete = async () => {
    if (!acara) return;

    const result = await Swal.fire({
      title:
        '<span class="text-white text-xl font-semibold">Hapus Acara?</span>',
      html: `
        <div class="text-left">
          <div class="flex items-center justify-center mb-4">
            <div class="w-16 h-16 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </div>
          <p class="text-gray-300 mb-3 text-center">Anda akan menghapus acara:</p>
          <p class="font-semibold text-white text-lg text-center mb-4">${acara.nama}</p>
          <div class="mt-4 p-4 bg-red-900/20 border border-red-800/30 rounded-xl backdrop-blur-sm">
            <p class="text-sm font-semibold text-red-300 mb-2 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              PERHATIAN: Tindakan ini tidak dapat dibatalkan!
            </p>
            <ul class="text-sm text-red-200/80 mt-2 space-y-1 ml-2">
              <li class="flex items-center gap-2">• Semua data peserta akan dihapus</li>
              <li class="flex items-center gap-2">• Jadwal dan hasil pertandingan akan hilang</li>
              <li class="flex items-center gap-2">• Statistik acara akan direset</li>
            </ul>
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#374151",
      confirmButtonText:
        '<span class="flex items-center gap-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>Hapus Permanen</span>',
      cancelButtonText:
        '<span class="flex items-center gap-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>Batalkan</span>',
      reverseButtons: true,
      focusCancel: true,
      background: "#1f2937",
      color: "#f9fafb",
      customClass: {
        popup: "rounded-2xl border border-gray-800 shadow-2xl",
        confirmButton:
          "px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200",
        cancelButton:
          "px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200",
      },
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title:
            '<div class="flex flex-col items-center"><div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div><span class="text-white text-lg">Menghapus acara...</span></div>',
          html: '<p class="text-gray-300 text-center">Sedang menghapus acara dan semua data terkait</p>',
          allowOutsideClick: false,
          showConfirmButton: false,
          background: "#1f2937",
          color: "#f9fafb",
          customClass: {
            popup: "rounded-2xl border border-gray-800",
          },
        });

        const { error } = await supabase
          .from("acara")
          .delete()
          .eq("id", acara.id);

        if (error) throw error;

        await Swal.fire({
          title:
            '<span class="text-white text-xl font-semibold">✓ Berhasil!</span>',
          html: '<p class="text-gray-300">Acara berhasil dihapus.</p>',
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#1f2937",
          color: "#f9fafb",
          customClass: {
            popup: "rounded-2xl border border-gray-800",
            timerProgressBar: "bg-linear-to-r from-green-500 to-emerald-500",
          },
        });

        router.push("/acara");
      } catch (error) {
        Swal.fire({
          title: '<span class="text-white text-xl font-semibold">Gagal!</span>',
          html: '<p class="text-gray-300">Terjadi kesalahan saat menghapus acara.</p>',
          icon: "error",
          confirmButtonColor: "#3b82f6",
          background: "#1f2937",
          color: "#f9fafb",
          customClass: {
            popup: "rounded-2xl border border-gray-800",
          },
        });
      }
    }
  };

  const showCopySuccess = () => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "ID Acara disalin!",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: "#10b981",
      color: "#ffffff",
      customClass: {
        popup: "rounded-lg shadow-lg",
        timerProgressBar: "bg-white/30",
      },
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showCopySuccess();
  };

  const shareAcara = async () => {
    const shareUrl = `${window.location.origin}/acara/${acara?.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: acara?.nama,
          text: `Lihat detail acara ${acara?.nama}`,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Sharing cancelled", error);
      }
    } else {
      copyToClipboard(shareUrl);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Link acara disalin!",
        showConfirmButton: false,
        timer: 1500,
        background: "#3b82f6",
        color: "#ffffff",
        customClass: {
          popup: "rounded-lg shadow-lg",
        },
      });
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!acara) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            asChild
            variant="outline"
            className="gap-2 mb-6"
          >
            <Link href="/acara">
              <FiArrowLeft />
              Kembali ke Daftar Acara
            </Link>
          </Button>
          <Card className="bg-card border shadow-2xl">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-linear-to-r from-red-500/20 to-pink-500/20 blur-3xl rounded-full dark:from-red-500/10 dark:to-pink-500/10"></div>
                <div className="relative w-24 h-24 mx-auto bg-linear-to-br from-red-600 to-pink-700 rounded-full flex items-center justify-center dark:from-red-500 dark:to-pink-600">
                  <FiXCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Acara Tidak Ditemukan
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Acara yang Anda cari tidak ditemukan atau mungkin telah dihapus.
              </p>
              <Button
                asChild
                className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-xl dark:from-blue-500 dark:to-cyan-600"
              >
                <Link href="/acara">Lihat Semua Acara</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const jenisAcaraConfig =
    JENIS_ACARA_CONFIG[acara.tipe_acara as keyof typeof JENIS_ACARA_CONFIG] ||
    JENIS_ACARA_CONFIG.SISTEM_KOMPETISI;
  const statusAcaraConfig = acara.status
    ? STATUS_ACARA_CONFIG[acara.status as keyof typeof STATUS_ACARA_CONFIG]
    : null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <DetailHeader
          acara={acara}
          jenisAcaraConfig={jenisAcaraConfig}
          statusAcaraConfig={statusAcaraConfig}
          onShare={shareAcara}
          onCopyId={() => copyToClipboard(acara.id)}
          onDelete={handleDelete}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <DeskripsiSection deskripsi={acara.deskripsi} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoWaktuSection
                tanggalMulai={acara.tanggal_mulai}
                tanggalSelesai={acara.tanggal_selesai}
              />
              <InfoLokasiSection
                lokasi={acara.lokasi}
                pesertaMaksimal={acara.peserta_maksimal}
                pesertaCount={pesertaCount}
              />
            </div>

            <StatistikCards
              pesertaCount={pesertaCount}
              jumlahPertandingan={jumlahPertandingan}
              jumlahGrup={jumlahGrup}
              jenisAcaraConfig={jenisAcaraConfig}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions
              acaraId={acara.id}
              tipeAcara={acara.tipe_acara}
              acaraNama={acara.nama}
            />
         
            <MetadataSection
              dibuatPada={acara.dibuat_pada}
              acaraId={acara.id}
              onCopyId={() => copyToClipboard(acara.id)}
            />
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-8 border-t">
          <Button
            asChild
            variant="outline"
            className="gap-3"
          >
            <Link href="/acara">
              <FiArrowLeft />
              Kembali ke Daftar Acara
            </Link>
          </Button>

          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p>Terakhir diperbarui: {formatDateTime(acara.dibuat_pada)}</p>
            {acara.status === "SELESAI" && (
              <p className="text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center justify-center md:justify-end gap-2">
                <FiCheckCircle className="w-4 h-4" />
                Acara ini telah selesai
              </p>
            )}
            {acara.status === "DIBATALKAN" && (
              <p className="text-red-600 dark:text-red-400 font-medium mt-1 flex items-center justify-center md:justify-end gap-2">
                <FiXCircle className="w-4 h-4" />
                Acara ini dibatalkan
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}