import { useState } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createHouseholdAction } from "@/app/lib/actions/household";
import { z } from "zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";

const houseSchema = z.object({
  houseName: z.string(),
});

export default function CreateHouseholdForm() {
  const [open, setOpen] = useState(false);

  const [houseName, setHouseName] = useState("");

  async function handleSubmit(formData: FormData) {
    try {
      const raw = Object.fromEntries(formData.entries());
      const parsed = houseSchema.safeParse(raw);

      if (!parsed.success) {
        const pretty = z.prettifyError(parsed.error);
        throw new Error(pretty);
      }

      const { houseName } = parsed.data;
      const res = await createHouseholdAction(houseName);
      if (res && res.success) {
        toast.success("Husholdning laget!");
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer rounded">Lag en husholdning!</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lag en husholdning</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="houseName" className="mb-2">
                Navn på husholdning
              </Label>
              <Input
                id="houseName"
                name="houseName"
                value={houseName}
                type="text"
                minLength={1}
                maxLength={50}
                required
                onChange={(e) => setHouseName(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" disabled={houseName.length < 1}>
                Lag husholdning!
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
