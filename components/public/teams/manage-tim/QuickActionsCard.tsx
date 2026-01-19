"use client";

import { UserPlus, Edit, Trash2, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamData } from "@/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";

interface QuickActionsCardProps {
  team: TeamData;
  userRole: 'ketua' | 'anggota' | 'non-anggota';
  onJoinTeam: () => Promise<void> | void;
  onLeaveTeam: () => Promise<void> | void;
  onEditTeam: () => void;
  onDeleteTeam: () => Promise<void> | void;
  onShareTeam: () => void;
  onViewTournament?: () => void;
}

export function QuickActionsCard({
  team,
  userRole,
  onJoinTeam,
  onLeaveTeam,
  onEditTeam,
  onDeleteTeam,
  onShareTeam,
  onViewTournament
}: QuickActionsCardProps) {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinTeam = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Sedang bergabung dengan tim...");
    
    try {
      await onJoinTeam();
      toast.success("Berhasil bergabung dengan tim", {
        id: toastId,
        description: "Anda sekarang menjadi anggota tim.",
      });
    } catch (error) {
      toast.error("Gagal bergabung dengan tim", {
        id: toastId,
        description: "Terjadi kesalahan saat bergabung dengan tim.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Sedang keluar dari tim...");
    
    try {
      await onLeaveTeam();
      setShowLeaveDialog(false);
      toast.success("Berhasil keluar dari tim", {
        id: toastId,
        description: "Anda telah keluar dari tim.",
      });
    } catch (error) {
      toast.error("Gagal keluar dari tim", {
        id: toastId,
        description: "Terjadi kesalahan saat keluar dari tim.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Sedang menghapus tim...");
    
    try {
      await onDeleteTeam();
      setShowDeleteDialog(false);
      toast.success("Tim berhasil dihapus", {
        id: toastId,
        description: "Tim telah dihapus secara permanen.",
      });
    } catch (error) {
      toast.error("Gagal menghapus tim", {
        id: toastId,
        description: "Terjadi kesalahan saat menghapus tim.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareTeam = () => {
    onShareTeam();
    toast.success("Tautan tim disalin", {
      description: "Tautan tim berhasil disalin ke clipboard.",
    });
  };

  return (
    <>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>
            Kelola tim dengan mudah
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {userRole === 'non-anggota' ? (
            <Button 
              onClick={handleJoinTeam}
              disabled={isLoading}
              className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            >
              <UserPlus className="w-4 h-4" />
              {isLoading ? "Memproses..." : "Bergabung dengan Tim"}
            </Button>
          ) : (
            <Button 
              onClick={() => setShowLeaveDialog(true)}
              variant="outline"
              disabled={isLoading}
              className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
            >
              Keluar dari Tim
            </Button>
          )}

          {userRole === 'ketua' && (
            <>
              <Button 
                variant="outline"
                className="w-full gap-2"
                onClick={onEditTeam}
                disabled={isLoading}
              >
                <Edit className="w-4 h-4" />
                Edit Informasi
              </Button>
              <Button 
                variant="outline"
                className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4" />
                Hapus Tim
              </Button>
            </>
          )}

          <Button 
            variant="ghost"
            className="w-full gap-2"
            onClick={handleShareTeam}
            disabled={isLoading}
          >
            <Share2 className="w-4 h-4" />
            Bagikan Tim
          </Button>

          {team.acara && onViewTournament && (
            <Button 
              variant="outline"
              className="w-full gap-2"
              onClick={onViewTournament}
              disabled={isLoading}
            >
              <ExternalLink className="w-4 h-4" />
              Lihat Turnamen
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Dialog Konfirmasi Keluar Tim */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Keluar Tim</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari tim <strong>{team.nama}</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveTeam}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Memproses..." : "Ya, Keluar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Konfirmasi Hapus Tim */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tim Permanen</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus tim <strong>{team.nama}</strong> secara permanen. 
              Semua data tim, anggota, dan riwayat akan hilang. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeam}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Menghapus..." : "Ya, Hapus Permanen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}