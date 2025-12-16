export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      pengguna: {
        Row: {
          id: string;
          nama: string;
          email: string | null;
          avatar_url: string | null;
          id_penyedia: string | null;
          penyedia: string | null;
          peran: 'admin' | 'mahasiswa';
          nim: string | null;
          fakultas: string | null;
          program_studi: string | null;
          jenis_kelamin: 'L' | 'P' | null;
          tanggal_lahir: string | null;
          alamat: string | null;
          nomor_hp: string | null;
          is_verified: boolean;
          dibuat_pada: string | null;
        };
        Insert: {
          id?: string;
          nama: string;
          email?: string | null;
          avatar_url?: string | null;
          id_penyedia?: string | null;
          penyedia?: string | null;
          peran?: 'admin' | 'mahasiswa';
          nim?: string | null;
          fakultas?: string | null;
          program_studi?: string | null;
          jenis_kelamin?: 'L' | 'P' | null;
          tanggal_lahir?: string | null;
          alamat?: string | null;
          nomor_hp?: string | null;
          is_verified?: boolean;
          dibuat_pada?: string | null;
        };
        Update: {
          nama?: string;
          email?: string | null;
          avatar_url?: string | null;
          id_penyedia?: string | null;
          penyedia?: string | null;
          peran?: 'admin' | 'mahasiswa';
          nim?: string | null;
          fakultas?: string | null;
          program_studi?: string | null;
          jenis_kelamin?: 'L' | 'P' | null;
          tanggal_lahir?: string | null;
          alamat?: string | null;
          nomor_hp?: string | null;
          is_verified?: boolean;
          dibuat_pada?: string | null;
        };
      };

      acara: {
        Row: {
          id: string;
          nama: string;
          deskripsi: string | null;
          tipe_acara: 'sistem_gugur' | 'sistem_kompetisi' | 'sistem_campuran';
          dibuat_oleh: string | null;
          dibuat_pada: string | null;
        };
        Insert: {
          id?: string;
          nama: string;
          deskripsi?: string | null;
          tipe_acara: 'sistem_gugur' | 'sistem_kompetisi' | 'sistem_campuran';
          dibuat_oleh?: string | null;
          dibuat_pada?: string | null;
        };
        Update: {
          nama?: string;
          deskripsi?: string | null;
          tipe_acara?: 'sistem_gugur' | 'sistem_kompetisi' | 'sistem_campuran';
          dibuat_oleh?: string | null;
          dibuat_pada?: string | null;
        };
      };

      tim: {
        Row: {
          id: string;
          acara_id: string;
          nama: string;
          jurusan: string | null;
          angkatan: string | null;
          nomor_hp: string | null;
          jumlah_pemain: number;
          dibuat_pada: string | null;
        };
        Insert: {
          id?: string;
          acara_id: string;
          nama: string;
          jurusan?: string | null;
          angkatan?: string | null;
          nomor_hp?: string | null;
          jumlah_pemain?: number;
          dibuat_pada?: string | null;
        };
        Update: {
          acara_id?: string;
          nama?: string;
          jurusan?: string | null;
          angkatan?: string | null;
          nomor_hp?: string | null;
          jumlah_pemain?: number;
          dibuat_pada?: string | null;
        };
      };

      anggota_tim: {
        Row: {
          id: string;
          tim_id: string;
          nama_pemain: string;
          nim: string | null;
          dibuat_pada: string | null;
        };
        Insert: {
          id?: string;
          tim_id: string;
          nama_pemain: string;
          nim?: string | null;
          dibuat_pada?: string | null;
        };
        Update: {
          tim_id?: string;
          nama_pemain?: string;
          nim?: string | null;
          dibuat_pada?: string | null;
        };
      };

      pertandingan: {
        Row: {
          id: string;
          acara_id: string;
          tim_a_id: string | null;
          tim_b_id: string | null;
          status: 'dijadwalkan' | 'berlangsung' | 'selesai';
          skor_tim_a: number | null;
          skor_tim_b: number | null;
          tanggal_pertandingan: string | null;
          waktu_pertandingan: string | null;
          durasi_pertandingan: number | null;
          lokasi_lapangan: string | null;
          url_lokasi_maps: string | null;
          dibuat_pada: string | null;
        };
        Insert: {
          id?: string;
          acara_id: string;
          tim_a_id?: string | null;
          tim_b_id?: string | null;
          status?: 'dijadwalkan' | 'berlangsung' | 'selesai';
          skor_tim_a?: number | null;
          skor_tim_b?: number | null;
          tanggal_pertandingan?: string | null;
          waktu_pertandingan?: string | null;
          durasi_pertandingan?: number | null;
          lokasi_lapangan?: string | null;
          url_lokasi_maps?: string | null;
          dibuat_pada?: string | null;
        };
        Update: {
          acara_id?: string;
          tim_a_id?: string | null;
          tim_b_id?: string | null;
          status?: 'dijadwalkan' | 'berlangsung' | 'selesai';
          skor_tim_a?: number | null;
          skor_tim_b?: number | null;
          tanggal_pertandingan?: string | null;
          waktu_pertandingan?: string | null;
          durasi_pertandingan?: number | null;
          lokasi_lapangan?: string | null;
          url_lokasi_maps?: string | null;
          dibuat_pada?: string | null;
        };
      };
    };

    Views: {};
    Functions: {};
    Enums: {
      enum_peran: 'admin' | 'mahasiswa';
      enum_jenis_kelamin: 'L' | 'P';
      enum_status_pertandingan: 'dijadwalkan' | 'berlangsung' | 'selesai';
      enum_tipe_acara: 'sistem_gugur' | 'sistem_kompetisi' | 'sistem_campuran';
    };
    CompositeTypes: {};
  };
}
