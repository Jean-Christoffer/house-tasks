"use client";

import type { DashboardProps } from "./types";
import { DragDropContext } from "@hello-pangea/dnd";
import { ClipboardList, Loader2, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Header } from "./components/Header";
import Taskbar from "./components/Taskbar";
import StatCard from "./components/StatCard";
import { TaskColumn } from "./components/TaskColumn";
import { useBoard } from "./hooks/useBoard";

export default function Dashboard({
  userName,
  avatar,
  userId,
  completedTasks,
  tasks,
  household,
}: DashboardProps) {
  const householdId: number | null = household?.id ?? null;

  const { board, onDragEnd } = useBoard(tasks, householdId);

  const stats = [
    { label: "Ufordelt", value: board.unassigned?.length, Icon: ClipboardList },
    { label: "Pågår", value: board.assigned?.length, Icon: Loader2 },
    { label: "Ferdig", value: board.done?.length, Icon: CheckCircle2 },
  ] as const;

  const columns = [
    {
      key: "unassigned",
      title: "Ufordelt",
      icon: <ClipboardList className="h-4 w-4" />,
      variant: "unassigned" as const,
    },
    {
      key: "assigned",
      title: "Pågår",
      icon: <Loader2 className="h-4 w-4" />,
      variant: "assigned" as const,
    },
    {
      key: "done",
      title: "Ferdig",
      icon: <CheckCircle2 className="h-4 w-4" />,
      variant: "done" as const,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <Header
        avatar={avatar}
        userName={userName}
        completedTasks={completedTasks}
        houseName={household?.houseName}
        inviteCode={household?.inviteCode}
      />

      <Taskbar userName={userName} householdId={householdId} />
      <Separator />

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            Icon={s.Icon}
          />
        ))}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid gap-4 md:grid-cols-3">
          {columns.map((c) => {
            return (
              <TaskColumn
                key={c.key}
                title={c.title}
                icon={c.icon}
                droppableId={c.key as keyof typeof board}
                tasks={board[c.key as keyof typeof board]}
                userId={userId}
                householdId={householdId}
                variant={c.variant}
                avatar={avatar}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
