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
import { Loader2, Shield } from "lucide-react";

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

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [initialForm, setInitialForm] = useState<AcaraForm | null>(null);

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
      checkAdminAccess();
    }
  }, [acaraId]);

  const checkAdminAccess = async (): Promise<void> => {
    try {
      setLoadingData(true);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        await Swal.fire({
          title: "Login Diperlukan",
          text: "Silakan login terlebih dahulu",
          icon: "warning",
          confirmButtonText: "Login",
        });
        router.push("/login");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("pengguna")
        .select("id, email, peran")
        .eq("email", session.user.email)
        .maybeSingle();

      if (userError || !userData) {
        const { error: insertError } = await supabase
          .from("pengguna")
          .insert([
            { 
              id: session.user.id,
              email: session.user.email,
              nama: session.user.user_metadata?.full_name || session.user.email,
              peran: "mahasiswa"
            }
          ]);

        if (insertError) {
          await Swal.fire({
            title: "Error",
            text: "Gagal memverifikasi akses user",
            icon: "error",
          });
          router.push("/acara");
          return;
        }

        const isUserAdmin = session.user.email === "admin@example.com";
        setIsAdmin(isUserAdmin);

        if (!isUserAdmin) {
          await Swal.fire({
            title: "Akses Ditolak",
            text: "Hanya admin yang dapat mengedit turnamen",
            icon: "error",
          });
          router.push("/acara");
          return;
        }
      } else {
        const isUserAdmin = userData.peran === "admin";
        setIsAdmin(isUserAdmin);

        if (!isUserAdmin) {
          await Swal.fire({
            title: "Akses Ditolak",
            text: "Hanya admin yang dapat mengedit turnamen",
            icon: "error",
          });
          router.push("/acara");
          return;
        }
      }

      const { data: acara, error: acaraError } = await supabase
        .from("acara")
        .select("*")
        .eq("id", acaraId)
        .maybeSingle();

      if (acaraError || !acara) {
        await Swal.fire({
          title: "Tidak Ditemukan",
          text: "Turnamen tidak ditemukan",
          icon: "error",
        });
        router.push("/acara");
        return;
      }

      const formatDateTimeLocal = (dateString: string | null): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return date.toISOString().slice(0, 16);
      };

      const formattedForm: AcaraForm = {
        nama: acara.nama || "",
        deskripsi: acara.deskripsi || "",
        lokasi_lapangan: acara.lokasi_lapangan || "",
        url_lokasi_maps: acara.url_lokasi_maps || "",
        tanggal_mulai_pertandingan: formatDateTimeLocal(acara.tanggal_mulai_pertandingan),
        tanggal_selesai_pertandingan: formatDateTimeLocal(acara.tanggal_selesai_pertandingan),
        deadline_pendaftaran: formatDateTimeLocal(acara.deadline_pendaftaran),
      };

      setForm(formattedForm);
      setInitialForm(formattedForm);

    } catch (error) {
      console.error("Error:", error);
      await Swal.fire({
        title: "Error",
        text: "Gagal memuat data turnamen",
        icon: "error",
      });
      router.push("/acara");
    } finally {
      setLoadingData(false);
    }
  };

  const hasChanges = (): boolean => {
    if (!initialForm) return false;
    
    return (
      form.nama !== initialForm.nama ||
      form.deskripsi !== initialForm.deskripsi ||
      form.lokasi_lapangan !== initialForm.lokasi_lapangan ||
      form.url_lokasi_maps !== initialForm.url_lokasi_maps ||
      form.tanggal_mulai_pertandingan !== initialForm.tanggal_mulai_pertandingan ||
      form.tanggal_selesai_pertandingan !== initialForm.tanggal_selesai_pertandingan ||
      form.deadline_pendaftaran !== initialForm.deadline_pendaftaran
    );
  };

  // Konfirmasi ketika batal
  const handleCancel = async (): Promise<void> => {
    if (loading) return;

    // Cek apakah ada perubahan
    if (hasChanges()) {
      const result = await Swal.fire({
        title: "Perubahan Belum Disimpan",
        text: "Apakah Anda yakin ingin membatalkan? Semua perubahan yang telah Anda buat akan hilang.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Batalkan",
        cancelButtonText: "Lanjutkan Edit",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        router.push("/admin/acara");
      }
    } else {
      // Jika tidak ada perubahan, konfirmasi sederhana
      const result = await Swal.fire({
        title: "Keluar?",
        text: "Apakah Anda yakin ingin keluar dari halaman ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Keluar",
        cancelButtonText: "Tetap di Sini",
      });

      if (result.isConfirmed) {
        router.push("/admin/acara");
      }
    }
  };

  const validateForm = (): boolean => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      await Swal.fire({
        title: "Validasi Gagal",
        text: "Silakan lengkapi form yang diperlukan",
        icon: "warning",
      });
      return;
    }

    // Konfirmasi sebelum menyimpan
    const confirmResult = await Swal.fire({
      title: "Simpan Perubahan?",
      text: "Apakah Anda yakin dengan perubahan yang telah dibuat?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Simpan",
      cancelButtonText: "Batal",
    });

    if (!confirmResult.isConfirmed) return;

    setLoading(true);

    try {
      const updateData = {
        nama: form.nama.trim(),
        deskripsi: form.deskripsi.trim() || null,
        lokasi_lapangan: form.lokasi_lapangan.trim() || null,
        url_lokasi_maps: form.url_lokasi_maps.trim() || null,
        tanggal_mulai_pertandingan: new Date(form.tanggal_mulai_pertandingan).toISOString(),
        tanggal_selesai_pertandingan: new Date(form.tanggal_selesai_pertandingan).toISOString(),
        deadline_pendaftaran: new Date(form.deadline_pendaftaran).toISOString(),
      };

      const { error } = await supabase
        .from("acara")
        .update(updateData)
        .eq("id", acaraId);

      if (error) throw error;

      await Swal.fire({
        title: "Berhasil!",
        text: "Turnamen berhasil diperbarui",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/admin/acara");
      router.refresh();

    } catch (error) {
      console.error("Error:", error);
      await Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menyimpan perubahan",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="p-4 md:p-6 flex justify-center items-center min-h-[400px]">
        <Card className="w-full max-w-4xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-lg font-medium">Memuat data turnamen...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-4 md:p-6 flex justify-center items-center min-h-[400px]">
        <Card className="w-full max-w-4xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Akses Ditolak</h3>
            <p className="text-gray-600 text-center">
              Halaman ini hanya dapat diakses oleh administrator.
            </p>
            <Button onClick={() => router.push("/acara")} className="mt-6">
              Kembali ke Daftar Acara
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 flex justify-center">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl md:text-2xl font-bold">
              Edit Turnamen
            </CardTitle>
            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin Mode
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Turnamen *</Label>
              <Input
                id="nama"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                required
                disabled={loading}
                className={errors.nama ? "border-red-500" : ""}
              />
              {errors.nama && (
                <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                rows={4}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lokasi_lapangan">Lokasi Lapangan</Label>
                <Input
                  id="lokasi_lapangan"
                  value={form.lokasi_lapangan}
                  onChange={(e) => setForm({ ...form, lokasi_lapangan: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url_lokasi_maps">URL Google Maps</Label>
                <Input
                  id="url_lokasi_maps"
                  value={form.url_lokasi_maps}
                  onChange={(e) => setForm({ ...form, url_lokasi_maps: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline_pendaftaran">Deadline Pendaftaran *</Label>
                <Input
                  id="deadline_pendaftaran"
                  type="datetime-local"
                  value={form.deadline_pendaftaran}
                  onChange={(e) => setForm({ ...form, deadline_pendaftaran: e.target.value })}
                  required
                  disabled={loading}
                  className={errors.deadline_pendaftaran ? "border-red-500" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggal_mulai">Tanggal Mulai *</Label>
                <Input
                  id="tanggal_mulai"
                  type="datetime-local"
                  value={form.tanggal_mulai_pertandingan}
                  onChange={(e) => setForm({ ...form, tanggal_mulai_pertandingan: e.target.value })}
                  required
                  disabled={loading}
                  className={errors.tanggal_mulai_pertandingan ? "border-red-500" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggal_selesai">Tanggal Selesai *</Label>
                <Input
                  id="tanggal_selesai"
                  type="datetime-local"
                  value={form.tanggal_selesai_pertandingan}
                  onChange={(e) => setForm({ ...form, tanggal_selesai_pertandingan: e.target.value })}
                  required
                  disabled={loading}
                  className={errors.tanggal_selesai_pertandingan ? "border-red-500" : ""}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel} 
                className="flex-1"
                disabled={loading}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}