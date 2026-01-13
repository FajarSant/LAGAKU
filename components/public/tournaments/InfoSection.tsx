import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Award } from "lucide-react";

export function InfoSection() {
  const infoItems = [
    {
      icon: Users,
      title: "Daftar dengan Tim",
      description:
        "Bentuk tim dengan teman sekampus Anda. Setiap turnamen membutuhkan tim untuk berpartisipasi.",
      color: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Calendar,
      title: "Perhatikan Jadwal",
      description:
        "Pastikan Anda dan tim siap sesuai jadwal turnamen. Cek tanggal pendaftaran dan pertandingan secara berkala.",
      color: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: Award,
      title: "Raih Prestasi",
      description:
        "Turnamen bukan hanya tentang kemenangan, tapi juga pengalaman, jaringan, dan pengembangan diri.",
      color: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {infoItems.map((item, index) => (
        <Card key={index} className="border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
              <h3 className="font-bold">{item.title}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}