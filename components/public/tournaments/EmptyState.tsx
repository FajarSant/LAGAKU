import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface EmptyStateProps {
  searchQuery: string;
  onResetSearch: () => void;
}

export function EmptyState({ searchQuery, onResetSearch }: EmptyStateProps) {
  return (
    <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <CardContent className="p-12 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
          <Trophy className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-2xl font-bold mb-3">
          Tidak ada turnamen ditemukan
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          {searchQuery
            ? `Tidak ada hasil untuk pencarian "${searchQuery}". Coba dengan kata kunci lain.`
            : "Belum ada turnamen yang tersedia."}
        </p>
        <Button
          onClick={onResetSearch}
          variant="outline"
          className="mx-auto"
        >
          Reset Pencarian
        </Button>
      </CardContent>
    </Card>
  );
}