"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateTaskForm from "./forms/CreateTaskForm";
import JoinHouseholdForm from "./forms/JoinHouseholdForm";
import CreateHouseholdForm from "./forms/CreateHouseholdForm";

interface TaskbarProps {
  userName: string;
  householdId: number | null;
}

export default function Taskbar({ householdId }: TaskbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {householdId && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer rounded" disabled={!householdId}>
              Lag en oppave
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lag en ny oppgave</DialogTitle>
            </DialogHeader>

            <CreateTaskForm householdId={householdId} />
          </DialogContent>
        </Dialog>
      )}

      {!householdId && (
        <div className="flex items-center gap-2">
          <CreateHouseholdForm />
          <JoinHouseholdForm />
        </div>
      )}
    </div>
  );
}
