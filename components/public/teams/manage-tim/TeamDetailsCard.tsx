"use client";

import { Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { TeamData } from "@/utils";

interface TeamDetailsCardProps {
  team: TeamData;
  onCopyId: () => void;
}

export function TeamDetailsCard({ team, onCopyId }: TeamDetailsCardProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Detail Tim</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">ID Tim</span>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {team.id.substring(0, 8)}...
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={onCopyId}
              className="h-6 w-6 p-0"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Tanggal Dibuat</span>
          <span className="text-sm font-medium">
            {new Date(team.dibuat_pada).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Jumlah Pemain</span>
          <span className="text-sm font-medium">{team.jumlah_pemain}</span>
        </div>
      </CardContent>
    </Card>
  );
}