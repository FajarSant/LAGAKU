"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, X, UserPlus, Shield, Plus } from "lucide-react";
import { Acara, PlayerSearchResult, TeamMemberForm, Pengguna } from "@/utils";

interface Step2TeamMembersProps {
  anggotaTim: TeamMemberForm[];
  currentUser: Pengguna | null;
  isCaptain: boolean;
  searchResults: PlayerSearchResult[];
  searchingPlayers: boolean;
  selectedAcara: Acara | null;
  toggleCaptainStatus: (checked: boolean) => void;
  addPlayer: (player: PlayerSearchResult) => void;
  removePlayer: (nim: string) => void;
  updatePlayerInfo: (index: number, field: keyof TeamMemberForm, value: string) => void;
}

export default function Step2TeamMembers({
  anggotaTim,
  currentUser,
  isCaptain,
  searchResults,
  searchingPlayers,
  selectedAcara,
  toggleCaptainStatus,
  addPlayer,
  removePlayer,
  updatePlayerInfo
}: Step2TeamMembersProps) {
  const [playerSearch, setPlayerSearch] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerSearch(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-lg font-semibold">Anggota Tim</Label>
            <p className="text-sm text-gray-500 mt-1">
              Tambahkan anggota tim Anda ({anggotaTim.length} anggota)
            </p>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1">
            {anggotaTim.length} Anggota
          </Badge>
        </div>

        {/* Captain toggle */}
        {currentUser && (
          <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Checkbox
              id="is_captain"
              checked={isCaptain}
              onCheckedChange={(checked) => toggleCaptainStatus(checked as boolean)}
            />
            <Label htmlFor="is_captain" className="cursor-pointer">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{currentUser.nama}</span>
                <Badge variant="secondary" className="text-xs">
                  {currentUser.nim || "No NIM"}
                </Badge>
                <span className="text-gray-600 dark:text-gray-400">
                  (Saya akan menjadi bagian dari tim)
                </span>
              </div>
            </Label>
          </div>
        )}

        {/* Search Players */}
        <div className="space-y-3">
          <Label>Cari Anggota dari Database</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Cari berdasarkan NIM, nama, atau email..."
              value={playerSearch}
              onChange={handleSearchChange}
              className="h-12 pl-10"
            />
            {playerSearch && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => {
                  setPlayerSearch("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Search Results */}
          {searchingPlayers && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Mencari pemain...</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <Card className="border shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Hasil Pencarian</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-60 overflow-y-auto">
                  {searchResults.map((player) => (
                    <div
                      key={player.nim}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border-b last:border-b-0"
                      onClick={() => addPlayer(player)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {player.nama.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{player.nama}</p>
                          <p className="text-sm text-gray-500">
                            {player.nim} • {player.program_studi || "Belum ada jurusan"}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-blue-600">
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Manual Entry */}
        <div className="space-y-3">
          <Label>Tambah Anggota Manual</Label>
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-dashed"
            onClick={() => {
              const newIndex = anggotaTim.length;
              updatePlayerInfo(newIndex, 'nama_pemain', '');
              updatePlayerInfo(newIndex, 'nim', '');
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Anggota Baru
          </Button>
        </div>

        {/* Current Team Members */}
        {anggotaTim.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {anggotaTim.map((anggota, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      isCaptain && 
                      currentUser && 
                      anggota.nim === currentUser.nim
                        ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-gray-600 dark:text-gray-300">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs">Nama Lengkap</Label>
                            <Input
                              value={anggota.nama_pemain}
                              onChange={(e) => updatePlayerInfo(index, 'nama_pemain', e.target.value)}
                              placeholder="Nama pemain"
                              className="h-9"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">NIM</Label>
                            <Input
                              value={anggota.nim}
                              onChange={(e) => updatePlayerInfo(index, 'nim', e.target.value)}
                              placeholder="Nomor Induk Mahasiswa"
                              className="h-9"
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removePlayer(anggota.nim)}
                        disabled={!!(isCaptain && currentUser && anggota.nim === currentUser.nim)}
                        className={`ml-3 ${
                          isCaptain && currentUser && anggota.nim === currentUser.nim
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {isCaptain && currentUser && anggota.nim === currentUser.nim && (
                      <div className="flex items-center gap-2 mt-3 text-sm text-blue-600 dark:text-blue-400">
                        <Shield className="h-4 w-4" />
                        <span>Ketua Tim</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Alert className="bg-linear-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
        <AlertDescription className="text-amber-800 dark:text-amber-300">
          <strong>Catatan:</strong> Pastikan data anggota tim sudah benar. 
          Setelah terdaftar, anggota tidak dapat diubah.
        </AlertDescription>
      </Alert>
    </div>
  );
}