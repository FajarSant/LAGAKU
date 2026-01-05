"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiHome, FiArrowRight } from "react-icons/fi";

export default function NotFoundPage() {
  const [particles, setParticles] = useState<Array<{
    left: string;
    top: string;
    delay: string;
    duration: string;
  }>>([]);

  const [counter, setCounter] = useState(0);

  // Initialize particles on client only
  useEffect(() => {
    // Set counter animation
    const interval = setInterval(() => {
      setCounter((prev) => (prev < 404 ? prev + 4 : 404));
    }, 10);

    // Generate particles
    const generatedParticles = Array.from({ length: 15 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 7.5}s`,
      duration: `${3 + Math.random() * 5}s`,
    }));

    setParticles(generatedParticles);

    return () => clearInterval(interval);
  }, []);

  // Show loading state while particles are not initialized
  if (particles.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-background via-background to-primary/5 px-4">
      {/* Background effects - SERVER SIDE SAFE */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 animate-pulse rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 animate-pulse rounded-full bg-blue-500/10 blur-3xl delay-1000" />
      </div>

      {/* Floating elements - CLIENT SIDE ONLY */}
      <div className="absolute inset-0 -z-20">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 animate-float rounded-full bg-primary/20"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-6xl animate-fade-in">
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-background/80 backdrop-blur-xl p-8 shadow-2xl shadow-primary/10 md:p-12">
          <div className="relative grid gap-12 md:grid-cols-2">
            {/* Left side - 404 Animation */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                {/* Counting animation */}
                <div className="relative mb-8">
                  <div className="overflow-hidden rounded-2xl bg-linear-to-br from-background to-secondary/30 p-8 shadow-inner">
                    <div className="text-center">
                      <div className="mb-2 text-sm font-medium text-muted-foreground">
                        Mencari halaman...
                      </div>
                      <div className="text-8xl font-black tracking-tighter">
                        <span className="bg-linear-to-r from-primary via-primary/80 to-destructive bg-clip-text text-transparent">
                          {counter}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Halaman tidak ditemukan
                      </div>
                    </div>
                  </div>
                </div>

                {/* Illustration */}
                <div className="relative">
                  <div className="mx-auto h-48 w-48">
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
                    <div className="relative flex h-full w-full items-center justify-center rounded-full border-2 border-dashed border-primary/30">
                      <div className="text-center">
                        <div className="mb-2 text-4xl font-bold text-primary">404</div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Not Found
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                    Halaman Hilang di{" "}
                    <span className="bg-linear-to-r from-primary to-destructive bg-clip-text text-transparent">
                      Alam Semesta Digital
                    </span>
                  </h1>
                  <div className="mt-4 h-1 w-24 rounded-full bg-linear-to-r from-primary to-destructive" />
                </div>

                <p className="text-lg text-muted-foreground">
                  Sepertinya Anda telah mencapai batas akhir internet. Jangan
                  khawatir, bahkan penjelajah terbaik pun bisa tersesat. Mari
                  kami bantu Anda kembali ke jalur yang benar.
                </p>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Halaman", value: "500+" },
                    { label: "Pengguna", value: "10K+" },
                    { label: "Uptime", value: "99.9%" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border/50 bg-background/50 p-4 text-center"
                    >
                      <div className="text-2xl font-bold text-primary">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Possible solutions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  🛠️ Yang Dapat Anda Coba:
                </h3>
                <div className="grid gap-3">
                  {[
                    "Periksa kembali URL yang Anda ketik",
                    "Gunakan fitur pencarian di atas",
                    "Kunjungi halaman utama kami",
                    "Hubungi tim support jika perlu",
                  ].map((tip, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/50 p-3"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </div>
                      <span className="text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-4 pt-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link href="/">
                    <div className="group flex items-center justify-center gap-3 rounded-xl bg-linear-to-r from-primary to-primary/80 px-6 py-4 font-medium text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
                      <FiHome className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                      <span>Kembali ke Beranda</span>
                    </div>
                  </Link>

                  <button
                    onClick={() => window.history.back()}
                    className="group flex items-center justify-center gap-3 rounded-xl border-2 border-primary/30 bg-background px-6 py-4 font-medium text-primary transition-all hover:scale-105 hover:border-primary hover:bg-primary/5"
                  >
                    <span>Kembali Sebelumnya</span>
                    <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LIGAKU • Tournament Management System
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Jika Anda yakin ini adalah kesalahan,{" "}
            <Link href="/support" className="text-primary hover:underline">
              laporkan masalah
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}