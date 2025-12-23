import AcaraCard from "./AcaraCard";

interface Acara {
  id: string;
  nama: string;
  deskripsi: string | null;
  tipe_acara: "SISTEM_GUGUR" | "SISTEM_KOMPETISI" | "SISTEM_CAMPURAN";
  dibuat_pada: string;
  lokasi?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  status?: string;
}

interface AcaraGridProps {
  acara: Acara[];
}

export default function AcaraGrid({ acara }: AcaraGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {acara.map((item) => (
        <AcaraCard key={item.id} acara={item} />
      ))}
    </div>
  );
}