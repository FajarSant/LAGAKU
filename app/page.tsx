// app/(home)/page.tsx
import MatchesList from "@/components/home/MatchesList";
import StatusFilter from "@/components/home/StatusFilter";
import FeaturesSection from "@/components/home/FeaturesSection";
import Navigation from "@/components/navigation/navigation";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <Navigation />

      <MatchesList />
      <StatusFilter />
      <FeaturesSection />

      <footer className="border-t p-6 text-center text-sm text-gray-500">
        © 2025 Turnamenku. All rights reserved.
      </footer>
    </div>
  );
}
