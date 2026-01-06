import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterTeamHeader() {
  const router = useRouter();

  return (
    <div className="mb-8">
      <Button
        variant="ghost"
        className="mb-4 gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => router.push("/profile")}
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Profil
      </Button>

      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-xl mb-2">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Pendaftaran Tim Baru
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Daftarkan tim Anda untuk berpartisipasi dalam kompetisi
        </p>
      </div>
    </div>
  );
}