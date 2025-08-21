"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Home } from "lucide-react";
import Logout from "../../Logout";
import CopyButton from "./CopyButton";

export function Header({
  userName,
  completedTasks,
  houseName,
  inviteCode,
}: {
  userName: string;
  completedTasks: number;
  houseName?: string | null;
  inviteCode?: string | null;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-background to-muted/40 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logout />
          <h1 className="text-3xl font-bold tracking-tight">
            Hei, {userName} 👋
          </h1>
          <p className="text-muted-foreground">
            Du har fullført <strong>{completedTasks}</strong> oppgaver
          </p>
        </div>

        <Badge
          variant="outline"
          className="flex flex-col items-center gap-2 text-base px-3 py-1 rounded-2xl"
        >
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4" /> {houseName ?? "Ingen husholdning"}
          </div>
          {inviteCode && (
            <>
              <Separator />
              <div className="items-center flex flex-col gap-2">
                <p>
                  <small>
                    Inviter brukere til husholdningen med koden under.
                  </small>
                </p>
                <CopyButton text={inviteCode} />
              </div>
            </>
          )}
        </Badge>
      </div>

      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-500/10 via-sky-500/10 to-emerald-500/10" />
    </div>
  );
}
