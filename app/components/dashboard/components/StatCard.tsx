"use client";

import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  Icon,
}: {
  label: string;
  value: number | undefined;
  Icon: LucideIcon;
}) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-center gap-3 p-4">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-background">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-lg font-semibold">{value ?? 0}</div>
        </div>
      </CardContent>
    </Card>
  );
}
