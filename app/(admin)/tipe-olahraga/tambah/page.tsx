"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  deskripsi: z.string().optional(),
});

export default function TambahTipeOlahragaPage() {
  const router = useRouter();
  const supabase = createClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      deskripsi: "",
    },
  });

  async function onSubmit(values: any) {
    const { error } = await supabase.from("tipe_olahraga").insert({
      nama: values.nama,
      deskripsi: values.deskripsi,
    });

    if (error) {
      toast.error("Gagal menambah tipe olahraga");
      return;
    }

    toast.success("Tipe olahraga berhasil ditambahkan!");
    router.push("/dashboard/tipe-olahraga");
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card className="border border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Tambah Tipe Olahraga</CardTitle>
          <CardDescription>Tambahkan jenis olahraga baru ke platform LIGAKU.</CardDescription>
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
                      <Textarea placeholder="Penjelasan singkat tentang olahraga ini..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SUBMIT */}
              <Button type="submit" className="w-full">
                Simpan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
