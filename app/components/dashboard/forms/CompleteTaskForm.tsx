import { Button } from "@/components/ui/button";
import { completeCurrentTask } from "@/app/lib/actions/tasks";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";

const CompleteTaskSchema = z.object({
  userId: z.coerce.number().int().positive(),
  taskId: z.coerce.number().int().positive(),
});

interface CompleteTaskFormProps {
  userId: number;
  taskId: number;
}

export default function CompleteTaskForm({
  userId,
  taskId,
}: CompleteTaskFormProps) {
  async function completeTask(formData: FormData) {
    try {
      const raw = Object.fromEntries(formData.entries());
      const parsed = CompleteTaskSchema.safeParse(raw);

      if (!parsed.success) {
        const pretty = z.prettifyError(parsed.error);
        throw new Error(pretty);
      }

      const { userId, taskId } = parsed.data;
      await completeCurrentTask(userId, taskId);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <form action={completeTask}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="taskId" value={taskId} />

      <Button
        type="submit"
        size="sm"
        variant="secondary"
        className="rounded-xl"
        aria-label="Marker som ferdig"
      >
        <CheckCircle2 className="mr-2 h-4 w-4" /> Jeg er ferdig!
      </Button>
    </form>
  );
}
