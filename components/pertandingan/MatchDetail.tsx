"use client";

import { useQuery } from "@tanstack/react-query";
import ScoreBoard from "./ScoreBoard";
import { motion } from "framer-motion";
import type { Pertandingan } from "@/types/pertandingan";

interface Props {
  initialData: Pertandingan;
}

export default function MatchDetail({ initialData }: Props) {
  const fetcher = async (): Promise<Pertandingan> => {
    const res = await fetch(`/api/pertandingan/${initialData.id}`);
    return res.json();
  };

  const { data } = useQuery<Pertandingan>({
    queryKey: ["pertandingan", initialData.id],
    queryFn: fetcher,
    initialData,
    refetchInterval: 3000,
  });

  const p = data;

  return (
    <section className="max-w-5xl mx-auto p-6">
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {p.status === "berlangsung"
          ? "Pertandingan Sedang Berlangsung"
          : p.status === "selesai"
          ? "Hasil Pertandingan"
          : "Jadwal Pertandingan"}
      </motion.h1>

      <ScoreBoard pertandingan={p} />

      <div className="mt-10 p-6 rounded-xl bg-white shadow border">
        <h2 className="font-semibold text-xl mb-4">Informasi Pertandingan</h2>

        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="font-semibold">Acara</p>
            <p>{p.acara?.nama_acara}</p>
          </div>

          <div>
            <p className="font-semibold">Tanggal</p>
            <p>
              {p.tanggal_pertandingan
                ? new Date(p.tanggal_pertandingan).toLocaleString()
                : "-"}
            </p>
          </div>

          <div>
            <p className="font-semibold">Lokasi</p>
            <p>{p.lokasi_lapangan || "-"}</p>
          </div>

          <div>
            <p className="font-semibold">Durasi</p>
            <p>{p.durasi_menit} menit</p>
          </div>

          <div>
            <p className="font-semibold">Menit Saat Ini</p>
            <p>{p.menit_saat_ini}</p>
          </div>

          <div>
            <p className="font-semibold">Status</p>
            <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
              {p.status}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
