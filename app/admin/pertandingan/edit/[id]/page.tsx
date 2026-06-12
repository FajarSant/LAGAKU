"use client";


import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function EditPertandinganPage() {
const supabase = createClient();
const router = useRouter();
const { id } = useParams();


const [data, setData] = useState<any>(null);


useEffect(() => {
supabase
.from("pertandingan")
.select("*")
.eq("id", id)
.single()
.then(({ data }) => setData(data));
}, [id]);


const save = async () => {
const pemenang = data.skor_tim_a > data.skor_tim_b
? data.tim_a_id
: data.tim_b_id;


await supabase
.from("pertandingan")
.update({
skor_tim_a: data.skor_tim_a,
skor_tim_b: data.skor_tim_b,
status: "selesai",
pemenang_id: pemenang,
})
.eq("id", id);


router.push("/admin/pertandingan");
router.refresh();
};


if (!data) return null;


return (
<div className="p-6 max-w-md mx-auto space-y-4">
<h1 className="text-lg font-bold">Edit Pertandingan</h1>


<Input
type="number"
placeholder="Skor Tim A"
value={data.skor_tim_a ?? ""}
onChange={(e) => setData({ ...data, skor_tim_a: +e.target.value })}
/>
<Input
type="number"
placeholder="Skor Tim B"
value={data.skor_tim_b ?? ""}
onChange={(e) => setData({ ...data, skor_tim_b: +e.target.value })}
/>


<Button onClick={save} className="w-full">Simpan Hasil</Button>
</div>
);
}