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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen bg-linear-to-b from-background to-secondary/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-r from-primary/5 via-background to-primary/5 py-12">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              <span className="bg-linear-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Pusat Bantuan & Support
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Kami siap membantu Anda 24/7. Temukan solusi cepat atau hubungi
              tim support kami untuk bantuan lebih lanjut.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center justify-center">
                    <FiClock className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center text-sm font-medium">Response Time</div>
                  <div className="text-center text-2xl font-bold">1-2 Hours</div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center justify-center">
                    <FiCheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="text-center text-sm font-medium">Satisfaction Rate</div>
                  <div className="text-center text-2xl font-bold">98%</div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center justify-center">
                    <FiUsers className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="text-center text-sm font-medium">Active Support</div>
                  <div className="text-center text-2xl font-bold">24/7</div>
                </CardContent>
              </Card>
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
              <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <FiMail className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="mb-2 text-lg">Email Support</CardTitle>
                  <CardDescription>support@ligaku.com</CardDescription>
                  <Button variant="ghost" className="mt-4 w-full" asChild>
                    <a href="mailto:support@ligaku.com">Kirim Email</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group cursor-pointer transition-all hover:border-blue-500 hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="rounded-full bg-blue-500/10 p-3">
                      <FiPhone className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                  <CardTitle className="mb-2 text-lg">Telepon</CardTitle>
                  <CardDescription>+62 812-3456-7890</CardDescription>
                  <Button variant="ghost" className="mt-4 w-full" asChild>
                    <a href="tel:+6281234567890">Hubungi</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group cursor-pointer transition-all hover:border-green-500 hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="rounded-full bg-green-500/10 p-3">
                      <FiMessageSquare className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                  <CardTitle className="mb-2 text-lg">WhatsApp</CardTitle>
                  <CardDescription>Chat Langsung</CardDescription>
                  <Button variant="ghost" className="mt-4 w-full" asChild>
                    <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                      Chat Sekarang
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group cursor-pointer transition-all hover:border-purple-500 hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="rounded-full bg-purple-500/10 p-3">
                      <FiVideo className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                  <CardTitle className="mb-2 text-lg">Video Tutorial</CardTitle>
                  <CardDescription>Panduan Visual</CardDescription>
                  <Button variant="ghost" className="mt-4 w-full" asChild>
                    <Link href="/docs">Lihat Tutorial</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">Kategori Bantuan</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {supportCategories.map((category, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                >
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <div
                        className={`inline-flex rounded-lg p-3 ${category.color}`}
                      >
                        {category.icon}
                      </div>
                    </div>
                    <CardTitle className="mb-2">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardContent>
                </Card>
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
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <FiAlertCircle className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="mb-2 text-base">{faq.question}</CardTitle>
                        <CardDescription>{faq.answer}</CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Kirim Permintaan Bantuan</CardTitle>
              <CardDescription>
                Isi form di bawah dan tim kami akan menghubungi Anda segera
              </CardDescription>
            </CardHeader>

            <CardContent>
              {submitSuccess && (
                <Alert className="mb-6 border-green-500/20 bg-green-500/10">
                  <FiCheckCircle className="h-5 w-5 text-green-500" />
                  <AlertDescription>
                    <div className="font-medium text-green-500">
                      Permintaan berhasil dikirim!
                    </div>
                    <div className="text-sm text-green-500/80">
                      Tim support akan menghubungi Anda dalam 1-2 jam kerja.
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Masukkan nama Anda"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                      name="category"
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Bantuan Teknis</SelectItem>
                        <SelectItem value="account">Manajemen Akun</SelectItem>
                        <SelectItem value="billing">Pembayaran</SelectItem>
                        <SelectItem value="feature">Fitur & Pengembangan</SelectItem>
                        <SelectItem value="other">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioritas</Label>
                    <Select
                      name="priority"
                      value={formData.priority}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih prioritas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Rendah</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">Tinggi</SelectItem>
                        <SelectItem value="urgent">Sangat Mendesak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subjek</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan subjek permintaan"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Detail Permintaan</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Jelaskan masalah atau permintaan Anda secara detail..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Tim support akan merespon dalam 1-2 jam kerja
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Mengirim...
                      </span>
                    ) : (
                      "Kirim Permintaan"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
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
          <Separator className="my-6" />
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} LIGAKU - Tournament Management System.
            All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}