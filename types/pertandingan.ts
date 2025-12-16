export interface Acara {
  id: string;
  nama: string;
  deskripsi?: string | null;
  tipe_acara: "sistem_gugur" | "sistem_kompetisi" | "sistem_campuran";
  dibuat_oleh?: string | null;
  dibuat_pada?: string;
}

export interface AnggotaTim {
  id: string;
  tim_id: string;
  nama_pemain: string;
  nim?: string | null;
  dibuat_pada?: string;
}

export interface Tim {
  id: string;
  nama: string;
  jurusan?: string | null;
  angkatan?: string | null;
  nomor_hp?: string | null;
  jumlah_pemain?: number;
  dibuat_pada?: string;
  anggota?: AnggotaTim[];
}

export interface Pertandingan {
  id: string;
  acara_id: string;

  tim_a_id: string | null;
  tim_b_id: string | null;

  status: "dijadwalkan" | "berlangsung" | "selesai";

  skor_tim_a: number | null;
  skor_tim_b: number | null;

  tanggal_pertandingan: string | null; // <-- ADD THIS
  waktu_pertandingan: string | null;   // <-- ADD THIS

  durasi_pertandingan: number | null;
  lokasi_lapangan: string | null;
  url_lokasi_maps: string | null;

  dibuat_pada: string;
}
