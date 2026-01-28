"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  Trophy,
  Users,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AcaraSimple, BracketInfo, FormState, TimSimple } from "@/utils";

export default function TambahPertandinganPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [acaraList, setAcaraList] = useState<AcaraSimple[]>([]);
  const [timList, setTimList] = useState<TimSimple[]>([]);
  const [selectedAcara, setSelectedAcara] = useState<AcaraSimple | null>(null);
  const [bracketInfo, setBracketInfo] = useState<BracketInfo | null>(null);
  const [existingBracket, setExistingBracket] = useState<boolean>(false);

  const [form, setForm] = useState<FormState>({
    acara_id: "",
    tanggal_pertandingan: "",
    waktu_pertandingan: "",
  });

  // ================= LOAD ACARA =================
  useEffect(() => {
    const loadAcara = async () => {
      try {
        const { data, error } = await supabase
          .from("acara")
          .select("id, nama")
          .order("nama");

        if (error) {
          console.error("Error loading acara:", error);
          return;
        }

        if (data) {
          setAcaraList(data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAcara();
  }, [supabase]);

  // ================= LOAD TIM DAN CHECK BRACKET =================
  const loadAcaraData = async (acaraId: string) => {
    setForm((f) => ({ ...f, acara_id: acaraId }));
    
    const selected = acaraList.find(a => a.id === acaraId);
    setSelectedAcara(selected || null);

    // Load tim untuk acara ini
    const timRes = await supabase
      .from("tim")
      .select("id, nama")
      .eq("acara_id", acaraId)
      .eq("status", "aktif")
      .order("nama");

    setTimList(timRes.data || []);

    // Check existing bracket
    const { data: existingRounds } = await supabase
      .from("round")
      .select("id")
      .eq("acara_id", acaraId)
      .limit(1);

    setExistingBracket(!!(existingRounds && existingRounds.length > 0));

    // Calculate bracket info
    calculateBracketInfo(timRes.data || []);
  };

  // ================= CALCULATE BRACKET INFO =================
  const calculateBracketInfo = (teams: TimSimple[]) => {
    const totalTim = teams.length;
    
    if (totalTim === 0) {
      setBracketInfo(null);
      return;
    }

    // Find nearest power of 2
    let bracketSize = 2;
    while (bracketSize < totalTim) {
      bracketSize *= 2;
    }

    const byeCount = bracketSize - totalTim;
    const matchCount = Math.floor((totalTim - byeCount) / 2);
    
    // Calculate rounds
    let rounds = 0;
    let remainingMatches = bracketSize / 2;
    let roundNames = [];
    
    while (remainingMatches >= 1) {
      rounds++;
      if (remainingMatches === 1) roundNames.push("Final");
      else if (remainingMatches === 2) roundNames.push("Semifinal");
      else if (remainingMatches === 4) roundNames.push("Quarterfinal");
      else roundNames.push(`Round ${rounds}`);
      remainingMatches /= 2;
    }

    setBracketInfo({
      totalTim,
      bracketSize,
      byeCount,
      matchCount,
      rounds,
      maxRound: roundNames[0] || "Round 1"
    });
  };

  // ================= GENERATE BRACKET OTOMATIS =================
  const handleGenerateBracket = async () => {
    if (!form.acara_id) {
      alert("Pilih acara terlebih dahulu");
      return;
    }

    if (timList.length < 2) {
      alert("Minimal 2 tim diperlukan untuk membuat bracket");
      return;
    }

    if (existingBracket) {
      const confirm = window.confirm(
        "Sudah ada bracket untuk acara ini. Generate baru akan menghapus semua pertandingan dan round yang ada.\n\nLanjutkan?"
      );
      
      if (!confirm) {
        return;
      }
    }

    setSaving(true);

    try {
      // Jika ada bracket lama, hapus dulu
      if (existingBracket) {
        const { error: deleteError } = await supabase
          .from("round")
          .delete()
          .eq("acara_id", form.acara_id);

        if (deleteError) {
          console.error('Error deleting existing rounds:', deleteError);
          alert('Gagal menghapus bracket lama');
          setSaving(false);
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
        setSaving(false);
        return;
      }

      // Panggil fungsi generate_first_round dari RPC
      const { data, error } = await supabase
        .rpc('generate_first_round', {
          p_acara_id: form.acara_id
        });

      if (error) {
        console.error('Error generating bracket:', error);
        alert('Gagal generate bracket: ' + error.message);
        setSaving(false);
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

      // Show success message
      alert('✅ Bracket berhasil digenerate!');
      
      // Navigate to bracket page
      router.push(`/pertandingan/bracket/${form.acara_id}`);
      router.refresh();

    } catch (error) {
      console.error('Error:', error);
      alert('❌ Terjadi kesalahan: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // ================= RENDER TEAM INFO CARD =================
  const renderTeamInfo = () => {
    if (!bracketInfo || timList.length === 0) return null;

    return (
      <Card className="border border-blue-200 bg-blue-50/50 dark:bg-blue-950/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                Informasi Bracket
              </h3>
            </div>
            <Badge variant="outline" className="bg-white dark:bg-gray-900">
              {bracketInfo.totalTim} Tim
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Kapasitas</p>
              <p className="font-semibold">{bracketInfo.bracketSize} slot</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Bye</p>
              <p className="font-semibold text-amber-600">
                {bracketInfo.byeCount} tim
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Match</p>
              <p className="font-semibold">{bracketInfo.matchCount} pertandingan</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Babak</p>
              <p className="font-semibold">{bracketInfo.rounds} round</p>
            </div>
          </div>

          {bracketInfo.byeCount > 0 && (
            <Alert className="mt-4 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                {bracketInfo.byeCount} tim akan mendapat BYE (langsung lolos ke {bracketInfo.maxRound})
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  // ================= RENDER TIM LIST =================
  const renderTimList = () => {
    if (timList.length === 0) {
      return (
        <div className="text-center py-8 border rounded-lg bg-muted/30">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Tidak ada tim aktif untuk acara ini</p>
          <p className="text-sm text-muted-foreground mt-1">
            Tambah tim terlebih dahulu di halaman Kelola Tim
          </p>
        </div>
      );
    }

    return (
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Daftar Tim ({timList.length})</h3>
          <Badge variant="secondary">{timList.length} Tim</Badge>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2">
          {timList.map((t, index) => (
            <div 
              key={t.id} 
              className="flex items-center gap-3 p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                {index + 1}
              </div>
              <span className="font-medium">{t.nama}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Generate Bracket</h1>
              <p className="text-muted-foreground">
                Buat bracket turnamen sistem gugur secara otomatis
              </p>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - FORM */}
          <div className="lg:col-span-2 space-y-6">
            {/* ACARA SELECTION CARD */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Pilih Acara
                </CardTitle>
                <CardDescription>
                  Pilih acara turnamen yang akan dibuat bracket-nya
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <Skeleton className="h-40" />
                ) : (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="acara">Acara Turnamen</Label>
                      <Select
                        value={form.acara_id}
                        onValueChange={loadAcaraData}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih acara" />
                        </SelectTrigger>
                        <SelectContent>
                          {acaraList.map((a) => (
                            <SelectItem key={a.id} value={a.id}>
                              {a.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* WARNING FOR EXISTING BRACKET */}
                    {existingBracket && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Bracket Sudah Ada</AlertTitle>
                        <AlertDescription>
                          Acara ini sudah memiliki bracket. Generate baru akan menghapus semua pertandingan yang ada.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* TIM LIST */}
                    {form.acara_id && (
                      <>
                        {renderTimList()}
                        {renderTeamInfo()}
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* SCHEDULE CARD */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Jadwal Pertandingan (Opsional)
                </CardTitle>
                <CardDescription>
                  Atur tanggal dan waktu untuk semua pertandingan di round pertama
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Tanggal Pertandingan
                    </Label>
                    <Input
                      type="date"
                      value={form.tanggal_pertandingan}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          tanggal_pertandingan: e.target.value,
                        }))
                      }
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Waktu Pertandingan
                    </Label>
                    <Input
                      type="time"
                      value={form.waktu_pertandingan}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          waktu_pertandingan: e.target.value,
                        }))
                      }
                      className="h-11"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN - ACTIONS & INFO */}
          <div className="space-y-6">
            {/* GENERATE BUTTON CARD */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle>Generate Bracket</CardTitle>
                <CardDescription>
                  Buat bracket sistem gugur secara otomatis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleGenerateBracket}
                  disabled={!form.acara_id || saving || timList.length < 2}
                  className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  size="lg"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sedang Generate...
                    </>
                  ) : (
                    <>
                      <Trophy className="h-4 w-4 mr-2" />
                      Generate Bracket Otomatis
                    </>
                  )}
                </Button>

                {timList.length < 2 && form.acara_id && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Minimal 2 tim diperlukan untuk membuat bracket
                    </AlertDescription>
                  </Alert>
                )}

                {existingBracket && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Bracket yang ada akan dihapus dan diganti dengan yang baru
                    </AlertDescription>
                  </Alert>
                )}

                <div className="text-xs text-muted-foreground space-y-2">
                  <p>✅ Sistem akan otomatis:</p>
                  <ul className="space-y-1 pl-4">
                    <li>• Membuat bracket lengkap</li>
                    <li>• Menghitung bye otomatis</li>
                    <li>• Generate semua round</li>
                    <li>• Random seeding tim</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* FEATURES CARD */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fitur Sistem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Random Seeding</p>
                    <p className="text-muted-foreground">Tim diacak secara otomatis</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Auto Bye</p>
                    <p className="text-muted-foreground">Bye otomatis dihitung</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <ChevronRight className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Auto Round</p>
                    <p className="text-muted-foreground">Round berikutnya otomatis dibuat</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BRACKET PREVIEW */}
            {bracketInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Preview Bracket</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Total Tim</span>
                      <span className="font-medium">{bracketInfo.totalTim}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Kapasitas</span>
                      <span className="font-medium">{bracketInfo.bracketSize}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Pertandingan</span>
                      <span className="font-medium">{bracketInfo.matchCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Round</span>
                      <span className="font-medium">{bracketInfo.rounds}</span>
                    </div>
                    
                    <div className="pt-2">
                      <Progress value={(bracketInfo.totalTim / bracketInfo.bracketSize) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1 text-center">
                        Kapasitas terisi {Math.round((bracketInfo.totalTim / bracketInfo.bracketSize) * 100)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}