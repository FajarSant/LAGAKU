"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import TimTable, { Tim } from "@/components/admin/tim/DataTable";
import { toast } from "sonner";
import DetailAnggotaModal from "@/components/admin/tim/DetailDialogAnggota";

export default function TimPage() {
  const router = useRouter();
  const supabase = createClient();

  const [timList, setTimList] = useState<Tim[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTimId, setSelectedTimId] = useState<string | null>(null);

  const loadTim = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tim")
      .select("*")
      .order("dibuat_pada", { ascending: false });

    if (error) toast.error(error.message);
    if (data) setTimList(data as Tim[]);
    setLoading(false);
  };

  useEffect(() => {
    loadTim();
  }, []);

  const handleDelete = async (tim: Tim) => {
    if (!confirm(`Hapus tim ${tim.nama}? Semua anggota juga akan dihapus.`)) return;
    const { error } = await supabase.from("tim").delete().eq("id", tim.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Tim berhasil dihapus");
      loadTim();
    }
  };

  const handleDetail = (tim: Tim) => {
    setSelectedTimId(tim.id);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Data Tim</h1>
        <Button onClick={() => router.push("/tim/tambah")}>Tambah Tim</Button>
      </div>

      <TimTable
        data={timList}
        onDelete={handleDelete}
        onDetail={handleDetail}
        onEdit={(tim) => router.push(`/tim/edit/${tim.id}`)}
      />
      

      {selectedTimId && (
        <DetailAnggotaModal
          timId={selectedTimId}
          onClose={() => setSelectedTimId(null)}
        />
      )}
    </div>
  );
}
