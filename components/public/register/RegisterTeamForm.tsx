import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { 
  Acara, 
  PlayerSearchResult, 
  TeamMemberForm, 
  TeamRegistrationData,
  Pengguna 
} from "@/utils";
import Step1TeamInfo from "./Step1TeamInfo";
import Step2TeamMembers from "./Step2TeamMembers";
import Step3Confirmation from "./Step3Confirmation";

interface RegisterTeamFormProps {
  step: number;
  formData: TeamRegistrationData;
  anggotaTim: TeamMemberForm[];
  acaraList: Acara[];
  selectedAcara: Acara | null;
  currentUser: Pengguna | null;
  isCaptain: boolean;
  searchResults: PlayerSearchResult[];
  searchingPlayers: boolean;
  loadingAcara: boolean;
  updateFormData: (data: Partial<TeamRegistrationData>) => void;
  setSelectedAcara: (acara: Acara | null) => void;
  toggleCaptainStatus: (checked: boolean) => void;
  addPlayer: (player: PlayerSearchResult) => void;
  removePlayer: (nim: string) => void;
  updatePlayerInfo: (index: number, field: keyof TeamMemberForm, value: string) => void;
}

export default function RegisterTeamForm({
  step,
  formData,
  anggotaTim,
  acaraList,
  selectedAcara,
  currentUser,
  isCaptain,
  searchResults,
  searchingPlayers,
  loadingAcara,
  updateFormData,
  setSelectedAcara,
  toggleCaptainStatus,
  addPlayer,
  removePlayer,
  updatePlayerInfo
}: RegisterTeamFormProps) {
  const stepTitles = {
    1: "Informasi Dasar Tim",
    2: "Anggota Tim",
    3: "Konfirmasi Pendaftaran"
  };

  const stepDescriptions = {
    1: "Isi data tim Anda dengan lengkap",
    2: "Tambahkan anggota tim",
    3: "Tinjau ulang data sebelum mendaftar"
  };

  return (
    <Card className="border shadow-xl overflow-hidden">
      <CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-linear-to-br from-blue-500 to-purple-500 rounded-lg">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">
              {stepTitles[step as keyof typeof stepTitles]}
            </CardTitle>
            <CardDescription>
              {stepDescriptions[step as keyof typeof stepDescriptions]}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {step === 1 && (
          <Step1TeamInfo
            formData={formData}
            acaraList={acaraList}
            selectedAcara={selectedAcara}
            loadingAcara={loadingAcara}
            updateFormData={updateFormData}
            setSelectedAcara={setSelectedAcara}
          />
        )}

        {step === 2 && (
          <Step2TeamMembers
            anggotaTim={anggotaTim}
            currentUser={currentUser}
            isCaptain={isCaptain}
            searchResults={searchResults}
            searchingPlayers={searchingPlayers}
            selectedAcara={selectedAcara}
            toggleCaptainStatus={toggleCaptainStatus}
            addPlayer={addPlayer}
            removePlayer={removePlayer}
            updatePlayerInfo={updatePlayerInfo}
          />
        )}

        {step === 3 && (
          <Step3Confirmation
            formData={formData}
            anggotaTim={anggotaTim}
            selectedAcara={selectedAcara}
            isCaptain={isCaptain}
            currentUser={currentUser}
          />
        )}
      </CardContent>
    </Card>
  );
}