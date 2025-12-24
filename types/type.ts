// types.ts
export interface Acara {
  id: string;
  nama: string;
  deskripsi?: string | null;
  dibuat_pada: string;
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


export interface FormState {
  acara_id: string;
  tanggal_pertandingan: string;
  waktu_pertandingan: string;
}

export type Match = {
  id: string;
  status: string;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  tim_a: { nama: string } | null;
  tim_b: { nama: string } | null;
  round: { nama: string; urutan: number };
};
// utils/types.ts



export interface Tim {
  id: string;
  nama: string;
  status: string;
}

export interface Round {
  id: string;
  nama: string;
  urutan: number;
  acara_id: string;
  dibuat_pada: string;
  min_tim?: number;
  max_tim?: number;
  [key: string]: any; 
}

export interface Pertandingan {
  id: string;
  acara_id: string;
  round_id: string;
  tim_a_id: string | null;
  tim_b_id: string | null;
  status: string;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  pemenang_id: string | null;
  is_bye: boolean;
  tanggal_pertandingan: string | null;
  waktu_pertandingan: string | null;
  tim_a?: Tim;
  tim_b?: Tim;
  round?: Round;
}

export interface BracketRoundData {
  round: Round;
  matches: Pertandingan[];
  isPlaceholder?: boolean;
}

export interface MatchStatusConfig {
  bg: string;
  text: string;
  border: string;
}

export interface StatsData {
  rounds: number;
  totalMatches: number;
  completedMatches: number;
  totalTeams: number;
}