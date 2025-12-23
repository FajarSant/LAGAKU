import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FiSearch, FiPlus } from "react-icons/fi";

interface EmptyStateProps {
  hasSearch: boolean;
  hasFilter: boolean;
  onAddNew: () => void;
}

export default function EmptyState({ 
  hasSearch, 
  hasFilter,
  onAddNew 
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="rounded-full bg-muted p-4">
            <FiSearch className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Tidak ada acara ditemukan
            </h3>
            <p className="text-muted-foreground max-w-md">
              {hasSearch || hasFilter 
                ? "Coba ubah kata kunci pencarian atau filter yang Anda gunakan."
                : "Mulai dengan membuat acara pertama Anda."
              }
            </p>
          </div>
          {(!hasSearch && !hasFilter) && (
            <Button asChild className="mt-4 gap-2">
              <Link href="/acara/tambah">
                <FiPlus className="h-4 w-4" />
                Buat Acara Pertama
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}