"use client";

import { MailCheck, RefreshCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ConfirmPage() {

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl shadow-lg dark:shadow-gray-900/30 p-6 text-center border dark:border-gray-700">

        {/* ICON */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
            <MailCheck className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Konfirmasi Email
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          Kami telah mengirimkan link verifikasi ke email Anda.
          Silakan cek kotak masuk atau folder spam untuk menyelesaikan pendaftaran.
        </p>

        {/* PESAN JIKA EMAIL TIDAK TERKIRIM */}
        <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-gray-600 dark:text-gray-300 text-sm">
          Jika email tidak terkirim, pastikan email yang Anda masukkan benar.
          Jika masih tidak menerima, coba daftar ulang.
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">

          {/* Resend Button (dummy, nanti bisa dihubungkan ke auth resend) */}
          <Button
            variant="outline"
            className="w-full flex gap-2 items-center justify-center border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RefreshCcw className="w-4 h-4" />
            Kirim Ulang Email
          </Button>

          {/* Back to login */}
          <Link href="/auth/login" className="block">
            <Button
              variant="ghost"
              className="w-full flex gap-2 items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </Button>
          </Link>

        </div>
      </div>
    </div>
  );
}