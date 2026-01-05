import { Pengguna } from "@/utils";
import { User, Mail, GraduationCap, Users, Phone, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProfileSidebarProps {
  user: Pengguna | null;
}

export default function ProfileSidebar({ user }: ProfileSidebarProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const infoItems = [
    {
      icon: Mail,
      label: "Email",
      value: user?.email || "-",
      color: "text-blue-600",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: GraduationCap,
      label: "NIM",
      value: user?.nim || "-",
      color: "text-green-600",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Users,
      label: "Program Studi",
      value: user?.program_studi || "-",
      color: "text-purple-600",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Phone,
      label: "Nomor HP",
      value: user?.nomor_hp || "-",
      color: "text-yellow-600",
      bgColor: "bg-yellow-500/10"
    },
    {
      icon: Calendar,
      label: "Bergabung sejak",
      value: user?.dibuat_pada ? formatDate(user.dibuat_pada) : "-",
      color: "text-gray-600",
      bgColor: "bg-gray-500/10"
    }
  ];

  return (
    <Card className="lg:col-span-1">
      <CardContent className="pt-6">
        {/* Avatar & Name Section */}
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-28 w-28 mb-4 border-4 border-background shadow-lg">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback className="text-xl bg-linear-to-r from-blue-500 to-purple-600">
              {getInitials(user?.nama || "User")}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-bold text-center mb-2">{user?.nama}</h2>
          
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <Badge 
              variant={user?.peran === 'admin' ? 'destructive' : 'default'}
            >
              {user?.peran === 'admin' ? 'Admin' : 'Mahasiswa'}
            </Badge>
            <Badge 
              variant={user?.is_verified ? 'default' : 'secondary'}
            >
              {user?.is_verified ? 'Terverifikasi' : 'Belum Verifikasi'}
            </Badge>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${item.bgColor} shrink-0`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {item.label}
                </p>
                <p className="text-sm font-medium truncate">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}