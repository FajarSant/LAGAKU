import { EnumStatusMatch } from "./index";

// Tipe untuk konfigurasi badge status
export interface StatusConfig {
  bg: string;
  text: string;
  border: string;
  label: string;
}

// Fungsi untuk mendapatkan konfigurasi status
export const getStatusConfig = (status: EnumStatusMatch): StatusConfig => {
  const statusConfigs: Record<EnumStatusMatch, StatusConfig> = {
    dijadwalkan: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-800 dark:text-yellow-300",
      border: "border-yellow-200 dark:border-yellow-800",
      label: "Dijadwalkan",
    },
    berlangsung: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-800 dark:text-green-300",
      border: "border-green-200 dark:border-green-800",
      label: "Berlangsung",
    },
    selesai: {
      bg: "bg-gray-100 dark:bg-gray-800",
      text: "text-gray-800 dark:text-gray-300",
      border: "border-gray-200 dark:border-gray-700",
      label: "Selesai",
    },
  };

  return statusConfigs[status];
};

// Fungsi untuk memformat tanggal
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long" as const,
      year: "numeric" as const,
      month: "long" as const,
      day: "numeric" as const,
    };
    return new Intl.DateTimeFormat("id-ID", options).format(date);
  } catch {
    return "-";
  }
};

// Fungsi untuk memformat waktu
export const formatTime = (timeString: string | null | undefined): string => {
  if (!timeString) return "-";
  return timeString.substring(0, 5);
};