import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface SearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  onRefresh: () => void;
  acaraCount: number;
  filteredCount: number;
}

export default function SearchFilter({
  search,
  onSearchChange,

  onRefresh,
  acaraCount,
  filteredCount,
}: SearchFilterProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari acara berdasarkan nama atau deskripsi..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          title="Refresh data"
        >
          <FiRefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan <span className="font-semibold">{filteredCount}</span>{" "}
          dari <span className="font-semibold">{acaraCount}</span> acara
        </p>
      </div>
    </div>
  );
}
