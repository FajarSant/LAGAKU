import { IconType } from "react-icons";
import {
  FiEye,
  FiCheckCircle,
  FiAward,
  FiXCircle,
} from "react-icons/fi";

export interface Acara {
  id: string;
  nama: string;
  deskripsi: string | null;
  tipe_acara: "SISTEM_GUGUR" | "SISTEM_KOMPETISI" | "SISTEM_CAMPURAN";
  dibuat_pada: string;
  lokasi?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  peserta_maksimal?: number;
  status?: "DRAFT" | "PUBLISHED" | "SELESAI" | "DIBATALKAN";
}

export interface ConfigItem {
  label: string;
  color: string;
  gradient: string;
  bgGradient: string;
  icon?: IconType;
  bgColor?: string;
}

export const JENIS_ACARA_CONFIG: Record<string, ConfigItem> = {
  SISTEM_GUGUR: { 
    label: "Sistem Gugur", 
    color: "text-red-400", 
    gradient: "from-red-600 to-pink-700",
    bgGradient: "bg-gradient-to-r from-red-600 to-pink-700"
  },
  SISTEM_KOMPETISI: { 
    label: "Sistem Kompetisi", 
    color: "text-blue-400", 
    gradient: "from-blue-600 to-cyan-700",
    bgGradient: "bg-gradient-to-r from-blue-600 to-cyan-700"
  },
  SISTEM_CAMPURAN: { 
    label: "Sistem Campuran", 
    color: "text-purple-400", 
    gradient: "from-purple-600 to-indigo-700",
    bgGradient: "bg-gradient-to-r from-purple-600 to-indigo-700"
  },
} as const;

export const STATUS_ACARA_CONFIG: Record<string, ConfigItem> = {
  DRAFT: { 
    label: "Draft", 
    color: "text-gray-300", 
    bgColor: "bg-gray-900", 
    icon: FiEye,
    gradient: "from-gray-700 to-gray-800",
    bgGradient: "bg-gradient-to-r from-gray-700 to-gray-800"
  },
  PUBLISHED: { 
    label: "Published", 
    color: "text-green-300", 
    bgColor: "bg-green-900/30", 
    icon: FiCheckCircle,
    gradient: "from-emerald-600 to-green-700",
    bgGradient: "bg-gradient-to-r from-emerald-600 to-green-700"
  },
  SELESAI: { 
    label: "Selesai", 
    color: "text-blue-300", 
    bgColor: "bg-blue-900/30", 
    icon: FiAward,
    gradient: "from-blue-600 to-cyan-700",
    bgGradient: "bg-gradient-to-r from-blue-600 to-cyan-700"
  },
  DIBATALKAN: { 
    label: "Dibatalkan", 
    color: "text-red-300", 
    bgColor: "bg-red-900/30", 
    icon: FiXCircle,
    gradient: "from-red-600 to-rose-700",
    bgGradient: "bg-gradient-to-r from-red-600 to-rose-700"
  },
} as const;

export const SISTEM_DESKRIPSI: Record<string, string> = {
  SISTEM_GUGUR: "Peserta yang kalah akan langsung gugur dari turnamen. Sistem ini cocok untuk turnamen dengan jumlah peserta genap dan waktu yang terbatas.",
  SISTEM_KOMPETISI: "Peserta mengumpulkan poin dari setiap pertandingan. Peringkat ditentukan berdasarkan total poin yang dikumpulkan. Cocok untuk liga atau kompetisi dengan banyak peserta.",
  SISTEM_CAMPURAN: "Kombinasi fase grup menggunakan sistem kompetisi dan fase knockout menggunakan sistem gugur. Cocok untuk turnamen besar dengan banyak peserta dan durasi yang panjang.",
};

// SweetAlert themes
export const SWEET_ALERT_THEME = {
  success: {
    background: '#1f2937',
    color: '#f9fafb',
    confirmButtonColor: '#10b981',
  },
  error: {
    background: '#1f2937',
    color: '#f9fafb',
    confirmButtonColor: '#ef4444',
  },
  warning: {
    background: '#1f2937',
    color: '#f9fafb',
    confirmButtonColor: '#f59e0b',
  },
  info: {
    background: '#1f2937',
    color: '#f9fafb',
    confirmButtonColor: '#3b82f6',
  },
};