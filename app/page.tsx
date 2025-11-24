"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { FaCalendar, FaUsers } from "react-icons/fa";
import { MdGridView } from "react-icons/md";

export default function HomePage() {
  const supabase = createClient();

  const [matches, setMatches] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Ambil data pertandingan
  const fetchMatches = async () => {
    const { data } = await supabase
      .from("pertandingan")
      .select("*")
      .order("waktu", { ascending: true });

    setMatches(data || []);
  };

  // Ambil role user
  const fetchUserRole = async () => {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;

    if (!user) return setUserRole(null);

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    setUserRole(profile?.role || null);
  };

  useEffect(() => {
    Promise.all([fetchMatches(), fetchUserRole()]).then(() =>
      setLoading(false)
    );
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-white">
      {/* ================= HEADER ================= */}
      <header className="border-b p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">Turnamenku</h1>
        <nav className="space-x-4 hidden md:block">
          <Link href="/">Home</Link>
          <Link href="/jadwal">Jadwal</Link>
          <Link href="/pertandingan">Pertandingan</Link>
          <Link href="/register-team">Registrasi Tim</Link>
        </nav>

        <div className="flex gap-2">
          <Link href="/login" className="text-sm">
            Login
          </Link>
          <Link
            href="/register"
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
          >
            Register
          </Link>
        </div>
      </header>

      {/* ================= REAL-TIME MATCH ================= */}
      <section className="p-6">
        <h2 className="text-center font-bold text-2xl mb-6">
          Pertandingan Real-time
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {matches.map((m, i) => (
            <div
              key={i}
              className="border rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <p className="text-xs text-blue-600 font-semibold">
                {m.status === "live"
                  ? "Live"
                  : m.status === "selesai"
                  ? "Selesai"
                  : "Belum Dimulai"}
              </p>

              <h3 className="font-bold mt-2">
                {m.tim_home} VS {m.tim_away}
              </h3>

              <p className="text-3xl font-bold mt-3">
                {m.skor_home} - {m.skor_away}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {new Date(m.waktu).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= STATUS FILTER ================= */}
      <section className="p-6">
        <h3 className="font-bold text-lg mb-3">Status Pertandingan</h3>
        <div className="flex gap-4">
          <span className="px-4 py-1 rounded-full bg-blue-600 text-white text-sm">
            Live
          </span>
          <span className="px-4 py-1 rounded-full bg-gray-200 text-sm cursor-pointer">
            Selesai
          </span>
          <span className="px-4 py-1 rounded-full bg-gray-200 text-sm cursor-pointer">
            Akan Datang
          </span>
        </div>
      </section>

      {/* ================= FITUR ================= */}
      <section className="p-6 bg-gray-50">
        <h2 className="text-center font-bold text-2xl mb-6">
          Fitur Unggulan Turnamenku
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow rounded-xl">
            <FaCalendar className="text-blue-600 text-3xl" />
            <h4 className="font-bold mt-3">Generate Jadwal Otomatis</h4>
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <FaUsers className="text-blue-600 text-3xl" />
            <h4 className="font-bold mt-3">Registrasi Tim Mudah</h4>
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <MdGridView className="text-blue-600 text-3xl" />
            <h4 className="font-bold mt-3">Admin Dashboard</h4>

            {userRole !== "admin" && (
              <p className="text-red-500 text-sm mt-2">Hanya untuk Admin</p>
            )}

            {userRole === "admin" && (
              <Link
                href="/admin"
                className="text-blue-600 underline text-sm mt-2 block"
              >
                Kelola Sistem
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t p-6 text-center text-sm text-gray-500">
        © 2025 Turnamenku. All rights reserved.
      </footer>
    </div>
  );
}
