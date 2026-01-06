import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { ArrowLeft, Trophy } from "lucide-react";

interface RegisterTeamFooterProps {
  step: number;
  loading: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: () => void;
}

export default function RegisterTeamFooter({
  step,
  loading,
  onPrevStep,
  onNextStep,
  onSubmit,
}: RegisterTeamFooterProps) {
  return (
    <CardFooter className="border-t bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
      <div className="flex justify-between w-full">
        <div>
          {step > 1 && (
            <Button
              variant="outline"
              onClick={onPrevStep}
              disabled={loading}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          {step < 3 ? (
            <Button
              onClick={onNextStep}
              className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {step === 2 ? "Konfirmasi" : "Lanjut"}
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          ) : (
            <Button
              onClick={onSubmit}
              disabled={loading}
              className="gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/25"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Mendaftarkan...
                </>
              ) : (
                <>
                  <Trophy className="h-4 w-4" />
                  Daftarkan Tim
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </CardFooter>
  );
}