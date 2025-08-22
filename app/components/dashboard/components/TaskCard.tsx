import type { Task } from "../types";

import { formatDate } from "../utils";
import CompleteTaskForm from "./forms/CompleteTaskForm";
import AssignTaskForm from "./forms/AssignTaskForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2 } from "lucide-react";

function GradientRing({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-sky-500/20 to-emerald-500/20 blur" />
      <div className="relative rounded-2xl border bg-card text-card-foreground shadow-sm">
        {children}
      </div>
    </div>
  );
}

export default function TaskCard({
  task,
  userId,
  householdId,
  variant,
}: {
  task: Task;
  userId: number;
  householdId: number;
  variant: "unassigned" | "assigned" | "done";
}) {
  const canAssign = variant === "unassigned";
  const canComplete = variant === "assigned" && task.assignedTo?.id === userId;

  return (
    <GradientRing>
      <Card className="rounded-2xl border-0 shadow-none">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex min-w-0 flex-col gap-2">
            <CardTitle className="truncate text-lg leading-tight">
              {task.name}
            </CardTitle>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(task.createdAt)}</span>
            </div>
            <div>
              <p className=" text-xs text-muted-foreground">
                Opprettet av {task.createdBy.userName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {variant === "done" ? (
              <Badge className="gap-1" variant="secondary">
                <CheckCircle2 className="h-3.5 w-3.5" /> Ferdig
              </Badge>
            ) : task.assignedTo ? (
              <Badge variant="outline">Tildelt</Badge>
            ) : (
              <Badge variant="outline">Ufordelt</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {task.description ? (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          ) : null}

          <div className="flex items-center justify-between">
            {task.assignedTo && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={
                      task.assignedTo.avatar ?? "https://github.com/shadcn.png"
                    }
                    alt="@shadcn"
                  />
                  <AvatarFallback>-</AvatarFallback>
                </Avatar>
                <span>
                  {task.assignedTo.id === userId
                    ? "Tildelt til deg"
                    : `Tildelt til ${task.assignedTo.userName}`}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {canAssign ? (
                <AssignTaskForm taskId={task.id} householdId={householdId} />
              ) : null}

              {canComplete ? <CompleteTaskForm taskId={task.id} /> : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </GradientRing>
  );
}
