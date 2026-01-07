import { Button } from "@/components/ui/button";
import { RefreshCw, FilterX } from "lucide-react";

interface ScheduleHeaderProps {
  onRefresh: () => void;
  onClearFilters: () => void;
  hasFilters: boolean;
}

export default function ScheduleHeader({ 
  onRefresh, 
  onClearFilters,
  hasFilters 
}: ScheduleHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Jadwal Pertandingan
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Pantau jadwal pertandingan turnamen yang sedang berlangsung dan akan datang
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex items-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FilterX className="w-4 h-4" />
              Hapus Filter
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onRefresh}
            className="flex items-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}