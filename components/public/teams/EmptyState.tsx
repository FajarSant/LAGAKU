import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="text-center border-dashed">
      <CardHeader>
        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
          <p>• Bergabung dengan tim yang sudah ada</p>
          <p>• Atau tunggu undangan dari tim lain</p>
          <p>• Pantau turnamen untuk melihat peluang bergabung</p>
        </div>
      </CardContent>
    </Card>
  );
}