"use client";

import type { Pertandingan } from "@/types/pertandingan";

export default function ScoreBoard({ pertandingan }: { pertandingan: Pertandingan }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border">
      <div className="grid grid-cols-3 items-center text-center">
        
        <div>
          <img
            src={pertandingan.peserta_tuan_rumah?.logo || "/placeholder.svg"}
            className="w-20 h-20 mx-auto"
          />
          <p className="font-semibold text-lg mt-2">
            {pertandingan.peserta_tuan_rumah?.nama_peserta}
          </p>
        </div>

        <div>
          <p className="text-5xl font-bold">
            {pertandingan.skor_tuan_rumah} : {pertandingan.skor_tamu}
          </p>

          {pertandingan.status === "berlangsung" && (
            <p className="text-green-600 font-semibold mt-2">
              {pertandingan.menit_saat_ini}' berjalan
            </p>
          )}

          {pertandingan.status === "selesai" && (
            <p className="text-gray-600 font-semibold mt-2">
              Pertandingan Selesai
            </p>
          )}

          {pertandingan.status === "dijadwalkan" && (
            <p className="text-gray-500 mt-2">Belum dimulai</p>
          )}
        </div>

        <div>
          <img
            src={pertandingan.peserta_tamu?.logo || "/placeholder.svg"}
            className="w-20 h-20 mx-auto"
          />
          <p className="font-semibold text-lg mt-2">
            {pertandingan.peserta_tamu?.nama_peserta}
          </p>
        </div>
      </div>
    </div>
  );
}
