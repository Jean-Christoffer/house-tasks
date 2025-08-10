import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

import { DialogFooter } from "@/components/ui/dialog";

import { createTaskAction } from "../../../lib/actions/tasks";
import { DialogClose } from "@radix-ui/react-dialog";

const CreateTaskSchema = z.object({
  taskName: z.string(),
  taskDescription: z.string(),
});

interface CreateTaskFormProps {
  householdId: number;
}

export default function CreateTaskForm({ householdId }: CreateTaskFormProps) {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  async function handleSubmit(formData: FormData) {
    try {
      const raw = Object.fromEntries(formData.entries());
      const parsed = CreateTaskSchema.safeParse(raw);

      if (!parsed.success) {
        const pretty = z.prettifyError(parsed.error);
        throw new Error(pretty);
      }

      const { taskName, taskDescription } = parsed.data;
      await createTaskAction(taskName, taskDescription, householdId);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <form action={handleSubmit}>
      <div className="space-y-4 py-4">
        <div>
          <Label htmlFor="taskName" className="mb-2">
            Navn på oppgave
          </Label>
          <Input
            id="taskName"
            name="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="taskDescription" className="mb-2">
            Beskrivelse
          </Label>
          <Textarea
            id="taskDescription"
            name="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            required
          />
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Lag oppgave</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}
