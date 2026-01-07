import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export default function ScheduleCalendar() {
  return (
    <Card className="border border-gray-200 dark:border-gray-800 mt-8">
      <CardHeader>
        <CardTitle>Kalender Pertandingan</CardTitle>
        <CardDescription>Pandangan kalender untuk jadwal mendatang</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border p-6 text-center">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold mb-2">
            Fitur Kalender Akan Segera Hadir
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Kami sedang mengembangkan tampilan kalender untuk pengalaman
            yang lebih baik
          </p>
          <Button variant="outline" disabled>
            <Calendar className="w-4 h-4 mr-2" />
            Buka Kalender
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}