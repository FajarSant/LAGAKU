interface RegisterTeamProgressProps {
  step: number;
}

export default function RegisterTeamProgress({ step }: RegisterTeamProgressProps) {
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < step) return "complete";
    if (stepNumber === step) return "current";
    return "upcoming";
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center flex-1">
            <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              getStepStatus(stepNumber) === 'complete' 
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                : getStepStatus(stepNumber) === 'current'
                ? 'bg-blue-500 text-white ring-4 ring-blue-500/30 shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              {getStepStatus(stepNumber) === 'complete' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="font-semibold">{stepNumber}</span>
              )}
            </div>
            {stepNumber < 3 && (
              <div className={`flex-1 h-1 mx-4 transition-all ${
                getStepStatus(stepNumber + 1) === 'complete' || step > stepNumber
                  ? 'bg-green-500' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm font-medium">
        <span className={`transition-colors ${step >= 1 ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`}>
          Informasi Tim
        </span>
        <span className={`transition-colors ${step >= 2 ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`}>
          Anggota Tim
        </span>
        <span className={`transition-colors ${step >= 3 ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`}>
          Konfirmasi
        </span>
      </div>
    </div>
  );
}