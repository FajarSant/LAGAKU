"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw, Users, Filter, Search, AlertCircle } from "lucide-react";
import { TeamWithDetails } from "@/utils";
import TeamCard from "./TeamCard";
import EmptyState from "./EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface TeamListProps {
  teams: TeamWithDetails[];
  loading: boolean;
  onRefresh: () => void;
  error: string | null;
  onCreateTeam: () => void;
  onDeleteTeam: (teamId: string) => void;
}

type TeamStatus = 'aktif' | 'nonaktif' | 'semua';
type SortOption = 'nama' | 'dibuat' | 'anggota' | 'pertandingan';

export default function TeamList({ 
  teams, 
  loading, 
  error, 
  onRefresh, 
  onCreateTeam, 
  onDeleteTeam 
}: TeamListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TeamStatus>('semua');
  const [sortOption, setSortOption] = useState<SortOption>('dibuat');
  const [filteredTeams, setFilteredTeams] = useState<TeamWithDetails[]>(teams);

  // Format date untuk sorting
  const getDateValue = (dateString?: string): number => {
    if (!dateString) return 0;
    try {
      return new Date(dateString).getTime();
    } catch {
      return 0;
    }
  };

  // Filter dan sort teams
  useEffect(() => {
    let result = [...teams];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(team =>
        team.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (team.acara?.nama?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        team.anggota_tim?.some(member => 
          member.nama_pemain.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (member.nim || '').includes(searchTerm)
        )
      );
    }

    // Apply status filter
    if (statusFilter !== 'semua') {
      result = result.filter(team => team.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'nama':
          return a.nama.localeCompare(b.nama);
        case 'dibuat':
          return getDateValue(b.dibuat_pada) - getDateValue(a.dibuat_pada);
        case 'anggota':
          return (b._count?.anggota_tim || 0) - (a._count?.anggota_tim || 0);
        case 'pertandingan':
          return (b._count?.pertandingan || 0) - (a._count?.pertandingan || 0);
        default:
          return 0;
      }
    });

    setFilteredTeams(result);
  }, [teams, searchTerm, statusFilter, sortOption]);

  // Hitung jumlah tim berdasarkan status
  const getStatusCount = (status: string) => {
    if (status === 'semua') return teams.length;
    return teams.filter(t => t.status === status).length;
  };

  const statusCounts = {
    aktif: getStatusCount('aktif'),
    nonaktif: getStatusCount('nonaktif'),
    semua: getStatusCount('semua')
  };

  if (loading) {
    return (
      <Card className="mb-8 border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
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
              {filteredTeams.length === teams.length 
                ? `Kelola semua tim yang Anda ikuti atau buat (${teams.length} tim)`
                : `Menampilkan ${filteredTeams.length} dari ${teams.length} tim`
              }
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            
            <Button
              onClick={onCreateTeam}
              size="sm"
              className="gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-sm hover:shadow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Buat Tim
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {/* Filters and Search */}
      <div className="px-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari tim, turnamen, atau anggota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchTerm('')}
              >
                ×
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Status
                  <Badge variant="secondary" className="ml-1">
                    {getStatusCount(statusFilter)}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={statusFilter === 'semua'}
                  onCheckedChange={() => setStatusFilter('semua')}
                >
                  Semua ({statusCounts.semua})
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === 'aktif'}
                  onCheckedChange={() => setStatusFilter('aktif')}
                >
                  Aktif ({statusCounts.aktif})
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === 'nonaktif'}
                  onCheckedChange={() => setStatusFilter('nonaktif')}
                >
                  Nonaktif ({statusCounts.nonaktif})
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  ↓↑
                  Urutkan
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={sortOption === 'dibuat'}
                  onCheckedChange={() => setSortOption('dibuat')}
                >
                  Terbaru
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === 'nama'}
                  onCheckedChange={() => setSortOption('nama')}
                >
                  Nama A-Z
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === 'anggota'}
                  onCheckedChange={() => setSortOption('anggota')}
                >
                  Jumlah Anggota
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortOption === 'pertandingan'}
                  onCheckedChange={() => setSortOption('pertandingan')}
                >
                  Pertandingan
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active filters indicator */}
        {(searchTerm || statusFilter !== 'semua') && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">Filter aktif:</span>
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                "Cari: {searchTerm}"
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setSearchTerm('')}
                >
                  ×
                </Button>
              </Badge>
            )}
            {statusFilter !== 'semua' && (
              <Badge variant="secondary" className="gap-1">
                Status: {statusFilter}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setStatusFilter('semua')}
                >
                  ×
                </Button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-xs"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('semua');
                setSortOption('dibuat');
              }}
            >
              Hapus semua filter
            </Button>
          </div>
        )}
      </div>

      <CardContent className="pt-6">
        {error ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-red-600 dark:text-red-400 mb-4 font-medium">{error}</div>
            <Button 
              onClick={onRefresh} 
              variant="outline"
              className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              Coba Lagi
            </Button>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="space-y-6">
            <EmptyState
              title={teams.length === 0 ? "Belum Punya Tim" : "Tidak Ada Hasil"}
              description={
                teams.length === 0 
                  ? "Anda belum menjadi anggota tim atau membuat tim sendiri."
                  : "Tidak ada tim yang cocok dengan pencarian Anda."
              }
            />
            
            <div className="text-center space-y-4">
              {teams.length === 0 ? (
                <Button
                  onClick={onCreateTeam}
                  size="lg"
                  className="px-8 py-6 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
                >
                  <PlusCircle className="mr-2 w-5 h-5" />
                  Buat Tim Pertama Anda
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('semua');
                    setSortOption('dibuat');
                  }}
                  variant="outline"
                  size="lg"
                >
                  Tampilkan Semua Tim
                </Button>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {teams.length === 0 
                  ? "Buat tim untuk ikut turnamen atau tunggu undangan dari tim lain"
                  : "Coba ubah kata kunci pencarian atau hapus filter"
                }
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeams.map((team) => (
                <TeamCard 
                  key={team.id} 
                  team={team} 
                  onRefresh={onRefresh}
                  onDeleteTeam={onDeleteTeam}
                />
              ))}
            </div>
            
            {/* Summary footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div>
                  Menampilkan <span className="font-semibold text-gray-700 dark:text-gray-300">{filteredTeams.length}</span> dari{' '}
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{teams.length}</span> tim
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Aktif: {statusCounts.aktif}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span>Nonaktif: {statusCounts.nonaktif}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}