"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Plus,
  Trash2,
  ArrowLeft,
  Users,
  Calendar,
  Phone,
  GraduationCap,
  User,
  Hash,
  CheckCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ======================================================
// ZOD SCHEMA
// ======================================================
const FormSchema = z.object({
  nama: z.string().min(1, "Nama tim wajib diisi"),
  jurusan: z.string().optional(),
  angkatan: z.string().optional(),
  nomor_hp: z.string().optional(),
  acara_id: z.string().min(1, "Acara wajib dipilih"),
  anggota: z
    .array(
      z.object({
        id: z.string().optional(),
        nama_pemain: z.string().min(1, "Nama pemain wajib diisi"),
        nim: z.string().optional(),
      })
    )
    .min(1, "Minimal 1 pemain"),
});

type FormValues = z.infer<typeof FormSchema>;

export default function EditTimPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const timId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [loadingAcara, setLoadingAcara] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [acaraList, setAcaraList] = useState<{ id: string; nama: string }[]>([]);
  const [originalData, setOriginalData] = useState<any>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { anggota: [] },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "anggota",
  });

  // ======================================================
  // LOAD ACARA
  // ======================================================
  useEffect(() => {
    const loadAcara = async () => {
      try {
        const { data, error } = await supabase
          .from("acara")
          .select("id, nama")
          .order("nama");

        if (error) throw error;

        if (data) setAcaraList(data);
      } catch (error) {
        console.error("Error loading acara:", error);
        Swal.fire({
          title: 'Gagal Memuat Data',
          text: 'Terjadi kesalahan saat memuat daftar acara. Silakan refresh halaman.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#ef4444',
          customClass: {
            popup: 'rounded-lg'
          }
        });
      } finally {
        setLoadingAcara(false);
      }
    };

    loadAcara();
  }, [supabase]);

  // ======================================================
  // LOAD TIM
  // ======================================================
  useEffect(() => {
    const loadTim = async () => {
      try {
        const { data, error } = await supabase
          .from("tim")
          .select(
            `
            id, nama, jurusan, angkatan, nomor_hp, acara_id,
            anggota_tim ( id, nama_pemain, nim )
          `
          )
          .eq("id", timId)
          .single();

        if (error || !data) {
          Swal.fire({
            title: 'Data Tidak Ditemukan',
            text: 'Tim yang ingin diedit tidak ditemukan.',
            icon: 'error',
            confirmButtonText: 'Kembali',
            confirmButtonColor: '#ef4444',
            customClass: {
              popup: 'rounded-lg'
            }
          }).then(() => {
            router.push("/admin/tim");
          });
          return;
        }

        setOriginalData(data);

        const formData = {
          nama: data.nama,
          jurusan: data.jurusan ?? "",
          angkatan: data.angkatan ?? "",
          nomor_hp: data.nomor_hp ?? "",
          acara_id: data.acara_id,
          anggota: data.anggota_tim.map((a: any) => ({
            id: a.id,
            nama_pemain: a.nama_pemain,
            nim: a.nim ?? "",
          })),
        };

        reset(formData);
        replace(formData.anggota);
      } catch (err) {
        console.error("Error loading tim:", err);
        Swal.fire({
          title: 'Terjadi Kesalahan',
          text: 'Gagal memuat data tim. Silakan coba lagi.',
          icon: 'error',
          confirmButtonText: 'Kembali',
          confirmButtonColor: '#ef4444',
          customClass: {
            popup: 'rounded-lg'
          }
        }).then(() => {
          router.push("/admin/tim");
        });
      } finally {
        setLoading(false);
      }
    };

    loadTim();
  }, [timId, replace, reset, router, supabase]);

  // ======================================================
  // SWEET ALERT CONFIRMATION
  // ======================================================
  const showConfirmation = (values: FormValues) => {
    const anggotaCount = values.anggota.length;
    const selectedAcara = acaraList.find(a => a.id === values.acara_id)?.nama || "Acara Terpilih";

    // Check changes
    let changesDetected = false;
    if (originalData) {
      changesDetected = 
        values.nama !== originalData.nama ||
        values.jurusan !== (originalData.jurusan || "") ||
        values.angkatan !== (originalData.angkatan || "") ||
        values.nomor_hp !== (originalData.nomor_hp || "") ||
        values.acara_id !== originalData.acara_id ||
        values.anggota.length !== originalData.anggota_tim.length ||
        values.anggota.some((anggota, index) => 
          anggota.nama_pemain !== originalData.anggota_tim[index]?.nama_pemain ||
          (anggota.nim || "") !== (originalData.anggota_tim[index]?.nim || "")
        );
    }

    if (!changesDetected) {
      Swal.fire({
        title: 'Tidak Ada Perubahan',
        text: 'Tidak ada perubahan data yang dilakukan.',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-lg'
        }
      });
      return;
    }

    Swal.fire({
      title: 'Konfirmasi Perubahan',
      html: `
        <div class="text-left">
          <p class="mb-3">Apakah Anda yakin ingin menyimpan perubahan tim:</p>
          <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
            <p class="font-semibold text-lg text-blue-700 mb-2">${values.nama}</p>
            <div class="space-y-1 text-sm text-gray-600">
              <p><span class="font-medium">Acara:</span> ${selectedAcara}</p>
              ${values.jurusan ? `<p><span class="font-medium">Jurusan:</span> ${values.jurusan}</p>` : ''}
              ${values.angkatan ? `<p><span class="font-medium">Angkatan:</span> ${values.angkatan}</p>` : ''}
              <p><span class="font-medium">Jumlah Anggota:</span> ${anggotaCount} orang</p>
            </div>
          </div>
          <div class="bg-gray-50 border border-gray-100 rounded-lg p-3 mb-4 max-h-40 overflow-y-auto">
            <p class="font-medium text-sm text-gray-700 mb-2">Daftar Anggota Baru:</p>
            <div class="space-y-1">
              ${values.anggota.map((anggota, index) => `
                <div class="flex items-center gap-2 text-sm">
                  <div class="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <span class="text-xs text-blue-600">${index + 1}</span>
                  </div>
                  <span class="text-gray-700">${anggota.nama_pemain}</span>
                  ${anggota.nim ? `<span class="text-gray-500 text-xs">(${anggota.nim})</span>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
          <p class="text-sm text-gray-500">Perubahan akan diterapkan pada tim ini.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Simpan Perubahan',
      cancelButtonText: 'Batal',
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
        handleSave(values);
      }
    });
  };

  // ======================================================
  // SUBMIT HANDLER
  // ======================================================
  const handleSave = async (values: FormValues) => {
    setSubmitting(true);

    // Tampilkan loading alert
    Swal.fire({
      title: 'Menyimpan...',
      html: 'Sedang menyimpan perubahan data tim',
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
      // Update tim
      const { error: timError } = await supabase
        .from("tim")
        .update({
          nama: values.nama,
          jurusan: values.jurusan || null,
          angkatan: values.angkatan || null,
          nomor_hp: values.nomor_hp || null,
          acara_id: values.acara_id,
          jumlah_pemain: values.anggota.length,
        })
        .eq("id", timId);

      if (timError) throw timError;

      // Ambil ID anggota yang masih ada
      const keepIds = values.anggota.map((a) => a.id).filter(Boolean);

      // Hapus anggota yang dihapus di UI
      if (keepIds.length > 0) {
        const { error: deleteError } = await supabase
          .from("anggota_tim")
          .delete()
          .eq("tim_id", timId)
          .not("id", "in", `(${keepIds.join(",")})`);

        if (deleteError) throw deleteError;
      }

      // Upsert anggota
      const anggotaPayload = values.anggota.map((a) => ({
        id: a.id,
        tim_id: timId,
        nama_pemain: a.nama_pemain,
        nim: a.nim || null,
      }));

      const { error: anggotaError } = await supabase
        .from("anggota_tim")
        .upsert(anggotaPayload, { onConflict: "id" });

      if (anggotaError) throw anggotaError;

      // Tutup loading alert
      Swal.close();
      
      // Tampilkan success alert
      Swal.fire({
        title: 'Berhasil!',
        html: `
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Perubahan Disimpan</h3>
            <p class="text-gray-600 mb-4">Tim "${values.nama}" berhasil diperbarui</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Lihat Daftar Tim',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-lg',
          confirmButton: 'px-5 py-2 rounded'
        }
      }).then(() => {
        router.push("/tim");
        router.refresh();
      });

    } catch (error: any) {
      console.error("Error saving data:", error);
      
      // Tutup loading dan tampilkan error
      Swal.close();
      
      let errorMessage = "Terjadi kesalahan saat menyimpan perubahan";
      if (error.code === "23505") {
        errorMessage = "Nama tim sudah digunakan untuk acara ini. Silakan gunakan nama lain.";
      }
      
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
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // FORM SUBMIT
  // ======================================================
  const onSubmit = async (values: FormValues) => {
    // Validasi form sebelum konfirmasi
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
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
    
    showConfirmation(values);
  };

  // ======================================================
  // HANDLE CANCEL
  // ======================================================
  const handleCancel = () => {
    if (isDirty) {
      Swal.fire({
        title: 'Batalkan Perubahan?',
        text: 'Perubahan yang belum disimpan akan hilang. Apakah Anda yakin?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Batalkan',
        cancelButtonText: 'Lanjutkan Edit',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        reverseButtons: true,
        customClass: {
          popup: 'rounded-lg',
          confirmButton: 'px-5 py-2 rounded',
          cancelButton: 'px-5 py-2 rounded'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          router.back();
        }
      });
    } else {
      router.back();
    }
  };

  // ======================================================
  // HANDLE REMOVE ANGGOTA
  // ======================================================
  const handleRemoveAnggota = (index: number) => {
    if (fields.length <= 1) {
      Swal.fire({
        title: 'Tidak Dapat Dihapus',
        text: 'Minimal harus ada 1 anggota dalam tim.',
        icon: 'warning',
        confirmButtonColor: '#f59e0b',
        customClass: {
          popup: 'rounded-lg'
        }
      });
      return;
    }

    Swal.fire({
      title: 'Hapus Anggota?',
      text: 'Apakah Anda yakin ingin menghapus anggota ini?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'rounded-lg',
        confirmButton: 'px-5 py-2 rounded',
        cancelButton: 'px-5 py-2 rounded'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        remove(index);
        
        // Show toast notification
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Anggota berhasil dihapus',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          customClass: {
            popup: 'rounded-lg'
          }
        });
      }
    });
  };

  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Edit Tim & Anggota
                </h1>
                <p className="text-muted-foreground">
                  Perbarui data tim dan anggota yang sudah ada
                </p>
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="gap-2 w-full sm:w-auto"
            onClick={handleCancel}
            disabled={loading || submitting}
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </div>

        <Card className="shadow-md border-border">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-xl font-semibold text-foreground">
              Informasi Tim
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Edit data tim dan anggota sesuai kebutuhan
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-8">
                {/* Loading skeleton untuk form */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-11 w-full" />
                    </div>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-11 w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-11 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 space-y-4">
                      <Skeleton className="h-6 w-20" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-11 w-full" />
                        <Skeleton className="h-11 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Section 1: Data Utama Tim */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* NAMA TIM */}
                    <div className="space-y-3">
                      <Label htmlFor="nama" className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nama Tim <span className="text-destructive">*</span>
                      </Label>
                      <div className="space-y-2">
                        <Input
                          id="nama"
                          {...register("nama")}
                          placeholder="Masukkan nama tim"
                          className="h-11"
                          disabled={submitting}
                        />
                        {errors.nama && (
                          <div className="flex items-center gap-2 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {errors.nama.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ACARA */}
                    <div className="space-y-3">
                      <Label htmlFor="acara_id" className="font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Acara <span className="text-destructive">*</span>
                      </Label>
                      <div className="space-y-2">
                        {loadingAcara ? (
                          <Skeleton className="h-11 w-full" />
                        ) : (
                          <div className="relative">
                            <select
                              id="acara_id"
                              {...register("acara_id")}
                              className="w-full h-11 border border-input bg-background rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                              disabled={submitting}
                            >
                              <option value="">-- Pilih Acara --</option>
                              {acaraList.map((a) => (
                                <option key={a.id} value={a.id}>
                                  {a.nama}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <svg
                                className="h-4 w-4 text-muted-foreground"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                        {errors.acara_id && (
                          <div className="flex items-center gap-2 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {errors.acara_id.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* INFO TIM */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="jurusan" className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Jurusan
                      </Label>
                      <Input
                        id="jurusan"
                        {...register("jurusan")}
                        placeholder="Contoh: Teknik Informatika"
                        className="h-11"
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="angkatan" className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Angkatan
                      </Label>
                      <Input
                        id="angkatan"
                        {...register("angkatan")}
                        placeholder="Contoh: 2023"
                        className="h-11"
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="nomor_hp" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Nomor HP
                      </Label>
                      <Input
                        id="nomor_hp"
                        {...register("nomor_hp")}
                        placeholder="Contoh: 0812-3456-7890"
                        className="h-11"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-border" />

                {/* Section 2: Anggota Tim */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Anggota Tim
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Edit data anggota tim (minimal 1 orang)
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2 w-full sm:w-auto"
                      onClick={() => append({ nama_pemain: "", nim: "" })}
                      disabled={submitting}
                    >
                      <Plus className="h-4 w-4" />
                      Tambah Anggota
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-4 border border-border rounded-lg bg-card space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {index + 1}
                              </span>
                            </div>
                            <h4 className="font-medium text-foreground">
                              Anggota {index + 1}
                            </h4>
                          </div>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemoveAnggota(index)}
                              disabled={submitting}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Hapus
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <Label htmlFor={`anggota.${index}.nama_pemain`}>
                              Nama Pemain <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id={`anggota.${index}.nama_pemain`}
                              {...register(`anggota.${index}.nama_pemain`)}
                              placeholder="Masukkan nama lengkap"
                              className="h-11"
                              disabled={submitting}
                            />
                            {errors.anggota?.[index]?.nama_pemain && (
                              <div className="flex items-center gap-2 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                {errors.anggota[index]?.nama_pemain?.message}
                              </div>
                            )}
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor={`anggota.${index}.nim`}>
                              NIM
                            </Label>
                            <Input
                              id={`anggota.${index}.nim`}
                              {...register(`anggota.${index}.nim`)}
                              placeholder="Masukkan NIM (opsional)"
                              className="h-11"
                              disabled={submitting}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {errors.anggota?.root && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {errors.anggota.root.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <Separator className="bg-border" />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="sm:w-auto w-full h-11"
                    onClick={handleCancel}
                    disabled={submitting}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="sm:w-auto w-full h-11"
                    disabled={submitting || !isDirty}
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Menyimpan...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer Note */}
        <Alert className="mt-6 border border-border bg-muted/50">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-muted-foreground">
            <span className="font-medium text-foreground">Informasi penting:</span>{" "}
            Pastikan perubahan data sudah benar sebelum disimpan. Perubahan anggota tim akan memperbarui data yang ada.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}