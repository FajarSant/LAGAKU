"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Swal from "sweetalert2";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Link } from "lucide-react";

export default function TambahAcaraPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
    lokasi_lapangan: "",
    url_lokasi_maps: "",
    tanggal_mulai_pertandingan: "",
    tanggal_selesai_pertandingan: "",
    deadline_pendaftaran: "",
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.nama.trim()) {
      newErrors.nama = "Nama turnamen wajib diisi";
    }

    if (!form.tanggal_mulai_pertandingan) {
      newErrors.tanggal_mulai_pertandingan = "Tanggal mulai wajib diisi";
    }

    if (!form.tanggal_selesai_pertandingan) {
      newErrors.tanggal_selesai_pertandingan = "Tanggal selesai wajib diisi";
    }

    if (!form.deadline_pendaftaran) {
      newErrors.deadline_pendaftaran = "Deadline pendaftaran wajib diisi";
    }

    // Validasi logika tanggal
    if (form.tanggal_mulai_pertandingan && form.tanggal_selesai_pertandingan) {
      const start = new Date(form.tanggal_mulai_pertandingan);
      const end = new Date(form.tanggal_selesai_pertandingan);
      
      if (start >= end) {
        newErrors.tanggal_mulai_pertandingan = "Tanggal mulai harus sebelum tanggal selesai";
      }
    }

    if (form.deadline_pendaftaran && form.tanggal_mulai_pertandingan) {
      const deadline = new Date(form.deadline_pendaftaran);
      const start = new Date(form.tanggal_mulai_pertandingan);
      
      if (deadline > start) {
        newErrors.deadline_pendaftaran = "Deadline harus sebelum tanggal mulai";
      }
    }

    // Cek apakah deadline sudah lewat
    if (form.deadline_pendaftaran) {
      const deadline = new Date(form.deadline_pendaftaran);
      const today = new Date();
      
      if (deadline < today) {
        newErrors.deadline_pendaftaran = "Deadline tidak boleh tanggal yang sudah lewat";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi form
    if (!validateForm()) {
      // Tampilkan error alert
      const errorMessages = Object.values(errors).join('\n');
      Swal.fire({
        title: 'Periksa Form',
        text: 'Ada beberapa data yang perlu diperbaiki',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-lg'
        }
      });
      return;
    }

    // Konfirmasi sebelum submit
    const confirmResult = await Swal.fire({
      title: 'Konfirmasi',
      html: `
        <div class="text-left">
          <p class="mb-3">Apakah Anda yakin ingin membuat turnamen:</p>
          <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
            <p class="font-semibold text-lg text-blue-700 mb-2">${form.nama}</p>
            <div class="space-y-1 text-sm text-gray-600">
              <p>Deadline: ${new Date(form.deadline_pendaftaran).toLocaleDateString('id-ID')}</p>
              <p>Mulai: ${new Date(form.tanggal_mulai_pertandingan).toLocaleDateString('id-ID')}</p>
              <p>Selesai: ${new Date(form.tanggal_selesai_pertandingan).toLocaleDateString('id-ID')}</p>
            </div>
          </div>
          <p class="text-sm text-gray-500">Turnamen akan segera dibuat dan siap untuk didaftarkan.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Buat Turnamen',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-lg',
        confirmButton: 'px-5 py-2 rounded',
        cancelButton: 'px-5 py-2 rounded'
      }
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    setLoading(true);

    // Tampilkan loading alert
    Swal.fire({
      title: 'Menyimpan...',
      html: 'Sedang menyimpan data turnamen',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: 'rounded-lg'
      }
    });

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Konversi tanggal ke format ISO
      const tanggalMulai = new Date(form.tanggal_mulai_pertandingan).toISOString();
      const tanggalSelesai = new Date(form.tanggal_selesai_pertandingan).toISOString();
      const deadline = new Date(form.deadline_pendaftaran).toISOString();

      const { error } = await supabase.from("acara").insert({
        nama: form.nama.trim(),
        deskripsi: form.deskripsi.trim() || null,
        lokasi_lapangan: form.lokasi_lapangan.trim() || null,
        url_lokasi_maps: form.url_lokasi_maps.trim() || null,
        tanggal_mulai_pertandingan: tanggalMulai,
        tanggal_selesai_pertandingan: tanggalSelesai,
        deadline_pendaftaran: deadline,
        dibuat_oleh: user?.id ?? null,
      });

      if (error) {
        console.error("Gagal menambah acara:", error);
        
        let errorMessage = "Terjadi kesalahan saat menyimpan turnamen";
        if (error.code === "23505") {
          errorMessage = "Nama turnamen sudah digunakan. Silakan gunakan nama lain.";
        }
        
        // Tutup loading dan tampilkan error
        Swal.close();
        
        Swal.fire({
          title: 'Gagal',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#ef4444',
          customClass: {
            popup: 'rounded-lg'
          }
        });
        
        setErrors({ ...errors, general: errorMessage });
        setLoading(false);
        return;
      }

      // Tutup loading alert
      Swal.close();
      
      // Tampilkan success alert dengan pilihan
      Swal.fire({
        title: 'Berhasil!',
        html: `
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Turnamen Berhasil Dibuat</h3>
            <p class="text-gray-600 mb-4">"${form.nama}" telah berhasil dibuat</p>
          </div>
        `,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Lihat Daftar Turnamen',
        cancelButtonText: 'Buat Lagi',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        reverseButtons: true,
        customClass: {
          popup: 'rounded-lg',
          confirmButton: 'px-5 py-2 rounded',
          cancelButton: 'px-5 py-2 rounded'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/acara");
          router.refresh();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Reset form untuk membuat turnamen baru
          setForm({
            nama: "",
            deskripsi: "",
            lokasi_lapangan: "",
            url_lokasi_maps: "",
            tanggal_mulai_pertandingan: "",
            tanggal_selesai_pertandingan: "",
            deadline_pendaftaran: "",
          });
          setErrors({});
          
          // Focus ke input nama
          setTimeout(() => {
            const namaInput = document.querySelector('input[name="nama"]') as HTMLInputElement;
            if (namaInput) namaInput.focus();
          }, 100);
        }
      });

    } catch (error) {
      console.error("Error:", error);
      
      // Tutup loading dan tampilkan error
      Swal.close();
      
      Swal.fire({
        title: 'Terjadi Kesalahan',
        text: 'Terjadi kesalahan tidak terduga. Silakan coba lagi.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-lg'
        }
      });
      
      setErrors({ ...errors, general: "Terjadi kesalahan tidak terduga" });
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 flex justify-center">
      <Card className="w-full max-w-4xl shadow border">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-center font-bold">
            Tambah Turnamen Gugur
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            {/* NAMA */}
            <div className="space-y-2">
              <Label>Nama Turnamen *</Label>
              <Input
                placeholder="Contoh: Futsal Cup 2025"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                required
                className={errors.nama ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.nama && (
                <p className="text-red-500 text-sm">{errors.nama}</p>
              )}
            </div>

            {/* DESKRIPSI */}
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                placeholder="Deskripsi singkat turnamen..."
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                className="min-h-[120px]"
                disabled={loading}
              />
            </div>

            {/* LOKASI - 2 KOLOM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* LOKASI LAPANGAN */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Lokasi Lapangan
                </Label>
                <Input
                  placeholder="Contoh: Lapangan Utama Kampus"
                  value={form.lokasi_lapangan}
                  onChange={(e) => setForm({ ...form, lokasi_lapangan: e.target.value })}
                  disabled={loading}
                />
              </div>

              {/* URL LOKASI MAPS */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  URL Google Maps (Opsional)
                </Label>
                <Input
                  placeholder="https://maps.google.com/..."
                  type="url"
                  value={form.url_lokasi_maps}
                  onChange={(e) => setForm({ ...form, url_lokasi_maps: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            {/* TANGGAL-TANGGAL - 3 KOLOM DI DESKTOP, 1 KOLOM DI MOBILE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* DEADLINE PENDAFTARAN */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Deadline Pendaftaran *
                </Label>
                <Input
                  type="datetime-local"
                  value={form.deadline_pendaftaran}
                  onChange={(e) => setForm({ ...form, deadline_pendaftaran: e.target.value })}
                  required
                  className={errors.deadline_pendaftaran ? "border-red-500" : ""}
                  min={new Date().toISOString().slice(0, 16)}
                  disabled={loading}
                />
                {errors.deadline_pendaftaran && (
                  <p className="text-red-500 text-sm">{errors.deadline_pendaftaran}</p>
                )}
              </div>

              {/* TANGGAL MULAI PERTANDINGAN */}
              <div className="space-y-2">
                <Label>Tanggal Mulai Pertandingan *</Label>
                <Input
                  type="datetime-local"
                  value={form.tanggal_mulai_pertandingan}
                  onChange={(e) => setForm({ ...form, tanggal_mulai_pertandingan: e.target.value })}
                  required
                  className={errors.tanggal_mulai_pertandingan ? "border-red-500" : ""}
                  min={form.deadline_pendaftaran || new Date().toISOString().slice(0, 16)}
                  disabled={loading}
                />
                {errors.tanggal_mulai_pertandingan && (
                  <p className="text-red-500 text-sm">{errors.tanggal_mulai_pertandingan}</p>
                )}
              </div>

              {/* TANGGAL SELESAI PERTANDINGAN */}
              <div className="space-y-2">
                <Label>Tanggal Selesai Pertandingan *</Label>
                <Input
                  type="datetime-local"
                  value={form.tanggal_selesai_pertandingan}
                  onChange={(e) => setForm({ ...form, tanggal_selesai_pertandingan: e.target.value })}
                  required
                  className={errors.tanggal_selesai_pertandingan ? "border-red-500" : ""}
                  min={form.tanggal_mulai_pertandingan || new Date().toISOString().slice(0, 16)}
                  disabled={loading}
                />
                {errors.tanggal_selesai_pertandingan && (
                  <p className="text-red-500 text-sm">{errors.tanggal_selesai_pertandingan}</p>
                )}
              </div>
            </div>

            {/* ACTION - 2 KOLOM DI DESKTOP, 1 KOLOM DI MOBILE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-11"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Menyimpan...
                  </div>
                ) : (
                  "Simpan Turnamen"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/acara")}
                className="w-full h-11"
                disabled={loading}
              >
                Batal
              </Button>
            </div>

            {/* CATATAN */}
            <div className="text-center text-sm text-gray-500 pt-2">
              <p>* Field wajib diisi</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}