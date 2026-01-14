"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import EmptyState from "./EmptyState";
import TeamCard from "./TeamCard";
import { TeamWithDetails } from "@/utils";

interface TeamListProps {
  teams: TeamWithDetails[];
  loading: boolean;
  onRefresh: () => void;
  error?: string | null;
}

export default function TeamList({ teams, loading, onRefresh, error }: TeamListProps) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredTeams = teams.filter(team => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return team.status === "aktif";
    if (activeTab === "eliminated") return team.status === "gugur";
    return true;
  });

  if (loading) {
    return (
      <Card className="border border-gray-200 dark:border-gray-800 shadow-lg mb-8">
        <CardHeader className="pb-4 my-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Daftar Tim
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Memuat data tim...
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border border-gray-200 dark:border-gray-800 shadow-lg mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-red-600 dark:text-red-400">
            <AlertCircle className="w-6 h-6 mr-2" />
            <p>{error}</p>
            <Button variant="outline" className="ml-4" onClick={onRefresh}>
              Coba Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-lg mb-8">
      <CardHeader className="pb-4 my-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Daftar Tim
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Kelola tim Anda dengan filter status
            </CardDescription>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100 dark:bg-gray-800">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Semua
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                Aktif
              </TabsTrigger>
              <TabsTrigger
                value="eliminated"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                Gugur
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mt-0">
          {filteredTeams.length === 0 ? (
            <EmptyState 
              title={activeTab === "all" ? "Belum ada tim" : `Tidak ada tim ${activeTab === "active" ? "aktif" : "gugur"}`}
              description={activeTab === "all" 
                ? "Anda belum tergabung dalam tim apa pun." 
                : `Tidak ada tim dengan status ${activeTab === "active" ? "aktif" : "gugur"}.`
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map(team => (
                <TeamCard key={team.id} team={team} onRefresh={onRefresh} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}