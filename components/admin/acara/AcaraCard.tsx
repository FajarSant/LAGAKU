"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FiEye, FiEdit, FiTrash2, FiInfo } from "react-icons/fi";
import { FaCalendar } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import Swal from "sweetalert2";

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

interface AcaraCardProps {
  acara: Acara;
}

const getAcaraConfig = (tipe: string) => {
  const configs = {
    SISTEM_GUGUR: { 
      label: "Sistem Gugur", 
      variant: "destructive" as const,
    },
    SISTEM_KOMPETISI: { 
      label: "Sistem Kompetisi", 
      variant: "default" as const,
    },
    SISTEM_CAMPURAN: { 
      label: "Sistem Campuran", 
      variant: "secondary" as const,
    },
  };

  return configs[tipe as keyof typeof configs] || configs.SISTEM_KOMPETISI;
};

const formatTanggal = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function AcaraCard({ acara }: AcaraCardProps) {
  const supabase = createClient();
  const config = getAcaraConfig(acara.tipe_acara);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Hapus Acara?",
      html: `
        <div class="text-left">
          <p class="mb-3">Anda akan menghapus acara:</p>
          <p class="font-semibold text-lg text-center mb-4">${acara.nama}</p>
          <div class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
            <p class="text-sm font-medium text-red-700 dark:text-red-300 mb-2">
              ⚠️ PERHATIAN: Tindakan ini tidak dapat dibatalkan!
            </p>
            <ul class="text-sm text-red-600 dark:text-red-400 mt-1 space-y-1">
              <li>• Semua data acara akan dihapus</li>
              <li>• Data terkait akan hilang</li>
              <li>• Aksi ini tidak dapat dikembalikan</li>
            </ul>
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus Permanen",
      cancelButtonText: "Batalkan",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from("acara")
          .delete()
          .eq("id", acara.id);

        if (error) throw error;

        toast.success("Acara berhasil dihapus");
        window.location.reload(); // Refresh page to update list
      } catch (error) {
        toast.error("Gagal menghapus acara");
      }
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {acara.nama}
          </CardTitle>
          <Badge variant={config.variant}>
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <FaCalendar className="h-3 w-3" />
          <span>Dibuat: {formatTanggal(acara.dibuat_pada)}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Deskripsi */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FiInfo className="h-4 w-4" />
            <span>Deskripsi</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {acara.deskripsi || "Tidak ada deskripsi untuk acara ini."}
          </p>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            asChild 
            variant="outline" 
            className="w-full justify-start gap-2"
          >
            <Link href={`/admin/acara/${acara.id}`}>
              <FiEye className="h-4 w-4" />
              Lihat Detail
            </Link>
          </Button>
          
          <div className="flex gap-2">
            <Button 
              asChild
              className="flex-1 gap-2"
            >
              <Link href={`/admin/acara/edit/${acara.id}`}>
                <FiEdit className="h-4 w-4" />
                Edit
              </Link>
            </Button>

            <Button 
              variant="destructive"
              className="flex-1 gap-2"
              onClick={handleDelete}
            >
              <FiTrash2 className="h-4 w-4" />
              Hapus
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}