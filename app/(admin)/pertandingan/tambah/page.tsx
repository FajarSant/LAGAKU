"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Acara, FormState, Round, Tim } from "@/types/type";

// ======================================================
// ADMIN - TAMBAH / GENERATE PERTANDINGAN (SISTEM GUGUR)
// ======================================================
export default function TambahPertandinganPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [acaraList, setAcaraList] = useState<Acara[]>([]);
  const [timList, setTimList] = useState<Tim[]>([]);

  const [form, setForm] = useState<FormState>({
    acara_id: "",
    tanggal_pertandingan: "",
    waktu_pertandingan: "",
  });

  // ================= LOAD ACARA =================
  useEffect(() => {
    const loadAcara = async () => {
      const { data, error } = await supabase
        .from("acara")
        .select("id, nama")
        .order("nama");

      if (!error && data) {
        setAcaraList(data);
      }
      setLoading(false);
    };

    loadAcara();
  }, [supabase]);

  // ================= LOAD TIM =================
  const loadAcaraData = async (acaraId: string) => {
    setForm((f) => ({ ...f, acara_id: acaraId }));

    const timRes = await supabase
      .from("tim")
      .select("id, nama")
      .eq("acara_id", acaraId)
      .eq("status", "aktif")
      .order("nama");

    setTimList(timRes.data ?? []);
  };

  // ================= GENERATE BRACKET OTOMATIS =================
  const handleGenerateAutomatic = async () => {
    if (!form.acara_id) {
      alert("Pilih acara terlebih dahulu");
      return;
    }

    setSaving(true);

    try {
      // Cek apakah sudah ada bracket untuk acara ini
      const { data: existingRounds } = await supabase
        .from("round")
        .select("id")
        .eq("acara_id", form.acara_id)
        .limit(1);

      if (existingRounds && existingRounds.length > 0) {
        const confirm = window.confirm(
          "Sudah ada bracket untuk acara ini. Generate baru akan menghapus semua pertandingan dan round yang ada. Lanjutkan?"
        );
        
        if (!confirm) {
          setSaving(false);
          return;
        }

        // Hapus semua round dan pertandingan yang ada
        const { error: deleteError } = await supabase
          .from("round")
          .delete()
          .eq("acara_id", form.acara_id);

        if (deleteError) {
          console.error('Error deleting existing rounds:', deleteError);
          alert('Gagal menghapus bracket lama');
          return;
        }
      }

      // Reset status tim menjadi aktif
      const { error: resetError } = await supabase
        .from("tim")
        .update({ status: "aktif" })
        .eq("acara_id", form.acara_id);

      if (resetError) {
        console.error('Error resetting team status:', resetError);
        alert('Gagal reset status tim');
        return;
      }

      // Panggil fungsi generate_first_round
      const { data, error } = await supabase
        .rpc('generate_first_round', {
          p_acara_id: form.acara_id
        });

      if (error) {
        console.error('Error generating bracket:', error);
        alert('Gagal generate bracket: ' + error.message);
        return;
      }

      // Set tanggal dan waktu untuk match yang dijadwalkan
      if (form.tanggal_pertandingan || form.waktu_pertandingan) {
        await supabase
          .from("pertandingan")
          .update({
            tanggal_pertandingan: form.tanggal_pertandingan || null,
            waktu_pertandingan: form.waktu_pertandingan || null
          })
          .eq("acara_id", form.acara_id)
          .eq("status", "dijadwalkan");
      }

      alert('Bracket berhasil digenerate!');
      router.push(`/admin/pertandingan/bracket/${form.acara_id}`);
      router.refresh();

    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // ================= GENERATE MANUAL (JIKA MASIH DIPERLUKAN) =================
  const handleSubmitManual = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!form.acara_id) {
      alert("Pilih acara terlebih dahulu");
      return;
    }

    setSaving(true);

    try {
      // Cek apakah sudah ada bracket
      const { data: existingRounds } = await supabase
        .from("round")
        .select("id")
        .eq("acara_id", form.acara_id)
        .limit(1);

      if (existingRounds && existingRounds.length > 0) {
        const confirm = window.confirm(
          "Sudah ada bracket untuk acara ini. Generate baru akan menghapus semua pertandingan dan round yang ada. Lanjutkan?"
        );
        
        if (!confirm) {
          setSaving(false);
          return;
        }

        // Hapus semua round dan pertandingan yang ada
        await supabase
          .from("round")
          .delete()
          .eq("acara_id", form.acara_id);
      }

      // Reset status tim menjadi aktif
      await supabase
        .from("tim")
        .update({ status: "aktif" })
        .eq("acara_id", form.acara_id);

      // Panggil fungsi generate_first_round
      const { error } = await supabase
        .rpc('generate_first_round', {
          p_acara_id: form.acara_id
        });

      if (error) {
        console.error('Error generating bracket:', error);
        alert('Gagal generate bracket: ' + error.message);
        return;
      }

      // Set tanggal dan waktu
      if (form.tanggal_pertandingan || form.waktu_pertandingan) {
        await supabase
          .from("pertandingan")
          .update({
            tanggal_pertandingan: form.tanggal_pertandingan || null,
            waktu_pertandingan: form.waktu_pertandingan || null
          })
          .eq("acara_id", form.acara_id)
          .eq("status", "dijadwalkan");
      }

      alert('Bracket berhasil digenerate!');
      router.push(`/admin/pertandingan/bracket/${form.acara_id}`);
      router.refresh();

    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // ================= RENDER TIM COUNT =================
  const renderTimInfo = () => {
    const totalTim = timList.length;
    
    if (totalTim === 0) return null;

    // Hitung kapasitas bracket
    let bracketSize = 0;
    if (totalTim <= 2) bracketSize = 2;
    else if (totalTim <= 4) bracketSize = 4;
    else if (totalTim <= 8) bracketSize = 8;
    else if (totalTim <= 16) bracketSize = 16;
    else if (totalTim <= 32) bracketSize = 32;
    
    const byeCount = bracketSize - totalTim;
    const matchCount = Math.floor((totalTim - byeCount) / 2);

    return (
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm font-medium text-blue-800">Informasi Tim:</p>
        <ul className="text-xs text-blue-700 mt-1 space-y-1">
          <li>• Total tim aktif: {totalTim}</li>
          <li>• Kapasitas bracket: {bracketSize}</li>
          <li>• Bye dibutuhkan: {byeCount} tim</li>
          <li>• Match normal: {matchCount} pertandingan</li>
          {byeCount > 0 && (
            <li className="text-amber-700 font-medium">
              ⚠️ {byeCount} tim akan mendapat bye (langsung lolos ke round berikutnya)
            </li>
          )}
        </ul>
      </div>
    );
  };

  // ================= UI =================
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* CARD 1: INFORMASI ACARA & TIM */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Acara & Tim</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-40" />
          ) : (
            <div className="space-y-6">
              {/* ACARA */}
              <div className="space-y-2">
                <Label>Acara</Label>
                <select
                  className="w-full border rounded-md p-2"
                  value={form.acara_id}
                  onChange={(e) => loadAcaraData(e.target.value)}
                >
                  <option value="">Pilih acara</option>
                  {acaraList.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* INFO TIM */}
              {form.acara_id && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Tim Terdaftar ({timList.length})</Label>
                  </div>
                  <div className="border rounded-md p-3 max-h-64 overflow-y-auto space-y-2">
                    {timList.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Tidak ada tim aktif untuk acara ini
                      </p>
                    ) : (
                      timList.map((t) => (
                        <div key={t.id} className="flex gap-2 text-sm items-center p-2 bg-gray-50 rounded">
                          <span>{t.nama}</span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Info Bye */}
                  {renderTimInfo()}
                </div>
              )}

              {/* TANGGAL & WAKTU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tanggal Pertandingan (Opsional)</Label>
                  <Input
                    type="date"
                    value={form.tanggal_pertandingan}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        tanggal_pertandingan: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Waktu Pertandingan (Opsional)</Label>
                  <Input
                    type="time"
                    value={form.waktu_pertandingan}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        waktu_pertandingan: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CARD 2: GENERATE BRACKET */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Bracket Sistem Gugur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <h4 className="font-medium text-amber-800">Fitur Otomatis:</h4>
            <ul className="text-sm text-amber-700 mt-2 space-y-1">
              <li>✅ Random seeding otomatis</li>
              <li>✅ Bye otomatis dihitung dengan benar</li>
              <li>✅ Multiple round otomatis tergenerate (via trigger)</li>
              <li>✅ Auto-generate round berikutnya saat match selesai</li>
              <li>✅ Auto update status tim (gugur/aktif)</li>
              <li>✅ Validasi skor (tidak boleh seri)</li>
            </ul>
          </div>

          <Button
            onClick={handleGenerateAutomatic}
            disabled={!form.acara_id || saving || timList.length < 2}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {saving ? "Mengenerate..." : "Generate Bracket Otomatis"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Sistem akan otomatis membuat bracket lengkap dengan semua babak menggunakan fungsi database
          </p>
        </CardContent>
      </Card>

      {/* CARD 3: INFORMASI SISTEM */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Cara Kerja Sistem</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <div className="space-y-1">
            <p className="font-medium">📋 Saat Generate Bracket:</p>
            <ul className="text-muted-foreground pl-4 list-disc">
              <li>Tim diacak secara random</li>
              <li>Bye otomatis dihitung berdasarkan power of 2 terdekat</li>
              <li>Tim dengan bye langsung lolos ke round berikutnya</li>
              <li>Round berikutnya otomatis dibuat saat match selesai</li>
            </ul>
          </div>
          
          <div className="space-y-1">
            <p className="font-medium">⚡ Trigger Otomatis:</p>
            <ul className="text-muted-foreground pl-4 list-disc">
              <li>trg_validate_match: Validasi skor sebelum update</li>
              <li>trg_update_team: Update status tim yang kalah menjadi "gugur"</li>
              <li>trg_generate_round: Buat round baru otomatis</li>
            </ul>
          </div>
          
          <div className="space-y-1">
            <p className="font-medium">📊 Contoh untuk {timList.length} tim:</p>
            <ul className="text-muted-foreground pl-4 list-disc">
              {timList.length > 0 && (
                <>
                  <li>Total tim: {timList.length}</li>
                  <li>Kapasitas bracket: {
                    timList.length <= 2 ? 2 :
                    timList.length <= 4 ? 4 :
                    timList.length <= 8 ? 8 :
                    timList.length <= 16 ? 16 :
                    timList.length <= 32 ? 32 : 32
                  }</li>
                  <li>Bye: {Math.max(0, (
                    timList.length <= 2 ? 2 :
                    timList.length <= 4 ? 4 :
                    timList.length <= 8 ? 8 :
                    timList.length <= 16 ? 16 :
                    timList.length <= 32 ? 32 : 32
                  ) - timList.length)} tim</li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}