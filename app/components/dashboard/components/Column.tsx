import type { Board } from "../types";

import { Droppable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";

export default function Column({
  title,
  icon,
  count,
  droppableId,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  droppableId: keyof Board;
  children: (provided: unknown, snapshot: unknown) => React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border bg-muted/30 p-3">
      <div className="flex items-center justify-between px-1 pb-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border bg-background">
            {icon}
          </span>
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        </div>
        <Badge variant="secondary" className="rounded-full">
          {count}
        </Badge>
      </div>

      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={
              "rounded-xl transition-colors h-[60vh] overflow-y-auto pr-2 " +
              (snapshot.isDraggingOver ? "bg-background" : "bg-transparent")
            }
          >
            <div className="grid gap-3 p-2">
              {children(provided, snapshot)}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
}
