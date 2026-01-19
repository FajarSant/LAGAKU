"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw, Users } from "lucide-react";
import { TeamWithDetails } from "@/utils";
import TeamCard from "./TeamCard";
import EmptyState from "./EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

interface TeamListProps {
  teams: TeamWithDetails[];
  loading: boolean;
  onRefresh: () => void;
  error: string | null;
  onCreateTeam: () => void;
}

export default function TeamList({ teams, loading, error, onRefresh, onCreateTeam }: TeamListProps) {
  if (loading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 border border-gray-200 dark:border-gray-800 shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="w-5 h-5" />
              Daftar Tim Saya
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Kelola semua tim yang Anda ikuti atau buat ({teams.length} tim)
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            
            <Button
              onClick={onCreateTeam}
              size="sm"
              className="gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <PlusCircle className="w-4 h-4" />
              Buat Tim
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {error ? (
          <div className="text-center py-8">
            <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
            <Button onClick={onRefresh} variant="outline">
              Coba Lagi
            </Button>
          </div>
        ) : teams.length === 0 ? (
          <div className="space-y-6">
            <EmptyState
              title="Belum Punya Tim"
              description="Anda belum menjadi anggota tim atau membuat tim sendiri."
            />
            
            <div className="text-center">
              <Button
                onClick={onCreateTeam}
                size="lg"
                className="px-8 py-6 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
              >
                <PlusCircle className="mr-2 w-5 h-5" />
                Buat Tim Pertama Anda
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Buat tim untuk ikut turnamen atau tunggu undangan dari tim lain
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} onRefresh={onRefresh} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}