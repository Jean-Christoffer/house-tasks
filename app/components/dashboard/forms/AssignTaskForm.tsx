import { Button } from "@/components/ui/button";
import { assignSelectedTask } from "@/app/lib/actions/tasks";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";

const AssignTaskSchema = z.object({
  userId: z.coerce.number().int().positive(),
  taskId: z.coerce.number().int().positive(),
  householdId: z.coerce.number().int().positive(),
});

interface AssignTaskFormProps {
  userId: number;
  taskId: number;
  householdId: number;
}

export default function AssignTaskForm({
  userId,
  taskId,
  householdId,
}: AssignTaskFormProps) {
  async function assignTask(formData: FormData) {
    try {
      const raw = Object.fromEntries(formData.entries());
      const parsed = AssignTaskSchema.safeParse(raw);

      if (!parsed.success) {
        const pretty = z.prettifyError(parsed.error);
        throw new Error(pretty);
      }

      const { userId, taskId, householdId } = parsed.data;
      await assignSelectedTask(userId, taskId, householdId);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form action={assignTask}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="taskId" value={taskId} />
      <input type="hidden" name="householdId" value={householdId} />

      <Button
        type="submit"
        size="sm"
        variant="secondary"
        className="rounded-xl"
        aria-label="Marker som ferdig"
      >
        <CheckCircle2 className="mr-2 h-4 w-4" /> Jeg tar den!
      </Button>
    </form>
  );
}
