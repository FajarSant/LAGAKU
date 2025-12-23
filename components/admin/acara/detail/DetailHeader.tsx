import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiArrowLeft, FiEdit, FiTrash2, FiShare2, FiCopy, FiType } from "react-icons/fi";
import { Acara, ConfigItem } from "@/constants/config";

interface DetailHeaderProps {
  acara: Acara;
  jenisAcaraConfig: ConfigItem;
  statusAcaraConfig: ConfigItem | null;
  onShare: () => void;
  onCopyId: () => void;
  onDelete: () => void;
}

export default function DetailHeader({
  acara,
  jenisAcaraConfig,
  statusAcaraConfig,
  onShare,
  onCopyId,
  onDelete,
}: DetailHeaderProps) {
  return (
    <div className="relative mb-8">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-transparent to-purple-500/10 blur-3xl dark:from-blue-600/10 dark:to-purple-600/10"></div>
      
      {/* Main Card */}
      <div className="relative bg-card/50 backdrop-blur-sm border rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Section - Title & Info */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="bg-background hover:bg-secondary border rounded-xl w-12 h-12"
              asChild
            >
              <Link href="/acara">
                <FiArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {acara.nama}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-linear-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground font-mono">{acara.id}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-secondary"
                  onClick={onCopyId}
                  title="Salin ID"
                >
                  <FiCopy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="bg-background hover:bg-secondary border rounded-xl w-12 h-12"
              onClick={onShare}
              title="Bagikan"
            >
              <FiShare2 className="w-5 h-5" />
            </Button>
            <Button
              asChild
              className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-5 rounded-xl gap-2 dark:from-blue-500 dark:to-cyan-600"
            >
              <Link href={`/acara/edit/${acara.id}`}>
                <FiEdit className="w-4 h-4" />
                Edit
              </Link>
            </Button>
            <Button
              variant="destructive"
              className="bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-5 rounded-xl gap-2 dark:from-red-500 dark:to-rose-600"
              onClick={onDelete}
            >
              <FiTrash2 className="w-4 h-4" />
              Hapus
            </Button>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-3 mt-6">
          {/* Jenis Acara Badge */}
          <div className={`px-4 py-2 rounded-xl ${jenisAcaraConfig.bgGradient} flex items-center gap-2`}>
            <FiType className="w-4 h-4 text-white" />
            <span className="font-medium text-white">{jenisAcaraConfig.label}</span>
          </div>
          
          {/* Status Acara Badge */}
          {statusAcaraConfig && statusAcaraConfig.icon && (
            <div className={`px-4 py-2 rounded-xl ${statusAcaraConfig.bgGradient} flex items-center gap-2`}>
              {React.createElement(statusAcaraConfig.icon, { className: "w-4 h-4 text-white" })}
              <span className="font-medium text-white">{statusAcaraConfig.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}