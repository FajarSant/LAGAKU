import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, PlusCircle } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[70vh] space-y-6">
      <Card className="w-full max-w-md border-dashed">
        <CardContent className="pt-12 pb-10 px-8 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Trophy className="h-8 w-8 text-blue-500" />
          </div>
          
          <h3 className="text-xl font-semibold mb-3">Belum Ada Pertandingan</h3>
          <p className="text-muted-foreground mb-8">
            Mulai dengan membuat pertandingan pertama Anda. Generate pertandingan 
            berdasarkan acara yang tersedia.
          </p>
          
          <Link href="/admin/pertandingan/tambah">
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700">
              <PlusCircle className="h-4 w-4" />
              Buat Pertandingan Pertama
            </Button>
          </Link>
          
          <p className="text-sm text-muted-foreground mt-6">
            Pastikan Anda telah membuat acara terlebih dahulu
          </p>
        </CardContent>
      </Card>
    </div>
  );
}