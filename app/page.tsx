"use client";

import { useState } from "react";
import StatusFilter from "@/components/home/StatusFilter";
import MatchesList from "@/components/home/MatchesList";
import Navigation from "@/components/navigation/navigation";
import FeaturesSection from "@/components/home/FeaturesSection";

export default function HomePage() {
  const [selectedStatus, setSelectedStatus] = useState("berlangsung");
  const [page, setPage] = useState(1);

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <Navigation />

      <StatusFilter
        selectedStatus={selectedStatus}
        setSelectedStatus={(v) => {
          setSelectedStatus(v);
          setPage(1); // Reset page saat tab diganti
        }}
      />

      <MatchesList
        selectedStatus={selectedStatus}
        page={page}
        setPage={setPage}
      />

      <FeaturesSection />

      <footer className="border-t p-6 text-center text-sm text-gray-500">
        © 2025 Turnamenku. All rights reserved.
      </footer>
    </div>
  );
}
