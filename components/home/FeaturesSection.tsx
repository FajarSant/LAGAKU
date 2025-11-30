"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCalendar, FaUsers } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { createClient } from "@/lib/supabase/client";

export default function FeaturesSection() {
  const supabase = createClient();
  const [userRole, setUserRole] = useState<string | null>(null);

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
    fetchUserRole();
  }, []);

  return (
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
  );
}
