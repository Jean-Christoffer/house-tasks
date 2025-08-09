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
import CreateTaskForm from "./dashboard/forms/CreateTaskForm";

interface TaskbarProps {
  shouldRenderJoinHouseHold: boolean;
  userName: string;
  householdId: number;
}

export default function Taskbar({
  shouldRenderJoinHouseHold,
  householdId,
}: TaskbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="cursor-pointer rounded"
            disabled={shouldRenderJoinHouseHold}
          >
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

      {shouldRenderJoinHouseHold && (
        <Button className="cursor-pointer rounded">
          Bli med i en husholdning!
        </Button>
      )}
    </div>
  );
}
