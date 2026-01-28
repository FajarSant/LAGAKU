import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FiPlus, FiGrid, FiUsers, FiClock } from "react-icons/fi";

interface AcaraHeaderProps {
  acaraCount: number;
  filteredCount: number;
  onRefresh: () => void;
}

const formatTanggal = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function AcaraHeader({ 
  acaraCount, 
  filteredCount,
  onRefresh 
}: AcaraHeaderProps) {
  const lastUpdated = new Date().toLocaleDateString("id-ID");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Acara</h1>
          <p className="text-muted-foreground mt-2">
            Kelola semua acara dan turnamen Anda di satu tempat
          </p>
        </div>
        
        <Button asChild className="gap-2">
          <Link href="/admin/acara/tambah">
            <FiPlus className="h-4 w-4" />
            Tambah Acara
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FiGrid className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Acara</p>
                <p className="text-2xl font-bold">{acaraCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <FiUsers className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ditampilkan</p>
                <p className="text-2xl font-bold">{filteredCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <FiClock className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Terakhir Update</p>
                <p className="text-sm font-medium">
                  {lastUpdated}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}