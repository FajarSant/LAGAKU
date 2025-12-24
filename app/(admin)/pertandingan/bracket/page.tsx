"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Search,
  Trophy,
  Calendar,
  FileText,
  ChevronRight,
  Filter,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BracketListPage() {
  const supabase = createClient();
  const [acara, setAcara] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "mostMatches">("newest");

  useEffect(() => {
    fetchAcara();
  }, []);

  const fetchAcara = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("acara")
        .select(`
          id,
          nama,
          deskripsi,
          dibuat_pada,
          pertandingan:pertandingan(count)
        `)
        .order("dibuat_pada", { ascending: false });

      if (error) throw error;
      setAcara(data || []);
    } catch (error) {
      console.error("Error fetching acara:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedAcara = acara
    .filter((item) =>
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.dibuat_pada).getTime() - new Date(a.dibuat_pada).getTime();
        case "oldest":
          return new Date(a.dibuat_pada).getTime() - new Date(b.dibuat_pada).getTime();
        case "mostMatches":
          return (b.pertandingan?.[0]?.count || 0) - (a.pertandingan?.[0]?.count || 0);
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Bracket Turnamen</h1>
              <p className="text-muted-foreground">
                Lihat dan kelola bracket dari setiap acara turnamen
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari turnamen berdasarkan nama atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="oldest">Terlama</SelectItem>
                <SelectItem value="mostMatches">Pertandingan Terbanyak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden border">
                <CardHeader className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAndSortedAcara.length === 0 ? (
          <Alert className="border-dashed">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {searchQuery
                ? `Tidak ditemukan turnamen dengan kata kunci "${searchQuery}"`
                : "Belum ada turnamen tersedia. Buat turnamen baru untuk memulai."}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedAcara.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-md bg-primary/10">
                          <Trophy className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-lg line-clamp-1">
                          {item.nama}
                        </CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {item.deskripsi || "Turnamen sistem gugur"}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="shrink-0 bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {item.pertandingan?.[0]?.count || 0} Match
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Dibuat: {formatDate(item.dibuat_pada)}</span>
                    </div>
                    {item.deskripsi && (
                      <div className="flex items-start gap-2 text-sm">
                        <FileText className="h-3.5 w-3.5 mt-0.5 text-muted-foreground" />
                        <span className="text-muted-foreground line-clamp-2">
                          {item.deskripsi}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-3 border-t">
                  <Link 
                    href={`/pertandingan/bracket/${item.id}`} 
                    className="w-full"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full justify-between group-hover:border-primary group-hover:text-primary"
                    >
                      <span>Lihat Bracket</span>
                      <ChevronRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {!loading && acara.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Menampilkan {filteredAndSortedAcara.length} dari {acara.length} turnamen
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">
                    Total match: {acara.reduce((acc, item) => acc + (item.pertandingan?.[0]?.count || 0), 0)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-secondary" />
                  <span className="text-muted-foreground">
                    Dibuat: {formatDate(new Date().toISOString())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}