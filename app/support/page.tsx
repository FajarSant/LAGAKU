"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiHelpCircle,
  FiBookOpen,
  FiVideo,
  FiUsers,
  FiStar,
} from "react-icons/fi";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
    priority: "normal",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulasi API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({
      name: "",
      email: "",
      category: "",
      subject: "",
      message: "",
      priority: "normal",
    });

    // Reset success message setelah 5 detik
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const supportCategories = [
    {
      icon: <FiHelpCircle className="h-6 w-6" />,
      title: "Bantuan Teknis",
      description: "Masalah teknis, bug, atau error sistem",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      icon: <FiBookOpen className="h-6 w-6" />,
      title: "Panduan Penggunaan",
      description: "Tutorial dan panduan fitur aplikasi",
      color: "bg-green-500/10 text-green-500",
    },
    {
      icon: <FiUsers className="h-6 w-6" />,
      title: "Manajemen Akun",
      description: "Pengaturan akun, login, dan keamanan",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      icon: <FiStar className="h-6 w-6" />,
      title: "Saran & Feedback",
      description: "Kritik, saran, dan pengembangan fitur",
      color: "bg-yellow-500/10 text-yellow-500",
    },
  ];

  const faqs = [
    {
      question: "Bagaimana cara reset password?",
      answer:
        "Kunjungi halaman login, klik 'Lupa Password', dan ikuti instruksi yang dikirim ke email Anda.",
    },
    {
      question: "Berapa lama waktu respon tim support?",
      answer:
        "Tim kami merespon dalam 1-2 jam kerja. Untuk urgent issues, gunakan prioritas tinggi.",
    },
    {
      question: "Apakah ada biaya untuk layanan support?",
      answer:
        "Layanan support dasar gratis. Untuk konsultasi khusus, tersedia paket premium.",
    },
    {
      question: "Bagaimana cara melaporkan bug?",
      answer:
        "Gunakan form di bawah dengan kategori 'Bantuan Teknis' dan lampirkan screenshot jika memungkinkan.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-background to-primary/5 py-12">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Pusat Bantuan & Support
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Kami siap membantu Anda 24/7. Temukan solusi cepat atau hubungi
              tim support kami untuk bantuan lebih lanjut.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border/50 bg-background/50 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center justify-center">
                  <FiClock className="h-8 w-8 text-primary" />
                </div>
                <div className="text-sm font-medium">Response Time</div>
                <div className="text-2xl font-bold">1-2 Hours</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-background/50 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center justify-center">
                  <FiCheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-sm font-medium">Satisfaction Rate</div>
                <div className="text-2xl font-bold">98%</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-background/50 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center justify-center">
                  <FiUsers className="h-8 w-8 text-purple-500" />
                </div>
                <div className="text-sm font-medium">Active Support</div>
                <div className="text-2xl font-bold">24/7</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">Butuh Bantuan Cepat?</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <a
                href="mailto:support@ligaku.com"
                className="group flex flex-col items-center justify-center rounded-xl border-2 border-primary/20 bg-background p-6 text-center transition-all hover:scale-105 hover:border-primary hover:bg-primary/5"
              >
                <div className="mb-3 rounded-full bg-primary/10 p-3">
                  <FiMail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Email Support</h3>
                <p className="text-sm text-muted-foreground">
                  support@ligaku.com
                </p>
              </a>

              <a
                href="tel:+6281234567890"
                className="group flex flex-col items-center justify-center rounded-xl border-2 border-blue-500/20 bg-background p-6 text-center transition-all hover:scale-105 hover:border-blue-500 hover:bg-blue-500/5"
              >
                <div className="mb-3 rounded-full bg-blue-500/10 p-3">
                  <FiPhone className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="mb-2 font-semibold">Telepon</h3>
                <p className="text-sm text-muted-foreground">+62 812-3456-7890</p>
              </a>

              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center rounded-xl border-2 border-green-500/20 bg-background p-6 text-center transition-all hover:scale-105 hover:border-green-500 hover:bg-green-500/5"
              >
                <div className="mb-3 rounded-full bg-green-500/10 p-3">
                  <FiMessageSquare className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="mb-2 font-semibold">WhatsApp</h3>
                <p className="text-sm text-muted-foreground">Chat Langsung</p>
              </a>

              <Link
                href="/docs"
                className="group flex flex-col items-center justify-center rounded-xl border-2 border-purple-500/20 bg-background p-6 text-center transition-all hover:scale-105 hover:border-purple-500 hover:bg-purple-500/5"
              >
                <div className="mb-3 rounded-full bg-purple-500/10 p-3">
                  <FiVideo className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="mb-2 font-semibold">Video Tutorial</h3>
                <p className="text-sm text-muted-foreground">Panduan Visual</p>
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">Kategori Bantuan</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {supportCategories.map((category, index) => (
                <div
                  key={index}
                  className="group cursor-pointer rounded-xl border border-border bg-background p-6 transition-all hover:scale-105 hover:shadow-lg"
                >
                  <div className="mb-4">
                    <div className={`inline-flex rounded-lg p-3 ${category.color}`}>
                      {category.icon}
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">
              Pertanyaan yang Sering Diajukan
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-background p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <FiAlertCircle className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-border bg-background p-8 shadow-lg">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold">Kirim Permintaan Bantuan</h2>
              <p className="text-muted-foreground">
                Isi form di bawah dan tim kami akan menghubungi Anda segera
              </p>
            </div>

            {submitSuccess && (
              <div className="mb-6 rounded-xl bg-green-500/10 p-4">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-500">
                      Permintaan berhasil dikirim!
                    </p>
                    <p className="text-sm text-green-500/80">
                      Tim support akan menghubungi Anda dalam 1-2 jam kerja.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Masukkan nama Anda"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Pilih kategori</option>
                    <option value="technical">Bantuan Teknis</option>
                    <option value="account">Manajemen Akun</option>
                    <option value="billing">Pembayaran</option>
                    <option value="feature">Fitur & Pengembangan</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Prioritas
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="low">Rendah</option>
                    <option value="normal">Normal</option>
                    <option value="high">Tinggi</option>
                    <option value="urgent">Sangat Mendesak</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Subjek</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Masukkan subjek permintaan"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Detail Permintaan
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Jelaskan masalah atau permintaan Anda secara detail..."
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Tim support akan merespon dalam 1-2 jam kerja
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-gradient-to-r from-primary to-primary/80 px-8 py-3 font-medium text-primary-foreground transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Mengirim...
                    </span>
                  ) : (
                    "Kirim Permintaan"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Additional Resources */}
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Sumber Daya Tambahan</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-background p-6">
                <h3 className="mb-3 font-semibold">📚 Dokumentasi</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Panduan lengkap penggunaan semua fitur LIGAKU
                </p>
                <Link
                  href="/docs"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Baca Dokumentasi →
                </Link>
              </div>

              <div className="rounded-xl border border-border bg-background p-6">
                <h3 className="mb-3 font-semibold">🎥 Tutorial Video</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Pelajari melalui video tutorial step-by-step
                </p>
                <Link
                  href="/tutorials"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Tonton Tutorial →
                </Link>
              </div>

              <div className="rounded-xl border border-border bg-background p-6">
                <h3 className="mb-3 font-semibold">💬 Komunitas</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Bergabung dengan komunitas pengguna LIGAKU
                </p>
                <a
                  href="https://community.ligaku.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Gabung Komunitas →
                </a>
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
              <h3 className="text-lg font-bold">LIGAKU Support</h3>
              <p className="text-sm text-muted-foreground">
                Selalu siap membantu Anda mencapai yang terbaik
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Beranda
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} LIGAKU - Tournament Management System.
            All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}