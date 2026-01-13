import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalResults: number;
  totalTournaments: number;
}

export function SearchSection({
  searchQuery,
  onSearchChange,
  totalResults,
  totalTournaments,
}: SearchSectionProps) {
  return (
    <Card className="mb-10 border border-gray-200 dark:border-gray-800 shadow-xl rounded-2xl overflow-hidden">
      <div className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-1" />
      <CardContent className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Cari Turnamen</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Temukan turnamen yang sesuai dengan minat dan jadwal Anda
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Cari turnamen berdasarkan nama atau deskripsi..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 py-6 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Menampilkan{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {totalResults}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {totalTournaments}
              </span>{" "}
              turnamen
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}