"use client";

import Navigation from "@/components/navigation/navigation";
import RegisterTeamContainer from "@/components/public/register/RegisterTeamContainer";

export default function RegisterTeamPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:bg-linear-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <RegisterTeamContainer />
    </div>
  );
}