"use client";

import { useCallback, useMemo, useState, useEffect } from "react";

import type { Task, Board } from "../types";
import type { DropResult } from "@hello-pangea/dnd";

import {
  assignSelectedTask,
  completeCurrentTask,
} from "../../../lib/actions/tasks";

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export function useBoard(tasks: Task[] | undefined, householdId?: number) {
  const initial = useMemo<Board>(() => {
    const unassigned =
      tasks?.filter((t) => !t.completed && t.assignedToUserId === null) ?? [];
    const assigned =
      tasks?.filter((t) => !t.completed && t.assignedToUserId !== null) ?? [];
    const done = tasks?.filter((t) => !!t.completed) ?? [];
    return { unassigned, assigned, done };
  }, [tasks]);

  const [board, setBoard] = useState<Board>(initial);
  useEffect(() => setBoard(initial), [initial]);

  const onDragEnd = useCallback(
    async (result: DropResult) => {
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
          await assignSelectedTask(moved.id, Number(householdId));
        } else if (dstCol === "done") {
          if (srcCol === "unassigned") {
            if (!householdId) throw new Error("householdId mangler");
            await assignSelectedTask(moved.id, Number(householdId));
          }
          await completeCurrentTask(moved.id);
        } else if (dstCol === "unassigned") {
          throw new Error("Å flytte til Ufordelt er ikke støttet ennå");
        }
      } catch (err) {
        console.warn("Drag handling failed, reverting", err);
        setBoard(prev);
      }
    },
    [board, householdId],
  );

  return { board, setBoard, onDragEnd } as const;
}
