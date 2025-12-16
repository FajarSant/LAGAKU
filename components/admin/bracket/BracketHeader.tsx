import { Button } from "@/components/ui/button";
import { Trophy, ArrowLeft, RefreshCw } from "lucide-react";

interface BracketHeaderProps {
  acara: {
    nama: string;
    deskripsi?: string;
  };
  onBack: () => void;
  onRefresh: () => void;
}

export default function BracketHeader({ acara, onBack, onRefresh }: BracketHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          size="sm"
          className="h-8 px-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Kembali</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={onRefresh}
          size="sm"
          className="h-8"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h1 className="text-2xl font-bold">{acara.nama}</h1>
        </div>
        
        {acara.deskripsi && (
          <p className="text-gray-600">{acara.deskripsi}</p>
        )}
      </div>
    </div>
  );
}