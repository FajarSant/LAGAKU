"use client";

type Props = {
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
};

export default function StatusFilter({ selectedStatus, setSelectedStatus }: Props) {
  const tabs = [
    { label: "Live", value: "berlangsung" },
    { label: "Selesai", value: "selesai" },
    { label: "Akan Datang", value: "dijadwalkan" },
  ];

  return (
    <section className="p-6">
      <h3 className="font-bold text-lg mb-3">Status Pertandingan</h3>

      <div className="flex gap-4">
        {tabs.map((tab) => {
          const active = selectedStatus === tab.value;

          return (
            <span
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-4 py-1 rounded-full text-sm cursor-pointer transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {tab.label}
            </span>
          );
        })}
      </div>
    </section>
  );
}
