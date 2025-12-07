"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Button
} from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// =========================
// Schema & Types
// =========================
const TipeOlahragaSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  deskripsi: z.string().optional(),
});

type TipeOlahragaForm = z.infer<typeof TipeOlahragaSchema>;

interface TipeOlahraga {
  id: string;
  nama: string;
  deskripsi: string | null;
}

export default function EditTipeOlahragaPage() {
  const params = useParams();
  const id = params?.id as string;

  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);

  const form = useForm<TipeOlahragaForm>({
    resolver: zodResolver(TipeOlahragaSchema),
    defaultValues: {
      nama: "",
      deskripsi: "",
    },
  });

  // =========================
  // Load Data From Supabase
  // =========================
  useEffect(() => {
    async function loadData() {
      if (!id) return;

      const { data, error } = await supabase
        .from("tipe_olahraga")
        .select("*")
        .eq("id", id)
        .single<TipeOlahraga>();

      if (error || !data) {
        toast.error("Data tidak ditemukan");
        router.push("/tipe-olahraga");
        return;
      }

      form.reset({
        nama: data.nama,
        deskripsi: data.deskripsi ?? "",
      });

      setLoading(false);
    }

    loadData();
  }, [id, supabase, form, router]);

  // =========================
  // Submit Handler
  // =========================
  const onSubmit = async (values: TipeOlahragaForm) => {
    const { error } = await supabase
      .from("tipe_olahraga")
      .update(values)
      .eq("id", id);

    if (error) {
      toast.error("Gagal memperbarui data");
      return;
    }

    toast.success("Tipe olahraga berhasil diperbarui!");
    router.push("/dashboard/tipe-olahraga");
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Memuat data...
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="max-w-xl mx-auto py-10">
      <Card className="border border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Edit Tipe Olahraga
          </CardTitle>
          <CardDescription>
            Perbarui informasi tipe olahraga.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* NAMA */}
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Tipe Olahraga</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Futsal, Basket, Voli..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DESKRIPSI */}
              <FormField
                control={form.control}
                name="deskripsi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi (opsional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Penjelasan singkat tentang olahraga ini..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Kembali
                </Button>
                <Button type="submit">Perbarui</Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
