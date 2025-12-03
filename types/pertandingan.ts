export type Peserta = {
  id: string;
  nama_peserta: string;
  logo?: string | null;
};

export type Acara = {
  id: string;
  nama_acara: string;
};

export type PertandinganStatus = "dijadwalkan" | "berlangsung" | "selesai";

export interface Pertandingan {
  id: string;
  acara_id: string;

  peserta_tuan_rumah_id: string | null;
  peserta_tamu_id: string | null;

  tanggal_pertandingan: string | null;
  status: PertandinganStatus;

  skor_tuan_rumah: number;
  skor_tamu: number;

  durasi_menit: number;
  menit_saat_ini: number;

  lokasi_lapangan: string | null;
  dibuat_pada: string;

  acara?: Acara | null;
  peserta_tuan_rumah?: Peserta | null;
  peserta_tamu?: Peserta | null;
}
