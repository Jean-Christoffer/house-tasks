"use client";

import type { Task, Board, DashboardProps } from "./types";

import { useEffect, useMemo, useState } from "react";
import { DragDropContext, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, ClipboardList, Loader2, Home } from "lucide-react";
import Taskbar from "../Taskbar";
import {
  completeCurrentTask,
  assignSelectedTask,
} from "../../lib/actions/tasks";
import Column from "./Column";
import DraggableItem from "./DraggableItem";
import TaskCard from "./TaskCard";

export default function Dashboard({
  userName,
  userId,
  completedTasks,
  tasks,
  household,
}: DashboardProps) {
  const householdId = household?.[0]?.id;

  const initial = useMemo<Board>(() => {
    const unassigned = tasks.filter(
      (t) => !t.completed && t.assignedToUserId === null,
    );
    const assigned = tasks.filter(
      (t) => !t.completed && t.assignedToUserId !== null,
    );
    const done = tasks.filter((t) => !!t.completed);
    return { unassigned, assigned, done };
  }, [tasks]);

  const [board, setBoard] = useState<Board>(initial);

  useEffect(() => setBoard(initial), [initial]);

  function reorder(list: Task[], startIndex: number, endIndex: number) {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  async function onDragEnd(result: DropResult) {
    const { destination, source } = result;
    if (!destination) return;

    const srcCol = source.droppableId as keyof Board;
    const dstCol = destination.droppableId as keyof Board;

    if (srcCol === dstCol && source.index === destination.index) return;

    const prev = board;

    const next: Board = {
      unassigned: [...board.unassigned],
      assigned: [...board.assigned],
      done: [...board.done],
    };

    if (srcCol === dstCol) {
      next[srcCol] = reorder(next[srcCol], source.index, destination.index);
      setBoard(next);
      return;
    }

    const srcList = next[srcCol];
    const [moved] = srcList.splice(source.index, 1);
    next[dstCol].splice(destination.index, 0, moved);
    setBoard(next);

    try {
      if (dstCol === "assigned") {
        if (!householdId) throw new Error("householdId mangler");
        await assignSelectedTask(userId, moved.id, householdId);
      } else if (dstCol === "done") {
        if (srcCol === "unassigned") {
          if (!householdId) throw new Error("householdId mangler");
          await assignSelectedTask(userId, moved.id, householdId);
        }
        await completeCurrentTask(userId, moved.id);
      } else if (dstCol === "unassigned") {
        throw new Error("Å flytte til Ufordelt er ikke støttet ennå");
      }
    } catch (err) {
      console.warn("Drag handling failed, reverting", err);
      setBoard(prev);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-background to-muted/40 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Hei, {userName} 👋
            </h1>
            <p className="text-muted-foreground">
              Du har fullført <strong>{completedTasks}</strong> oppgaver
            </p>
          </div>

          <Badge
            variant="outline"
            className="flex items-center gap-2 text-base px-3 py-1 rounded-2xl"
          >
            <Home className="h-4 w-4" />{" "}
            {household?.[0]?.houseName ?? "Ingen husholdning"}
          </Badge>
        </div>

        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-500/10 via-sky-500/10 to-emerald-500/10" />
      </div>

      <Taskbar
        shouldRenderJoinHouseHold={!household?.length}
        userName={userName}
        householdId={householdId}
      />

      <Separator />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="rounded-2xl">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-background">
              <ClipboardList className="h-4 w-4" />
            </span>
            <div>
              <div className="text-xs text-muted-foreground">Ufordelt</div>
              <div className="text-lg font-semibold">
                {board.unassigned.length}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-background">
              <Loader2 className="h-4 w-4" />
            </span>
            <div>
              <div className="text-xs text-muted-foreground">Pågår</div>
              <div className="text-lg font-semibold">
                {board.assigned.length}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-background">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div>
              <div className="text-xs text-muted-foreground">Ferdig</div>
              <div className="text-lg font-semibold">{board.done.length}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid gap-4 md:grid-cols-3">
          <Column
            title="Ufordelt"
            icon={<ClipboardList className="h-4 w-4" />}
            count={board.unassigned.length}
            droppableId="unassigned"
          >
            {() => (
              <>
                {board.unassigned.length ? (
                  board.unassigned.map((task, index) => (
                    <Draggable
                      draggableId={String(task.id)}
                      index={index}
                      key={task.id}
                    >
                      {(provided) => (
                        <DraggableItem provided={provided}>
                          <TaskCard
                            task={task}
                            userId={userId}
                            householdId={householdId}
                            variant="unassigned"
                          />
                        </DraggableItem>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <EmptyState label="Ingen ufordelte oppgaver" />
                )}
              </>
            )}
          </Column>

          <Column
            title="Pågår"
            icon={<Loader2 className="h-4 w-4" />}
            count={board.assigned.length}
            droppableId="assigned"
          >
            {() => (
              <>
                {board.assigned.length ? (
                  board.assigned.map((task, index) => (
                    <Draggable
                      draggableId={String(task.id)}
                      index={index}
                      key={task.id}
                    >
                      {(provided) => (
                        <DraggableItem provided={provided}>
                          <TaskCard
                            task={task}
                            userId={userId}
                            householdId={householdId}
                            variant="assigned"
                          />
                        </DraggableItem>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <EmptyState label="Ingen oppgaver i arbeid" />
                )}
              </>
            )}
          </Column>

          <Column
            title="Ferdig"
            icon={<CheckCircle2 className="h-4 w-4" />}
            count={board.done.length}
            droppableId="done"
          >
            {() => (
              <>
                {board.done.length ? (
                  board.done.map((task, index) => (
                    <Draggable
                      draggableId={String(task.id)}
                      index={index}
                      key={task.id}
                    >
                      {(provided) => (
                        <DraggableItem provided={provided}>
                          <TaskCard
                            task={task}
                            userId={userId}
                            householdId={householdId}
                            variant="done"
                          />
                        </DraggableItem>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <EmptyState label="Ingen fullførte oppgaver" />
                )}
              </>
            )}
          </Column>
        </div>
      </DragDropContext>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center rounded-xl border border-dashed bg-background py-10 text-sm text-muted-foreground">
      {label}
    </div>
  );
}
