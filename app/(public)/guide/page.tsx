"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/navigation/navigation";
import Footer from "@/components/public/Footer";
import {
  Users,
  Trophy,
  Calendar,
  Gamepad2,
  UserPlus,
  Award,
  BookOpen,
  HelpCircle,
  ChevronRight,
  CheckCircle,
  Zap,
  Shield,
  BarChart,
  Settings,
  FileText,
} from "lucide-react";

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState("overview");

  const guides = {
    overview: [
      {
        title: "Apa itu LigaKu?",
        description: "Platform kompetisi esports terintegrasi untuk mahasiswa dengan sistem bracket otomatis, manajemen tim, dan tracking statistik.",
        icon: <Trophy className="h-5 w-5" />,
      },
      {
        title: "Untuk Siapa?",
        description: "Didesain khusus untuk mahasiswa, organisasi kampus, dan komunitas esports yang ingin menyelenggarakan turnamen dengan mudah.",
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Fitur Utama",
        description: "Manajemen tim otomatis, sistem bracket, statistik real-time, dan dashboard admin yang lengkap.",
        icon: <Zap className="h-5 w-5" />,
      },
    ],
    participants: [
      {
        title: "1. Registrasi Akun",
        description: "Daftar menggunakan email kampus atau personal email, lengkapi profil dengan NIM dan jurusan.",
        steps: ["Buka halaman register", "Isi data diri lengkap", "Verifikasi email"],
      },
      {
        title: "2. Membuat Tim",
        description: "Buat tim baru atau bergabung dengan tim yang sudah ada.",
        steps: ["Buka halaman 'Tim Saya'", "Klik 'Buat Tim Baru'", "Isi data tim dan tambahkan anggota"],
      },
      {
        title: "3. Daftar Turnamen",
        description: "Pilih turnamen yang tersedia dan daftarkan tim Anda.",
        steps: ["Buka halaman 'Turnamen'", "Pilih turnamen yang diinginkan", "Klik 'Daftar Sekarang'"],
      },
      {
        title: "4. Ikuti Pertandingan",
        description: "Ikuti jadwal pertandingan dan update hasil pertandingan.",
        steps: ["Cek jadwal di dashboard", "Hadiri pertandingan sesuai jadwal", "Input hasil jika diperlukan"],
      },
    ],
    organizers: [
      {
        title: "Membuat Turnamen",
        description: "Admin dapat membuat turnamen baru dengan konfigurasi lengkap.",
        steps: [
          "Login sebagai admin",
          "Buka dashboard admin",
          "Pilih 'Buat Turnamen Baru'",
          "Isi detail turnamen",
          "Atur sistem bracket",
        ],
      },
      {
        title: "Manajemen Peserta",
        description: "Kelola pendaftaran tim dan verifikasi peserta.",
        steps: [
          "Monitor pendaftaran",
          "Verifikasi data tim",
          "Atur seedings",
          "Generate bracket otomatis",
        ],
      },
      {
        title: "Update Pertandingan",
        description: "Input hasil pertandingan dan update progres bracket.",
        steps: [
          "Masuk ke halaman pertandingan",
          "Input skor pertandingan",
          "Sistem akan update bracket otomatis",
          "Umumkan pemenang",
        ],
      },
      {
        title: "Statistik & Laporan",
        description: "Akses data statistik lengkap dan generate laporan.",
        steps: [
          "Buka dashboard statistik",
          "Analisis data performa",
          "Download laporan Excel/PDF",
          "Pantau aktivitas turnamen",
        ],
      },
    ],
    faq: [
      {
        question: "Apakah sistem ini gratis?",
        answer: "Ya, LigaKu sepenuhnya gratis untuk digunakan oleh mahasiswa dan organisasi kampus.",
      },
      {
        question: "Berapa maksimal anggota per tim?",
        answer: "Maksimal 10 anggota per tim, termasuk 1 ketua tim. Minimum 3 anggota untuk mengikuti turnamen.",
      },
      {
        question: "Bagaimana jika ada anggota yang keluar?",
        answer: "Ketua tim dapat mengelola anggota di halaman 'Tim Saya'. Anggota yang keluar dapat diganti sebelum turnamen dimulai.",
      },
      {
        question: "Apakah bisa mengikuti multiple turnamen?",
        answer: "Ya, satu tim dapat mengikuti multiple turnamen asalkan jadwal tidak bertabrakan.",
      },
      {
        question: "Bagaimana sistem penilaian?",
        answer: "Sistem menggunakan win/lose record. Tie-breaker berdasarkan head-to-head, kemudian total skor.",
      },
      {
        question: "Bagaimana cara kontak admin?",
        answer: "Dapat menghubungi melalui email: admin@ligaku.ac.id atau melalui fitur chat di dashboard.",
      },
    ],
  };

  const features = [
    {
      icon: <Gamepad2 className="h-6 w-6" />,
      title: "Sistem Bracket Otomatis",
      description: "Generate bracket single/double elimination otomatis berdasarkan jumlah peserta.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Manajemen Tim Lengkap",
      description: "Kelola anggota tim, role, dan informasi kontak dalam satu dashboard.",
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Statistik Real-time",
      description: "Tracking statistik pertandingan, win rate, dan performa pemain secara real-time.",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Jadwal Terintegrasi",
      description: "Sistem penjadwalan otomatis dengan reminder untuk peserta dan admin.",
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Dashboard Admin",
      description: "Tools lengkap untuk mengelola turnamen, peserta, dan hasil pertandingan.",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Laporan Lengkap",
      description: "Generate laporan Excel/PDF untuk analisis dan dokumentasi turnamen.",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="mb-4 px-4 py-1 text-sm bg-primary/20 text-primary hover:bg-primary/30">
              <BookOpen className="h-3 w-3 mr-1" />
              Panduan Lengkap
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Panduan Sistem <span className="text-primary">LigaKu</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Pelajari cara menggunakan platform kompetisi esports terbaik untuk mahasiswa. Mulai dari registrasi hingga menjadi juara!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/tournaments">
                  Lihat Turnamen
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href="/my-teams">
                  <Users className="h-4 w-4" />
                  Kelola Tim
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Features Overview */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Fitur Unggulan</h2>
              <p className="text-muted-foreground">
                Platform lengkap untuk mengelola kompetisi esports dari A sampai Z
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                      <div className="text-primary">{feature.icon}</div>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Guide Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-16">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="overview" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="participants" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Untuk Peserta
              </TabsTrigger>
              <TabsTrigger value="organizers" className="gap-2">
                <Award className="h-4 w-4" />
                Untuk Admin
              </TabsTrigger>
              <TabsTrigger value="faq" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQ
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {guides.overview.map((item, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-3">
                        <div className="text-primary">{item.icon}</div>
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Alur Sistem LigaKu</CardTitle>
                  <CardDescription>Proses lengkap dari awal hingga akhir turnamen</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Process Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[
                        { step: 1, title: "Registrasi", desc: "Peserta membuat akun" },
                        { step: 2, title: "Buat Tim", desc: "Bentuk tim dengan anggota" },
                        { step: 3, title: "Daftar Turnamen", desc: "Pilih dan daftar turnamen" },
                        { step: 4, title: "Kompetisi", desc: "Ikuti pertandingan" },
                        { step: 5, title: "Hasil & Statistik", desc: "Lihat ranking dan statistik" },
                      ].map((process) => (
                        <div key={process.step} className="text-center">
                          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                            {process.step}
                          </div>
                          <h4 className="font-semibold mb-1">{process.title}</h4>
                          <p className="text-sm text-muted-foreground">{process.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Participants Tab */}
            <TabsContent value="participants" className="space-y-6">
              {guides.participants.map((guide, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{guide.title}</CardTitle>
                        <CardDescription>{guide.description}</CardDescription>
                      </div>
                      <Badge variant="outline">Step {index + 1}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {guide.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Organizers Tab */}
            <TabsContent value="organizers" className="space-y-6">
              {guides.organizers.map((guide, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{guide.title}</CardTitle>
                        <CardDescription>{guide.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">Admin</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {guide.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle>Pertanyaan yang Sering Diajukan</CardTitle>
                  <CardDescription>Cari jawaban untuk pertanyaan umum tentang LigaKu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {guides.faq.map((item, index) => (
                      <div key={index}>
                        <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                          <HelpCircle className="h-5 w-5 text-primary" />
                          {item.question}
                        </h4>
                        <p className="text-muted-foreground pl-7">{item.answer}</p>
                        {index < guides.faq.length - 1 && <Separator className="my-6" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Links */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-center">Mulai Sekarang</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="h-auto py-6 flex-col gap-3">
                <Link href="/tournaments">
                  <Trophy className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-semibold">Lihat Turnamen</div>
                    <div className="text-sm text-muted-foreground">Temukan turnamen yang tersedia</div>
                  </div>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-6 flex-col gap-3">
                <Link href="/my-teams">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-semibold">Kelola Tim</div>
                    <div className="text-sm text-muted-foreground">Buat atau kelola tim Anda</div>
                  </div>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-6 flex-col gap-3">
                <Link href="/register">
                  <UserPlus className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-semibold">Buat Akun</div>
                    <div className="text-sm text-muted-foreground">Daftar untuk mulai berkompetisi</div>
                  </div>
                </Link>
              </Button>
            </div>
          </div>

          {/* Contact Support */}
          <Card className="bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Butuh Bantuan Lebih Lanjut?</h3>
                  <p className="text-muted-foreground">
                    Tim support kami siap membantu Anda 24/7. Hubungi kami untuk pertanyaan teknis atau bantuan lainnya.
                  </p>
                </div>
                <Button asChild size="lg" className="gap-2">
                  <Link href="mailto:support@ligaku.ac.id">
                    <HelpCircle className="h-4 w-4" />
                    Hubungi Support
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}