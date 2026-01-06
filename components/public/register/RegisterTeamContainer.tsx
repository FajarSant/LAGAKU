"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Components
import RegisterTeamProgress from "./RegisterTeamProgress";
import RegisterTeamForm from "./RegisterTeamForm";
import RegisterTeamFooter from "./RegisterTeamFooter";
import RegisterTeamHeader from "./RegisterTeamHeader";
import { useTeamRegistration } from "@/hooks/useTeamRegistration";

// Hooks

export default function RegisterTeamContainer() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  const {
    formData,
    anggotaTim,
    loading,
    loadingAcara,
    acaraList,
    selectedAcara,
    currentUser,
    isCaptain,
    searchResults,
    searchingPlayers,
    updateFormData,
    setSelectedAcara,
    setAnggotaTim,
    toggleCaptainStatus,
    addPlayer,
    removePlayer,
    updatePlayerInfo,
    validateStep1,
    validateStep2,
    handleSubmit
  } = useTeamRegistration();

  const nextStep = async () => {
    if (step === 1 && !(await validateStep1())) return;
    if (step === 2 && !validateStep2()) return;
    
    setStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = async () => {
    try {
      const success = await handleSubmit();
      if (success) {
        toast.success("Tim berhasil didaftarkan!");
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <RegisterTeamHeader />
      
      <RegisterTeamProgress step={step} />

      <div className="space-y-8">
        <RegisterTeamForm
          step={step}
          formData={formData}
          anggotaTim={anggotaTim}
          acaraList={acaraList}
          selectedAcara={selectedAcara}
          currentUser={currentUser}
          isCaptain={isCaptain}
          searchResults={searchResults}
          searchingPlayers={searchingPlayers}
          loadingAcara={loadingAcara}
          updateFormData={updateFormData}
          setSelectedAcara={setSelectedAcara}
          toggleCaptainStatus={toggleCaptainStatus}
          addPlayer={addPlayer}
          removePlayer={removePlayer}
          updatePlayerInfo={updatePlayerInfo}
        />

        <RegisterTeamFooter
          step={step}
          loading={loading}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          onSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
}