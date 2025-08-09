import type { DraggableProvided } from "@hello-pangea/dnd";

export default function DraggableItem({
  provided,
  children,
}: {
  provided: DraggableProvided;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div>{children}</div>
    </div>
  );
}
