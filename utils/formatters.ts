export const formatTanggal = (dateString?: string): string => {
  if (!dateString) return "Belum ditentukan";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

export const calculateProgress = (pesertaCount: number, pesertaMaksimal?: number): number => {
  if (!pesertaMaksimal || pesertaMaksimal === 0) return 0;
  return Math.min(100, (pesertaCount / pesertaMaksimal) * 100);
};

export const formatTime = (dateString?: string): string => {
  if (!dateString) return "Belum ditentukan";
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};