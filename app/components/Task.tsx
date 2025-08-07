"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TaskProps {
  taskName: string;
  taskDescription: string;
  createdBy: string;
  createdAt: string;
  assignedToUserId: number;
  userId: number;
}

export default function Task({
  taskName,
  taskDescription,
  createdBy,
  createdAt,
  assignedToUserId,
  userId,
}: TaskProps) {
  async function handleAssign() {
    console.log("clicked");
  }
  const isAssignedToCurrentUser = assignedToUserId === userId;

  function assignedToContent() {
    if (!assignedToUserId)
      return <button onClick={handleAssign}>Assign yourself</button>;
    if (isAssignedToCurrentUser) return "You are assigned";

    return `Assigned to ${assignedToUserId}`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{taskName}</CardTitle>
        <CardDescription>{taskDescription}</CardDescription>
        <CardAction>Created by: {createdBy}</CardAction>
      </CardHeader>
      <CardContent>{assignedToContent()}</CardContent>

      <CardFooter>
        <p>{createdAt}</p>
      </CardFooter>
    </Card>
  );
}
