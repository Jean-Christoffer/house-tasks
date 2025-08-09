import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Taskbar from "./Taskbar";
import { completeCurrentTask, assignSelectedTask } from "../lib/actions/tasks";

type Task = {
  id: number;
  householdId: number;
  assignedToUserId: number | null;
  createdByUserId: number;
  taskName: string;
  taskDescription: string;
  createdAt: Date;
  completed: boolean;
};

type Household = {
  id: number;
  inviteCode: string;
  houseName: string;
  createdByUserId: number;
};

type DashboardProps = {
  userName: string;
  userId: number;
  completedTasks: number;
  tasks: Task[];
  household: Household[];
};

export default function Dashboard({
  userName,
  userId,
  completedTasks,
  tasks,
  household,
}: DashboardProps) {
  const assignedTasks = tasks.filter(
    (t) => t.assignedToUserId !== null && !t.completed,
  );

  const unassignedTasks = tasks.filter(
    (t) => t.assignedToUserId === null && !t.completed,
  );
  const completeTasks = tasks.filter((t) => Boolean(t.completed));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold">Hei, {userName} 👋</h1>
          <p className="text-muted-foreground">
            Du har fullført <strong>{completedTasks}</strong> oppgaver
          </p>
        </div>
        <Badge variant="outline" className="text-base px-3 py-1">
          🏠 {household[0]?.houseName}
        </Badge>
      </div>

      <Separator />

      <Taskbar
        shouldRenderJoinHouseHold={!household.length}
        userName={userName}
        householdId={household[0].id}
      />

      <section>
        <h2 className="text-xl font-semibold mb-4">🧹 Tildelte Oppgaver</h2>
        <div className="flex align-center flex-wrap gap-4">
          {assignedTasks.length > 0 ? (
            assignedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                canMarkAsCompleted={true}
                userId={userId}
                householdId={household[0].id}
              />
            ))
          ) : (
            <p className="text-muted-foreground">Ingen tildelte oppgaver.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">📋 Ufordelte Oppgaver</h2>
        <div className="flex align-center flex-wrap gap-4">
          {unassignedTasks.length > 0 ? (
            unassignedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                unassigned
                userId={userId}
                householdId={household[0].id}
              />
            ))
          ) : (
            <p className="text-muted-foreground">Alle oppgaver er tildelt.</p>
          )}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Fullførte oppgaver</h2>
        <div className="flex flex-wrap align-center gap-4">
          {completeTasks.length > 0 ? (
            completeTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                userId={userId}
                householdId={household[0].id}
              />
            ))
          ) : (
            <p className="text-muted-foreground">Ingen fullførte oppgaver</p>
          )}
        </div>
      </section>
    </div>
  );
}

function TaskCard({
  task,
  userId,
  householdId,
  unassigned = false,
  canMarkAsCompleted = false,
}: {
  task: Task;
  userId: number;
  householdId: number;
  unassigned?: boolean;
  canMarkAsCompleted?: boolean;
}) {
  return (
    <Card className="max-w-sm w-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">{task.taskName}</CardTitle>
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          {task.taskDescription}
        </p>
        {canMarkAsCompleted && (
          <form
            action={async () => {
              "use server";
              await completeCurrentTask(userId, task.id);
            }}
          >
            <button className="cursor-pointer" type="submit">
              Mark as completed
            </button>
          </form>
        )}
        {unassigned && (
          <form
            action={async () => {
              "use server";
              await assignSelectedTask(userId, task.id, householdId);
            }}
          >
            <button className="cursor-pointer" type="submit">
              Assign yourself
            </button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
