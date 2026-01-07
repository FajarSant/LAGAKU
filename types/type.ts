// =======================================================
// ENUM TYPES
// =======================================================
export type EnumJenisKelamin = "L" | "P";
export type EnumStatusMatch = "dijadwalkan" | "berlangsung" | "selesai";
export type EnumStatusTim = "aktif" | "gugur";
export type EnumPeran = "admin" | "mahasiswa";

// =======================================================
// USER RELATED TYPES
// =======================================================
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

export interface PlayerSearchResult {
  id: string;
  nama: string;
  email: string;
  nim: string;
  fakultas?: string;
  program_studi?: string;
  jenis_kelamin?: EnumJenisKelamin;
}

// =======================================================
// TOURNAMENT (ACARA) TYPES
// =======================================================
export interface Acara {
  id: string;
  nama: string;
  deskripsi?: string | null;
  dibuat_pada: string;
  tanggal_mulai?: string | null;
  tanggal_selesai?: string | null;
}

export interface AcaraSimple {
  id: string;
  nama: string;
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

// =======================================================
// TEAM (TIM) TYPES
// =======================================================
export interface Tim {
  id: string;
  nama: string;
  status: string;
  acara_id?: string;
  acara?: {
    nama: string;
  };
}

export interface TimSimple {
  id: string;
  nama: string;
}

export interface TeamRegistrationData {
  nama: string;
  jurusan: string;
  angkatan: string;
  nomor_hp: string;
  acara_id: string;
}

export interface PesertaAcara {
  id: string;
  tim_id: string;
}

export interface PesertaTimRow {
  peserta_id: string;
  tim: Tim;
}

export interface TeamQueryResult {
  tim_id: string;
  tim: {
    id: string;
    acara_id: string;
  };
}

// =======================================================
// TEAM MEMBER (ANGGOTA TIM) TYPES
// =======================================================
export interface AnggotaTim {
  id: string;
  nama_pemain: string;
  nim?: string;
  tim?: Tim;
}

export interface TeamMemberForm {
  nama_pemain: string;
  nim: string;
}

// =======================================================
// ROUND TYPES
// =======================================================
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

// =======================================================
// MATCH (PERTANDINGAN) TYPES
// =======================================================
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
  lokasi_lapangan?: string;
  url_lokasi_maps?: string;
  durasi_pertandingan?: number;
  dibuat_pada: string;
}

export type PertandinganWithRelations = {
  id: string;
  status: string;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  tim_a_id: string | null;
  tim_b_id: string | null;
  tim_a: Tim | null;
  tim_b: Tim | null;
  round_id: string | null;
  round: Round | null;
  acara_id: string;
  acara: Acara | null;
  dibuat_pada: string;
};

export type PertandinganFromSupabase = {
  id: string;
  status: string;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  tim_a_id: string | null;
  tim_b_id: string | null;
  tim_a: Tim[];
  tim_b: Tim[];
  round_id: string | null;
  round: Round[];
  acara_id: string;
  acara: Acara[];
  dibuat_pada: string;
};

export interface SupabasePertandingan {
  id: string;
  status: EnumStatusMatch;
  tanggal_pertandingan: string | null;
  waktu_pertandingan: string | null;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  tim_a_id: string | null;
  tim_b_id: string | null;
  pemenang_id: string | null;
  acara_id: string;
  round_id: string;
  lokasi_lapangan: string | null;
  url_lokasi_maps: string | null;
  durasi_pertandingan: number | null;
  dibuat_pada: string;
  tim_a: Tim | null;
  tim_b: Tim | null;
  acara: { nama: string } | null;
  round: { nama: string; urutan: number } | null;
}

// =======================================================
// MATCH RELATION TYPES
// =======================================================
export type Match = {
  id: string;
  status: string;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  tim_a: { nama: string } | null;
  tim_b: { nama: string } | null;
  round: { nama: string; urutan: number };
};

// =======================================================
// SCHEDULE (JADWAL) TYPES
// =======================================================
export interface JadwalFilter {
  searchQuery: string;
  dateFilter: string;
  statusFilter: EnumStatusMatch | "semua";
  acaraFilter: string;
}

export interface ScheduleStats {
  totalJadwal: number;
  berlangsung: number;
  dijadwalkan: number;
  selesai: number;
}

// =======================================================
// BRACKET TYPES
// =======================================================
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

// =======================================================
// FORM STATE TYPES
// =======================================================
export interface FormState {
  acara_id: string;
  tanggal_pertandingan: string;
  waktu_pertandingan: string;
}

// =======================================================
// STATISTICS TYPES
// =======================================================
export interface StatsData {
  rounds: number;
  totalMatches: number;
  completedMatches: number;
  totalTeams: number;
}

export interface MatchCountResult {
  count: number;
}

// =======================================================
// UI CONFIGURATION TYPES
// =======================================================
export interface MatchStatusConfig {
  bg: string;
  label: string;
  text: string;
  border: string;
}

// =======================================================
// ERROR AND DEBUG TYPES
// =======================================================
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

// =======================================================
// SUPABASE SPECIFIC TYPES
// =======================================================
export interface SupabaseScheduleResult {
  id: string;
  status: EnumStatusMatch;
  tanggal_pertandingan?: string;
  waktu_pertandingan?: string;
  skor_tim_a?: number;
  skor_tim_b?: number;
  tim_a?: { nama: string; status: string }[];
  tim_b?: { nama: string; status: string }[];
  acara?: { nama: string }[];
  round?: { nama: string; urutan: number }[];
  acara_id?: string;
  round_id?: string;
  tim_a_id?: string;
  tim_b_id?: string;
  pemenang_id?: string;
  lokasi_lapangan?: string;
  url_lokasi_maps?: string;
  durasi_pertandingan?: number;
  dibuat_pada: string;
}
