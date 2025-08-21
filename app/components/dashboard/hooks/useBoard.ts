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

export function useBoard(tasks: Task[] | [], householdId?: number | null) {
  const list = useMemo(() => tasks ?? [], [tasks]);

  const initial = useMemo<Board>(() => {
    const unassigned = list.filter((t) => !t.completed && !t.assignedTo);
    const assigned = list.filter((t) => !t.completed && !!t.assignedTo);
    const done = list.filter((t) => !!t.completed);
    return { unassigned, assigned, done };
  }, [list]);

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
          // Not supported yet (kept same behavior)
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
