import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function TambahAcaraPage() {
  async function tambahAcara(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const nama = formData.get("nama") as string;
    const tipe = formData.get("tipe") as string;
    const lokasi = formData.get("lokasi") as string;

    await supabase.from("acara").insert({
      nama,
      tipe,
      lokasi,
    });

    redirect("/dashboard/acara");
  }

  return (
    <form action={tambahAcara} className="p-6 max-w-lg space-y-4">
      <h1 className="text-xl font-semibold mb-4">Tambah Acara</h1>

      <Input name="nama" placeholder="Nama acara" required />
      <Input name="tipe" placeholder="Tipe (turnamen, liga, dll)" />
      <Input name="lokasi" placeholder="Lokasi acara" />

      <Button type="submit">Simpan</Button>
    </form>
  );
}
