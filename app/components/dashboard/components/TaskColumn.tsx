"use client";

import { Draggable } from "@hello-pangea/dnd";
import Column from "./Column";
import DraggableItem from "./DraggableItem";
import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";
import type { Task, Board } from "../types";

export function TaskColumn({
  title,
  icon,
  droppableId,
  tasks,
  userId,
  householdId,
  variant,
}: {
  title: string;
  icon: React.ReactNode;
  droppableId: keyof Board;
  tasks: Task[];
  userId: number;
  householdId?: number;
  variant: "unassigned" | "assigned" | "done";
}) {
  return (
    <Column
      title={title}
      icon={icon}
      count={tasks?.length}
      droppableId={droppableId}
    >
      {() =>
        tasks?.length ? (
          tasks.map((task, index) => (
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
                    variant={variant}
                  />
                </DraggableItem>
              )}
            </Draggable>
          ))
        ) : (
          <EmptyState
            label={
              variant === "unassigned"
                ? "Ingen ufordelte oppgaver"
                : variant === "assigned"
                  ? "Ingen oppgaver i arbeid"
                  : "Ingen fullførte oppgaver"
            }
          />
        )
      }
    </Column>
  );
}
