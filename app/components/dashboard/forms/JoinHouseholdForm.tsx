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
import { joinHouseholdByInvite } from "@/app/lib/actions/household";
import { z } from "zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";

const inviteSchema = z.object({
  inviteCode: z.string(),
});

export default function JoinHouseholdForm() {
  const [open, setOpen] = useState(false);

  const [inviteCode, setInviteCode] = useState("");

  async function handleSubmit(formData: FormData) {
    try {
      const raw = Object.fromEntries(formData.entries());
      const parsed = inviteSchema.safeParse(raw);

      if (!parsed.success) {
        const pretty = z.prettifyError(parsed.error);
        throw new Error(pretty);
      }

      const { inviteCode } = parsed.data;
      const res = await joinHouseholdByInvite(inviteCode);
      if (res && res.status === 404) {
        toast.error("Fant ikke husholdningen, prøv igjen med en annen kode.");
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer rounded">
          Bli med i en husholdning!
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bli med i en husholdning</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="inviteCode" className="mb-2">
                Invitasjons kode
              </Label>
              <Input
                id="inviteCode"
                name="inviteCode"
                value={inviteCode}
                type="text"
                minLength={10}
                maxLength={10}
                required
                onChange={(e) => setInviteCode(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" disabled={inviteCode.length < 10}>
                Bli med!
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
