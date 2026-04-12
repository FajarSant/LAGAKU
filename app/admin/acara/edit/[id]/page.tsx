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
import { Calendar, MapPin, Link, Loader2, Shield } from "lucide-react";

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
  const [isAdmin, setIsAdmin] = useState(false);

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

  const checkAdminAccess = async () => {
    try {
      setLoadingData(true);

      // 1. Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        Swal.fire({
          title: "Login Diperlukan",
          text: "Silakan login terlebih dahulu",
          icon: "warning",
          confirmButtonText: "Login",
        }).then(() => router.push("/login"));
        return;
      }

      console.log("User email:", session.user.email);

      // 2. Cek user di tabel "pengguna" (bukan "users")
      const { data: userData, error: userError } = await supabase
        .from("pengguna")  // ✅ Perbaiki: "pengguna" bukan "users"
        .select("id, email, peran")  // ✅ Perbaiki: "peran" bukan "role"
        .eq("email", session.user.email)
        .maybeSingle();

      console.log("User data:", userData);
      console.log("User error:", userError);

      // 3. Jika user tidak ditemukan, buat record baru
      if (userError || !userData) {
        console.log("User not found in pengguna table, creating...");
        
        // Insert user ke tabel pengguna
        const { data: newUser, error: insertError } = await supabase
          .from("pengguna")
          .insert([
            { 
              id: session.user.id,
              email: session.user.email,
              nama: session.user.user_metadata?.full_name || session.user.email,
              peran: "mahasiswa" // Default role
            }
          ])
          .select()
          .single();

        if (insertError) {
          console.error("Failed to create user:", insertError);
          Swal.fire({
            title: "Error",
            text: "Gagal memverifikasi akses user",
            icon: "error",
          }).then(() => router.push("/acara"));
          return;
        }

        // Cek apakah admin berdasarkan email (atau bisa dari metadata)
        const isUserAdmin = session.user.email === "admin@example.com"; // Ganti dengan email admin
        setIsAdmin(isUserAdmin);

        if (!isUserAdmin) {
          Swal.fire({
            title: "Akses Ditolak",
            text: "Hanya admin yang dapat mengedit turnamen",
            icon: "error",
          }).then(() => router.push("/acara"));
          return;
        }
      } else {
        // User exists, cek peran (role)
        const isUserAdmin = userData.peran === "admin"; // ✅ Perbaiki: "peran" bukan "role"
        setIsAdmin(isUserAdmin);

        if (!isUserAdmin) {
          Swal.fire({
            title: "Akses Ditolak",
            text: "Hanya admin yang dapat mengedit turnamen",
            icon: "error",
          }).then(() => router.push("/acara"));
          return;
        }
      }

      // 4. Fetch acara data - TANPA filter dibuat_oleh
      console.log("Fetching acara with ID:", acaraId);
      
      const { data: acara, error: acaraError } = await supabase
        .from("acara")
        .select("*")
        .eq("id", acaraId)
        .maybeSingle();

      console.log("Acara data:", acara);
      console.log("Acara error:", acaraError);

      if (acaraError) {
        console.error("Error detail:", acaraError);
        
        if (acaraError.code === "PGRST116") {
          Swal.fire({
            title: "Tidak Ditemukan",
            text: "Turnamen tidak ditemukan",
            icon: "error",
          }).then(() => router.push("/acara"));
          return;
        }
        
        throw acaraError;
      }

      if (!acara) {
        Swal.fire({
          title: "Tidak Ditemukan",
          text: "Turnamen tidak ditemukan",
          icon: "error",
        }).then(() => router.push("/acara"));
        return;
      }

      // 5. Format dates
      const formatDateTimeLocal = (dateString: string) => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return "";
          return date.toISOString().slice(0, 16);
        } catch (e) {
          return "";
        }
      };

      setForm({
        nama: acara.nama || "",
        deskripsi: acara.deskripsi || "",
        lokasi_lapangan: acara.lokasi_lapangan || "",
        url_lokasi_maps: acara.url_lokasi_maps || "",
        tanggal_mulai_pertandingan: formatDateTimeLocal(acara.tanggal_mulai_pertandingan),
        tanggal_selesai_pertandingan: formatDateTimeLocal(acara.tanggal_selesai_pertandingan),
        deadline_pendaftaran: formatDateTimeLocal(acara.deadline_pendaftaran),
      });

    } catch (error: any) {
      console.error("Error in checkAdminAccess:", error);
      
      Swal.fire({
        title: "Error",
        text: error.message || "Gagal memuat data turnamen",
        icon: "error",
        confirmButtonText: "Kembali",
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        title: "Periksa Form",
        html: `
          <div class="text-left">
            <p class="mb-2">Silakan perbaiki error berikut:</p>
            <div class="bg-red-50 border border-red-100 rounded-lg p-3">
              <ul class="list-disc list-inside space-y-1 text-sm text-red-700">
                ${Object.values(errors).map((error) => `<li>${error}</li>`).join("")}
              </ul>
            </div>
          </div>
        `,
        icon: "warning",
      });
      return;
    }

    setLoading(true);

    Swal.fire({
      title: "Menyimpan...",
      text: "Sedang menyimpan perubahan turnamen",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

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

      // Update tanpa filter dibuat_oleh
      const { error } = await supabase
        .from("acara")
        .update(updateData)
        .eq("id", acaraId);

      if (error) throw error;

      Swal.close();
      
      await Swal.fire({
        title: "Berhasil!",
        text: "Turnamen berhasil diperbarui",
        icon: "success",
        confirmButtonText: "OK",
      });

      router.push("/admin/acara");
      router.refresh();

    } catch (error: any) {
      console.error("Update error:", error);
      Swal.close();
      
      Swal.fire({
        title: "Gagal!",
        text: error.message || "Terjadi kesalahan saat menyimpan perubahan",
        icon: "error",
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
            {/* Form fields same as before */}
            <div className="space-y-2">
              <Label>Nama Turnamen *</Label>
              <Input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                rows={4}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lokasi Lapangan</Label>
                <Input
                  value={form.lokasi_lapangan}
                  onChange={(e) => setForm({ ...form, lokasi_lapangan: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label>URL Google Maps</Label>
                <Input
                  value={form.url_lokasi_maps}
                  onChange={(e) => setForm({ ...form, url_lokasi_maps: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Deadline Pendaftaran *</Label>
                <Input
                  type="datetime-local"
                  value={form.deadline_pendaftaran}
                  onChange={(e) => setForm({ ...form, deadline_pendaftaran: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label>Tanggal Mulai *</Label>
                <Input
                  type="datetime-local"
                  value={form.tanggal_mulai_pertandingan}
                  onChange={(e) => setForm({ ...form, tanggal_mulai_pertandingan: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label>Tanggal Selesai *</Label>
                <Input
                  type="datetime-local"
                  value={form.tanggal_selesai_pertandingan}
                  onChange={(e) => setForm({ ...form, tanggal_selesai_pertandingan: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Menyimpan..." : "Update Turnamen"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/acara")} className="flex-1">
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}