// types.ts
export interface Acara {
  id: string;
  nama: string;
  deskripsi?: string | null;
  tanggal_mulai?: string | null;
  tanggal_selesai?: string | null;
}

export interface PesertaAcara {
  id: string;
  tim_id: string;
}

export interface Tim {
  id: string;
  nama: string;
  // jurusan: string | null;
  // angkatan: string | null;
  // nomor_hp: string | null;
  // dibuat_pada: string;
  // jumlah_pemain: number;
}

export interface PesertaTimRow {
  peserta_id: string;
  tim: Tim;
}

export interface Round  {
  id: string;
  nama: string;
  urutan: number;
  min_tim: number;
  max_tim: number;
};

export interface FormState  {
  acara_id: string;
  tanggal_pertandingan: string;
  waktu_pertandingan: string;
};

export type Match = {
  id: string;
  status: string;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  tim_a: { nama: string } | null;
  tim_b: { nama: string } | null;
  round: { nama: string; urutan: number };
};