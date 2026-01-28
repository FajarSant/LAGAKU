"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Swal from "sweetalert2";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Link, Loader2 } from "lucide-react";

interface AcaraForm {
  nama: string;
  deskripsi: string;
  lokasi_lapangan: string;
  url_lokasi_maps: string;
  tanggal_mulai_pertandingan: string;
  tanggal_selesai_pertandingan: string;
  deadline_pendaftaran: string;
}

export default function EditAcaraPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const acaraId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<AcaraForm>({
    nama: "",
    deskripsi: "",
    lokasi_lapangan: "",
    url_lokasi_maps: "",
    tanggal_mulai_pertandingan: "",
    tanggal_selesai_pertandingan: "",
    deadline_pendaftaran: "",
  });

  useEffect(() => {
    if (acaraId) {
      fetchAcaraData();
    }
  }, [acaraId]);

  const fetchAcaraData = async () => {
    try {
      setLoadingData(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Cek struktur tabel terlebih dahulu
      const { data: tableInfo, error: tableError } = await supabase
        .from("acara")
        .select("count")
        .limit(1);

      console.log("Table info:", tableInfo);

      const { data: acara, error } = await supabase
        .from("acara")
        .select("*")
        .eq("id", acaraId)
        .eq("dibuat_oleh", user.id)
        .single();

      if (error) {
        console.error("Gagal mengambil data acara:", error);
        
        Swal.fire({
          title: "Error",
          text: "Gagal memuat data turnamen atau Anda tidak memiliki akses",
          icon: "error",
          confirmButtonText: "Kembali",
          confirmButtonColor: "#3b82f6",
          customClass: {
            popup: "rounded-lg",
          },
        }).then(() => {
          router.push("/acara");
        });
        return;
      }

      if (!acara) {
        Swal.fire({
          title: "Tidak Ditemukan",
          text: "Turnamen tidak ditemukan",
          icon: "warning",
          confirmButtonText: "Kembali",
          confirmButtonColor: "#3b82f6",
          customClass: {
            popup: "rounded-lg",
          },
        }).then(() => {
          router.push("/acara");
        });
        return;
      }

      // Debug: lihat struktur data yang diterima
      console.log("Data acara yang diterima:", acara);
      console.log("Kolom yang ada:", Object.keys(acara));

      // Format tanggal untuk input datetime-local
      const formatDateTimeLocal = (dateString: string) => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16);
        } catch (e) {
          console.error("Error parsing date:", dateString, e);
          return "";
        }
      };

      setForm({
        nama: acara.nama || "",
        deskripsi: acara.deskripsi || "",
        lokasi_lapangan: acara.lokasi_lapangan || "",
        url_lokasi_maps: acara.url_lokasi_maps || "",
        tanggal_mulai_pertandingan: formatDateTimeLocal(
          acara.tanggal_mulai_pertandingan
        ),
        tanggal_selesai_pertandingan: formatDateTimeLocal(
          acara.tanggal_selesai_pertandingan
        ),
        deadline_pendaftaran: formatDateTimeLocal(acara.deadline_pendaftaran),
      });
    } catch (error) {
      console.error("Error saat fetch data:", error);
      Swal.fire({
        title: "Terjadi Kesalahan",
        text: "Gagal memuat data turnamen",
        icon: "error",
        confirmButtonText: "Kembali",
        confirmButtonColor: "#ef4444",
        customClass: {
          popup: "rounded-lg",
        },
      }).then(() => {
        router.push("/acara");
      });
    } finally {
      setLoadingData(false);
    }
  };

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
        newErrors.tanggal_mulai_pertandingan =
          "Tanggal mulai harus sebelum tanggal selesai";
      }
    }

    if (form.deadline_pendaftaran && form.tanggal_mulai_pertandingan) {
      const deadline = new Date(form.deadline_pendaftaran);
      const start = new Date(form.tanggal_mulai_pertandingan);

      if (deadline > start) {
        newErrors.deadline_pendaftaran = "Deadline harus sebelum tanggal mulai";
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
      Swal.fire({
        title: "Periksa Form",
        html: `
          <div class="text-left">
            <p class="mb-2">Silakan perbaiki error berikut:</p>
            <div class="bg-red-50 border border-red-100 rounded-lg p-3">
              <ul class="list-disc list-inside space-y-1 text-sm text-red-700">
                ${Object.values(errors)
                  .map((error) => `<li>${error}</li>`)
                  .join("")}
              </ul>
            </div>
          </div>
        `,
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
        customClass: {
          popup: "rounded-lg",
        },
      });
      return;
    }

    // Konfirmasi sebelum update
    const confirmResult = await Swal.fire({
      title: "Konfirmasi Perubahan",
      html: `
        <div class="text-left">
          <p class="mb-3">Apakah Anda yakin ingin mengupdate turnamen:</p>
          <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
            <p class="font-semibold text-lg text-blue-700 mb-2">${form.nama}</p>
            <div class="space-y-1 text-sm text-gray-600">
              <p>Deadline: ${new Date(
                form.deadline_pendaftaran
              ).toLocaleDateString("id-ID")}</p>
              <p>Mulai: ${new Date(
                form.tanggal_mulai_pertandingan
              ).toLocaleDateString("id-ID")}</p>
              <p>Selesai: ${new Date(
                form.tanggal_selesai_pertandingan
              ).toLocaleDateString("id-ID")}</p>
            </div>
          </div>
          <p class="text-sm text-gray-500">Perubahan akan disimpan secara permanen.</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Update Turnamen",
      cancelButtonText: "Batal",
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
      customClass: {
        popup: "rounded-lg",
        confirmButton: "px-5 py-2 rounded",
        cancelButton: "px-5 py-2 rounded",
      },
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    setLoading(true);

    // Tampilkan loading alert
    Swal.fire({
      title: "Menyimpan...",
      html: "Sedang menyimpan perubahan turnamen",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: "rounded-lg",
      },
    });

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User tidak ditemukan");
      }

      // Konversi tanggal ke format ISO
      const tanggalMulai = new Date(
        form.tanggal_mulai_pertandingan
      ).toISOString();
      const tanggalSelesai = new Date(
        form.tanggal_selesai_pertandingan
      ).toISOString();
      const deadline = new Date(form.deadline_pendaftaran).toISOString();

      // Buat data update tanpa kolom updated_at
      const updateData = {
        nama: form.nama.trim(),
        deskripsi: form.deskripsi.trim() || null,
        lokasi_lapangan: form.lokasi_lapangan.trim() || null,
        url_lokasi_maps: form.url_lokasi_maps.trim() || null,
        tanggal_mulai_pertandingan: tanggalMulai,
        tanggal_selesai_pertandingan: tanggalSelesai,
        deadline_pendaftaran: deadline,
        // Hapus atau komentari updated_at jika tidak ada di tabel
        // updated_at: new Date().toISOString(),
      };

      console.log("Data yang akan diupdate:", updateData);

      const { data, error } = await supabase
        .from("acara")
        .update(updateData)
        .eq("id", acaraId)
        .eq("dibuat_oleh", user.id)
        .select(); // Tambahkan .select() untuk mendapatkan response

      console.log("Response dari update:", { data, error });

      if (error) {
        console.error("Gagal mengupdate acara. Error detail:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          errorObject: JSON.stringify(error, null, 2)
        });

        let errorMessage = "Terjadi kesalahan saat mengupdate turnamen";
        
        if (error.code === "23505") {
          errorMessage =
            "Nama turnamen sudah digunakan oleh turnamen lain. Silakan gunakan nama lain.";
        } else if (error.code === "42501") {
          errorMessage =
            "Anda tidak memiliki izin untuk mengedit turnamen ini.";
        } else if (error.message) {
          errorMessage = error.message;
        }

        // Tutup loading dan tampilkan error
        Swal.close();

        Swal.fire({
          title: "Gagal Mengupdate",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#ef4444",
          customClass: {
            popup: "rounded-lg",
          },
        });

        setErrors({ ...errors, general: errorMessage });
        setLoading(false);
        return;
      }

      // Cek jika data tidak terupdate
      if (!data || data.length === 0) {
        console.warn("Tidak ada data yang diupdate, tapi tidak ada error");
        // Tetap lanjutkan karena mungkin data sama dengan sebelumnya
      }

      // Tutup loading alert
      Swal.close();

      // Tampilkan success alert
      Swal.fire({
        title: "Berhasil!",
        html: `
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Turnamen Berhasil Diupdate</h3>
            <p class="text-gray-600 mb-4">"${form.nama}" telah berhasil diperbarui</p>
          </div>
        `,
        icon: "success",
        confirmButtonText: "Kembali ke Daftar Turnamen",
        confirmButtonColor: "#3b82f6",
        customClass: {
          popup: "rounded-lg",
          confirmButton: "px-5 py-2 rounded",
        },
      }).then(() => {
        router.push("/admin/acara");
        router.refresh();
      });
    } catch (error: any) {
      console.error("Error catch block:", error);

      // Tutup loading dan tampilkan error
      Swal.close();

      let errorMessage = "Terjadi kesalahan tidak terduga. Silakan coba lagi.";
      
      if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        title: "Terjadi Kesalahan",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
        customClass: {
          popup: "rounded-lg",
        },
      });

      setErrors({ ...errors, general: errorMessage });
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="p-4 md:p-6 flex justify-center items-center min-h-[400px]">
        <Card className="w-full max-w-4xl shadow border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-lg font-medium text-gray-700">
              Memuat data turnamen...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Silakan tunggu sebentar
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 flex justify-center">
      <Card className="w-full max-w-4xl shadow border">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-center font-bold">
            Edit Turnamen Gugur
          </CardTitle>
          <p className="text-center text-sm text-gray-500 mt-2">
            ID: {acaraId}
          </p>
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
                onChange={(e) =>
                  setForm({ ...form, deskripsi: e.target.value })
                }
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
                  onChange={(e) =>
                    setForm({ ...form, lokasi_lapangan: e.target.value })
                  }
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
                  onChange={(e) =>
                    setForm({ ...form, url_lokasi_maps: e.target.value })
                  }
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
                  onChange={(e) =>
                    setForm({ ...form, deadline_pendaftaran: e.target.value })
                  }
                  required
                  className={
                    errors.deadline_pendaftaran ? "border-red-500" : ""
                  }
                  disabled={loading}
                />
                {errors.deadline_pendaftaran && (
                  <p className="text-red-500 text-sm">
                    {errors.deadline_pendaftaran}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  NB: Deadline di masa lalu diperbolehkan untuk turnamen yang sudah berjalan
                </p>
              </div>

              {/* TANGGAL MULAI PERTANDINGAN */}
              <div className="space-y-2">
                <Label>Tanggal Mulai Pertandingan *</Label>
                <Input
                  type="datetime-local"
                  value={form.tanggal_mulai_pertandingan}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tanggal_mulai_pertandingan: e.target.value,
                    })
                  }
                  required
                  className={
                    errors.tanggal_mulai_pertandingan ? "border-red-500" : ""
                  }
                  disabled={loading}
                />
                {errors.tanggal_mulai_pertandingan && (
                  <p className="text-red-500 text-sm">
                    {errors.tanggal_mulai_pertandingan}
                  </p>
                )}
              </div>

              {/* TANGGAL SELESAI PERTANDINGAN */}
              <div className="space-y-2">
                <Label>Tanggal Selesai Pertandingan *</Label>
                <Input
                  type="datetime-local"
                  value={form.tanggal_selesai_pertandingan}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tanggal_selesai_pertandingan: e.target.value,
                    })
                  }
                  required
                  className={
                    errors.tanggal_selesai_pertandingan ? "border-red-500" : ""
                  }
                  min={form.tanggal_mulai_pertandingan}
                  disabled={loading}
                />
                {errors.tanggal_selesai_pertandingan && (
                  <p className="text-red-500 text-sm">
                    {errors.tanggal_selesai_pertandingan}
                  </p>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
              <Button type="submit" disabled={loading} className="w-full h-11">
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Menyimpan...
                  </div>
                ) : (
                  "Update Turnamen"
                )}
              </Button>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/acara")}
                  className="w-full h-11"
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push(`/acara/${acaraId}`)}
                  className="w-full h-11"
                  disabled={loading}
                >
                  Lihat Detail
                </Button>
              </div>
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