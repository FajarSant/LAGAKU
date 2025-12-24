// components/BracketHeader.tsx
import { ArrowLeft, RefreshCw, Trophy, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Acara, formatDate } from "@/utils";


interface BracketHeaderProps {
  acara: Acara;
  onBack: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export function BracketHeader({ acara, onBack, onRefresh, loading }: BracketHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          size="sm" 
          className="h-8 px-3 self-start sm:self-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Kembali ke Daftar</span>
        </Button>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            Dibuat: {formatDate(acara.dibuat_pada)}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={onRefresh} 
                  size="sm" 
                  className="h-8"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Muat ulang data bracket</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-600/10">
            <Trophy className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{acara.nama}</h1>
            {acara.deskripsi && (
              <div className="flex items-start gap-2 mt-2 text-muted-foreground">
                <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{acara.deskripsi}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}