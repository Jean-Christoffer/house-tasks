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
  avatar,
}: {
  title: string;
  icon: React.ReactNode;
  droppableId: keyof Board;
  tasks: Task[] | [];
  userId: number;
  householdId: number | null;
  variant: "unassigned" | "assigned" | "done";
  avatar: string | null;
}) {
  return (
    <Column
      title={title}
      icon={icon}
      count={tasks?.length}
      droppableId={droppableId}
    >
      {() =>
        tasks?.length && householdId ? (
          tasks.map((task, index) => (
            <Draggable
              draggableId={String(task.id)}
              index={index}
              key={task.id}
            >
              {(provided) => {
                return (
                  <DraggableItem provided={provided}>
                    <TaskCard
                      task={task}
                      userId={userId}
                      householdId={householdId}
                      variant={variant}
                      avatar={avatar}
                    />
                  </DraggableItem>
                );
              }}
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
