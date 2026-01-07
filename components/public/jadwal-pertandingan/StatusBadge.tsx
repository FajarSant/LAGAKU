"use client";

import { Badge } from "@/components/ui/badge";
import { EnumStatusMatch } from "@/utils";
import { getStatusConfig } from "@/utils/schedule-utils";

interface StatusBadgeProps {
  status: EnumStatusMatch;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  
  return (
    <Badge
      variant="outline"
      className={`${config.bg} ${config.text} ${config.border} font-medium px-3 py-1`}
    >
      {config.label}
    </Badge>
  );
}