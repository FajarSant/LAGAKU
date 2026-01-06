export type EnumJenisKelamin = "L" | "P";
export type EnumStatusMatch = "dijadwalkan" | "berlangsung" | "selesai";
export type EnumStatusTim = "aktif" | "gugur";
export type EnumPeran = "admin" | "mahasiswa";

export interface Pengguna {
  id: string;
  nama: string;
  email: string;
  avatar_url?: string;
  peran: EnumPeran;
  nim?: string;
  fakultas?: string;
  program_studi?: string;
  jenis_kelamin?: EnumJenisKelamin;
  tanggal_lahir?: string;
  alamat?: string;
  nomor_hp?: string;
  is_verified: boolean;
  dibuat_pada: string;
}

export interface UserStats {
  totalMatches: number;
  tournamentsJoined: number;
  activeTeams: number;
  upcomingMatches: number;
}

export interface Acara {
  id: string;
  nama: string;
  deskripsi?: string | null;
  dibuat_pada: string;
  tanggal_mulai?: string | null;
  tanggal_selesai?: string | null;
}

export type AcaraWithCount = {
  id: string;
  nama: string;
  deskripsi?: string;
  tanggal_mulai?: string;
  total_pertandingan: number;
};

export type AcaraFromDB = {
  id: string;
  nama: string;
  deskripsi?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  tanggal_mulai?: string | null;
  start_date?: string | null;
  tanggal_selesai?: string | null;
  pertandingan?: { id: string }[];
};

export interface AcaraSimple {
  id: string;
  nama: string;
}

export interface PesertaAcara {
  id: string;
  tim_id: string;
}
export interface Tim {
  id: string;
  nama: string;
  status: string;
  acara_id?: string;
  acara?: {
    nama: string;
  };
}

export interface AnggotaTim {
  id: string;
  nama_pemain: string;
  nim?: string;
  tim?: Tim;
}
export interface TimSimple {
  id: string;
  nama: string;
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
export interface Tim {
  id: string;
  nama: string;
  status: string;
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

export interface TeamQueryResult {
  tim_id: string;
  tim: {
    id: string;
    acara_id: string;
  };
}

export interface MatchCountResult {
  count: number;
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

// export interface Pertandingan {
//   id: string;
//   acara_id: string;
//   round_id: string;
//   tim_a_id: string | null;
//   tim_b_id: string | null;
//   status: string;
//   skor_tim_a: number | null;
//   skor_tim_b: number | null;
//   pemenang_id: string | null;
//   is_bye: boolean;
//   tanggal_pertandingan?: string;
//   waktu_pertandingan?: string;
//   tim_a?: { nama: string };
//   tim_b?: { nama: string };
//   acara?: { nama: string };
//   round?: { nama: string };
//   dibuat_pada: string;
// }

export interface Pertandingan {
  id: string;
  status: EnumStatusMatch;
  tanggal_pertandingan?: string;
  waktu_pertandingan?: string;
  skor_tim_a?: number;
  skor_tim_b?: number;
  tim_a?: { nama: string };
  tim_b?: { nama: string };
  acara?: { nama: string };
  round?: { nama: string };
  acara_id?: string;
  round_id?: string;
  tim_a_id?: string;
  tim_b_id?: string;
  pemenang_id?: string;
}

export type PertandinganWithRelations = {
  id: string;
  status: string;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  tim_a_id: string | null;
  tim_b_id: string | null;
  tim_a: Tim | null; // Bukan array
  tim_b: Tim | null; // Bukan array
  round_id: string | null;
  round: Round | null; // Bukan array
  acara_id: string;
  acara: Acara | null; // Bukan array
  dibuat_pada: string;
};

export type PertandinganFromSupabase = {
  id: string;
  status: string;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  tim_a_id: string | null;
  tim_b_id: string | null;
  tim_a: Tim[]; // Array dari Supabase
  tim_b: Tim[]; // Array dari Supabase
  round_id: string | null;
  round: Round[]; // Array dari Supabase
  acara_id: string;
  acara: Acara[]; // Array dari Supabase
  dibuat_pada: string;
};
export interface FormState {
  acara_id: string;
  tanggal_pertandingan: string;
  waktu_pertandingan: string;
}
export interface BracketInfo {
  totalTim: number;
  bracketSize: number;
  byeCount: number;
  matchCount: number;
  rounds: number;
  maxRound: string;
}

export interface BracketRoundData {
  round: Round;
  matches: Pertandingan[];
  isPlaceholder?: boolean;
}
export interface MatchStatusConfig {
  bg: string;
  label: string;
  text: string;
  border: string;
}
export interface StatsData {
  rounds: number;
  totalMatches: number;
  completedMatches: number;
  totalTeams: number;
}

export type SupabaseError = {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
};

export type DebugInfo = {
  totalAcara: number;
  sampleAcara: {
    id: string;
    nama: string;
    properties: string[];
  } | null;
  queryTimestamp: string;
};

export interface TeamRegistrationData {
  nama: string;
  jurusan: string;
  angkatan: string;
  nomor_hp: string;
  acara_id: string;
}

export interface TeamMemberForm {
  nama_pemain: string;
  nim: string;
}

export interface PlayerSearchResult {
  id: string;
  nama: string;
  email: string;
  nim: string;
  fakultas?: string;
  program_studi?: string;
  jenis_kelamin?: EnumJenisKelamin;
}

