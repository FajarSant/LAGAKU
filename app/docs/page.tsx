"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiBook,
  FiSearch,
  FiHome,
  FiSettings,
  FiUsers,
  FiCalendar,
  FiLayers,
  FiUserCheck,
  FiGrid,
  FiCrosshair,
  FiBarChart2,
  FiFileText,
  FiVideo,
  FiDownload,
  FiChevronRight,
  FiChevronDown,
  FiExternalLink,
  FiCode,
  FiAlertCircle,
  FiCheckCircle,
  FiHelpCircle,
} from "react-icons/fi";

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("getting-started");
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "getting-started",
    "user-guide",
  ]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredDocs = searchQuery
    ? documentationSections.flatMap((section) =>
        section.items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-primary to-primary/80 p-2">
                <FiBook className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">LIGAKU Documentation</h1>
                <p className="text-sm text-muted-foreground">
                  Panduan lengkap penggunaan sistem tournament
                </p>
              </div>
            </div>

            <div className="flex w-full max-w-md items-center gap-2">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Cari di dokumentasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Link
                href="/"
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <div className="sticky top-24 rounded-xl border border-border bg-background p-6">
              <nav className="space-y-2">
                <div className="mb-4 text-sm font-semibold text-muted-foreground">
                  KONTEN
                </div>
                {documentationSections.map((section) => (
                  <div key={section.id} className="space-y-1">
                    <button
                      onClick={() => toggleExpand(section.id)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-secondary"
                    >
                      <span className="flex items-center gap-2">
                        {section.icon}
                        {section.title}
                      </span>
                      {expandedItems.includes(section.id) ? (
                        <FiChevronDown className="h-4 w-4" />
                      ) : (
                        <FiChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {expandedItems.includes(section.id) && (
                      <div className="ml-4 space-y-1 border-l border-border pl-3">
                        {section.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                              activeSection === item.id
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-secondary"
                            }`}
                          >
                            <FiChevronRight className="h-3 w-3" />
                            {item.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Quick Links */}
              <div className="mt-8 border-t pt-6">
                <div className="mb-3 text-sm font-semibold text-muted-foreground">
                  LINK CEPAT
                </div>
                <div className="space-y-2">
                  <Link
                    href="/support"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <FiHelpCircle className="h-4 w-4" />
                    Support Center
                  </Link>
                  <Link
                    href="/tutorials"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <FiVideo className="h-4 w-4" />
                    Video Tutorials
                  </Link>
                  <a
                    href="/api-docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <FiCode className="h-4 w-4" />
                    API Reference
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {searchQuery ? (
              /* Search Results */
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-background p-6">
                  <h2 className="mb-4 text-2xl font-bold">
                    Hasil Pencarian untuk "{searchQuery}"
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredDocs.length} hasil ditemukan
                  </p>
                </div>

                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-xl border border-border bg-background p-6"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <FiFileText className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-semibold">{doc.title}</h3>
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {doc.description}
                    </p>
                    <button
                      onClick={() => setActiveSection(doc.id)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Baca selengkapnya →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* Documentation Content */
              <div className="space-y-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link href="/" className="hover:text-foreground">
                    Home
                  </Link>
                  <FiChevronRight className="h-3 w-3" />
                  <Link href="/docs" className="hover:text-foreground">
                    Documentation
                  </Link>
                  <FiChevronRight className="h-3 w-3" />
                  <span className="text-foreground">
                    {
                      documentationSections
                        .flatMap((s) => s.items)
                        .find((item) => item.id === activeSection)?.title
                    }
                  </span>
                </div>

                {/* Content Header */}
                <div className="rounded-xl border border-border bg-background p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold">
                        {
                          documentationSections
                            .flatMap((s) => s.items)
                            .find((item) => item.id === activeSection)?.title
                        }
                      </h1>
                      <p className="mt-2 text-muted-foreground">
                        {
                          documentationSections
                            .flatMap((s) => s.items)
                            .find((item) => item.id === activeSection)
                            ?.description
                        }
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary">
                        <FiVideo className="h-4 w-4" />
                        Video
                      </button>
                      <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary">
                        <FiDownload className="h-4 w-4" />
                        PDF
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="prose prose-gray max-w-none dark:prose-invert">
                    {getDocumentationContent(activeSection)}
                  </div>

                  {/* Feedback */}
                  <div className="mt-8 border-t pt-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Apakah halaman ini membantu?
                      </p>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-500 hover:bg-green-500/20">
                          <FiCheckCircle className="h-4 w-4" />
                          Ya
                        </button>
                        <button className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-500 hover:bg-red-500/20">
                          <FiAlertCircle className="h-4 w-4" />
                          Tidak
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation between pages */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <button
                    onClick={() => {
                      const currentIndex = documentationSections
                        .flatMap((s) => s.items)
                        .findIndex((item) => item.id === activeSection);
                      const prevItem =
                        documentationSections
                          .flatMap((s) => s.items)
                          [currentIndex - 1] || null;
                      if (prevItem) setActiveSection(prevItem.id);
                    }}
                    className="rounded-xl border border-border bg-background p-6 text-left hover:bg-secondary"
                  >
                    <div className="text-sm text-muted-foreground">
                      Sebelumnya
                    </div>
                    <div className="mt-1 font-medium">← Pengenalan LIGAKU</div>
                  </button>
                  <button
                    onClick={() => {
                      const currentIndex = documentationSections
                        .flatMap((s) => s.items)
                        .findIndex((item) => item.id === activeSection);
                      const nextItem =
                        documentationSections
                          .flatMap((s) => s.items)
                          [currentIndex + 1] || null;
                      if (nextItem) setActiveSection(nextItem.id);
                    }}
                    className="rounded-xl border border-border bg-background p-6 text-left hover:bg-secondary"
                  >
                    <div className="text-sm text-muted-foreground">
                      Selanjutnya
                    </div>
                    <div className="mt-1 font-medium">Manajemen Acara →</div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table of Contents */}
          <div className="lg:w-64">
            <div className="sticky top-24 rounded-xl border border-border bg-background p-6">
              <div className="mb-4 text-sm font-semibold text-muted-foreground">
                DAFTAR ISI
              </div>
              <nav className="space-y-1">
                {getTocForSection(activeSection).map((item, index) => (
                  <a
                    key={index}
                    href={`#${item.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>

              {/* Last Updated */}
              <div className="mt-8 border-t pt-6">
                <div className="text-xs text-muted-foreground">
                  <div className="mb-2">Terakhir diperbarui</div>
                  <div className="font-medium">2 Januari 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2">
                <FiBook className="h-5 w-5 text-primary" />
                <span className="font-bold">LIGAKU Docs</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                v2.1.0 • Updated regularly
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Data Structures
const documentationSections = [
  {
    id: "getting-started",
    title: "Memulai",
    icon: <FiHome className="h-4 w-4" />,
    items: [
      {
        id: "introduction",
        title: "Pengenalan LIGAKU",
        description: "Apa itu LIGAKU dan fitur utamanya",
      },
      {
        id: "installation",
        title: "Instalasi & Setup",
        description: "Panduan instalasi dan konfigurasi awal",
      },
      {
        id: "dashboard-overview",
        title: "Dashboard Overview",
        description: "Tur lengkap dashboard admin",
      },
    ],
  },
  {
    id: "user-guide",
    title: "Panduan Pengguna",
    icon: <FiUsers className="h-4 w-4" />,
    items: [
      {
        id: "event-management",
        title: "Manajemen Acara",
        description: "Membuat dan mengelola tournament",
      },
      {
        id: "team-management",
        title: "Manajemen Tim",
        description: "Mengelola tim dan pemain",
      },
      {
        id: "participant-management",
        title: "Manajemen Peserta",
        description: "Registrasi dan pengaturan peserta",
      },
      {
        id: "bracket-system",
        title: "Sistem Bracket",
        description: "Membuat dan mengelola bracket tournament",
      },
    ],
  },
  {
    id: "advanced",
    title: "Fitur Lanjutan",
    icon: <FiSettings className="h-4 w-4" />,
    items: [
      {
        id: "automation",
        title: "Otomatisasi",
        description: "Fitur otomatisasi tournament",
      },
      {
        id: "api-integration",
        title: "API Integration",
        description: "Integrasi dengan sistem eksternal",
      },
      {
        id: "customization",
        title: "Kustomisasi",
        description: "Kustomisasi tampilan dan fitur",
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "Pemecahan Masalah",
    icon: <FiAlertCircle className="h-4 w-4" />,
    items: [
      {
        id: "common-issues",
        title: "Masalah Umum",
        description: "Solusi untuk masalah yang sering terjadi",
      },
      {
        id: "error-codes",
        title: "Kode Error",
        description: "Daftar kode error dan solusinya",
      },
      {
        id: "performance",
        title: "Optimasi Performa",
        description: "Tips meningkatkan performa sistem",
      },
    ],
  },
];

// Content for each documentation section
function getDocumentationContent(sectionId: string) {
  const content: Record<string, JSX.Element> = {
    introduction: (
      <>
        <h2 id="what-is-ligaku">Apa itu LIGAKU?</h2>
        <p>
          LIGAKU adalah sistem manajemen tournament olahraga yang lengkap dan
          terintegrasi. Dibangun dengan teknologi modern, LIGAKU membantu Anda
          mengelola tournament dari awal hingga akhir dengan mudah.
        </p>

        <div className="my-6 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center gap-3">
            <FiCheckCircle className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Fitur Utama</h3>
          </div>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
              Sistem bracket otomatis
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
              Manajemen tim dan peserta
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
              Dashboard statistik real-time
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
              Notifikasi dan reminder otomatis
            </li>
          </ul>
        </div>

        <h2 id="getting-started">Memulai dengan LIGAKU</h2>
        <p>
          Untuk mulai menggunakan LIGAKU, ikuti langkah-langkah berikut:
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Registrasi Akun</strong> - Buat akun admin di halaman
            registrasi
          </li>
          <li>
            <strong>Verifikasi Email</strong> - Cek email Anda untuk verifikasi
          </li>
          <li>
            <strong>Setup Awal</strong> - Lengkapi profil dan pengaturan awal
          </li>
          <li>
            <strong>Buat Acara Pertama</strong> - Mulai dengan membuat tournament
            pertama Anda
          </li>
        </ol>

        <h2 id="system-requirements">Persyaratan Sistem</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Komponen</th>
                <th className="px-4 py-2 text-left">Minimum</th>
                <th className="px-4 py-2 text-left">Rekomendasi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">Browser</td>
                <td className="px-4 py-2">Chrome 80+</td>
                <td className="px-4 py-2">Chrome 100+</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">RAM</td>
                <td className="px-4 py-2">4GB</td>
                <td className="px-4 py-2">8GB+</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Koneksi</td>
                <td className="px-4 py-2">5 Mbps</td>
                <td className="px-4 py-2">10 Mbps+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    ),

    "event-management": (
      <>
        <h2 id="create-event">Membuat Acara Baru</h2>
        <p>
          Untuk membuat tournament baru, ikuti langkah-langkah berikut:
        </p>

        <div className="my-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-2 text-sm font-semibold">1. Informasi Dasar</div>
            <p className="text-sm text-muted-foreground">
              Isi nama acara, deskripsi, dan tanggal
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-2 text-sm font-semibold">2. Format Tournament</div>
            <p className="text-sm text-muted-foreground">
              Pilih sistem bracket atau kompetisi
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-2 text-sm font-semibold">3. Pengaturan Lanjut</div>
            <p className="text-sm text-muted-foreground">
              Atur rules, scoring, dan notifikasi
            </p>
          </div>
        </div>

        <h2 id="event-types">Jenis Tournament</h2>
        <p>LIGAKU mendukung berbagai jenis tournament:</p>

        <div className="my-6 space-y-4">
          <div className="rounded-xl border border-border bg-background p-6">
            <div className="flex items-center gap-3">
              <FiCrosshair className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Single Elimination</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Sistem gugur dimana tim yang kalah langsung tereliminasi. Cocok
              untuk tournament dengan banyak peserta.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-6">
            <div className="flex items-center gap-3">
              <FiGrid className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Round Robin</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Setiap tim bertanding melawan semua tim lainnya. Cocok untuk
              tournament dengan waktu yang cukup.
            </p>
          </div>
        </div>

        <h2 id="schedule-management">Manajemen Jadwal</h2>
        <p>
          Atur jadwal pertandingan dengan mudah menggunakan fitur drag & drop
          calendar.
        </p>
        <pre className="my-4 rounded-lg bg-secondary p-4 text-sm">
{`// Contoh konfigurasi jadwal
{
  "eventId": "tournament-2024",
  "schedule": {
    "startDate": "2024-01-15",
    "endDate": "2024-01-20",
    "matchDuration": 90,
    "breakTime": 30
  },
  "venues": ["Gedung A", "Gedung B"]
}`}
        </pre>
      </>
    ),

    "bracket-system": (
      <>
        <h2 id="bracket-types">Jenis Bracket yang Didukung</h2>
        <p>
          LIGAKU mendukung berbagai jenis bracket untuk kebutuhan tournament
          Anda:
        </p>

        <div className="my-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-6">
            <h3 className="mb-3 font-semibold">Single Elimination</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FiCheckCircle className="h-4 w-4 text-green-500" />
                Cocok untuk tournament besar
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="h-4 w-4 text-green-500" />
                Waktu tournament singkat
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="h-4 w-4 text-green-500" />
                Sistem sederhana dan jelas
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-background p-6">
            <h3 className="mb-3 font-semibold">Double Elimination</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FiCheckCircle className="h-4 w-4 text-green-500" />
                Tim punya kesempatan kedua
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="h-4 w-4 text-green-500" />
                Hasil lebih akurat
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="h-4 w-4 text-green-500" />
                Cocok untuk tournament penting
              </li>
            </ul>
          </div>
        </div>

        <h2 id="generate-bracket">Membuat Bracket Otomatis</h2>
        <p>
          Generate bracket otomatis berdasarkan jumlah tim yang terdaftar.
          Sistem akan secara otomatis membuat bracket yang sesuai.
        </p>

        <div className="my-6 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="mb-3 font-semibold">Alur Kerja Bracket</h3>
          <ol className="space-y-3">
            <li className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold">
                1
              </div>
              <span>Input jumlah tim</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold">
                2
              </div>
              <span>Generate bracket awal</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold">
                3
              </div>
              <span>Seeding (jika diperlukan)</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold">
                4
              </div>
              <span>Simpan dan publish</span>
            </li>
          </ol>
        </div>

        <h2 id="bracket-commands">Perintah Bracket</h2>
        <p>Beberapa perintah penting dalam manajemen bracket:</p>
        <div className="my-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Perintah</th>
                <th className="px-4 py-2 text-left">Deskripsi</th>
                <th className="px-4 py-2 text-left">Contoh</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-sm">/bracket new</td>
                <td className="px-4 py-2">Buat bracket baru</td>
                <td className="px-4 py-2 font-mono text-sm">
                  /bracket new 16-teams
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-sm">/bracket seed</td>
                <td className="px-4 py-2">Atur seeding</td>
                <td className="px-4 py-2 font-mono text-sm">
                  /bracket seed random
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-mono text-sm">/match result</td>
                <td className="px-4 py-2">Input hasil match</td>
                <td className="px-4 py-2 font-mono text-sm">
                  /match result 3-1
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  };

  return (
    content[sectionId] || (
      <div className="text-center py-12">
        <FiBook className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Dokumentasi tidak ditemukan</h3>
        <p className="mt-2 text-muted-foreground">
          Konten untuk bagian ini sedang dalam pengembangan.
        </p>
      </div>
    )
  );
}

// Table of Contents for each section
function getTocForSection(sectionId: string) {
  const toc: Record<string, Array<{ id: string; title: string }>> = {
    introduction: [
      { id: "what-is-ligaku", title: "Apa itu LIGAKU?" },
      { id: "getting-started", title: "Memulai dengan LIGAKU" },
      { id: "system-requirements", title: "Persyaratan Sistem" },
    ],
    "event-management": [
      { id: "create-event", title: "Membuat Acara Baru" },
      { id: "event-types", title: "Jenis Tournament" },
      { id: "schedule-management", title: "Manajemen Jadwal" },
    ],
    "bracket-system": [
      { id: "bracket-types", title: "Jenis Bracket yang Didukung" },
      { id: "generate-bracket", title: "Membuat Bracket Otomatis" },
      { id: "bracket-commands", title: "Perintah Bracket" },
    ],
  };

  return toc[sectionId] || [];
}
