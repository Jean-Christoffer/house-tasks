import {
  AvatarImage,
  Avatar as AvatarWrapper,
  AvatarFallback,
} from "@/components/ui/avatar";
import { avatarConfig } from "./config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { changeAvatar } from "@/app/lib/actions/user";

interface AvatarProps {
  src: string | null;
}

export default function Avatar({ src }: AvatarProps) {
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">
        <AvatarWrapper className="h-[80px] w-[80px]">
          <AvatarImage
            src={
              src ??
              "https://cdn.jsdelivr.net/gh/alohe/memojis/png/vibrent_2.png"
            }
            alt="@shadcn"
          />
          <AvatarFallback>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          </AvatarFallback>
        </AvatarWrapper>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Endre avatar</DialogTitle>
          <div className="flex flex-wrap gap-4 mt-2">
            {avatarConfig.map((avatar, idx) => (
              <form key={idx} action={changeAvatar}>
                <input
                  type="hidden"
                  value={avatar}
                  name="avatar-value"
                  id="avatar-value"
                  readOnly
                />
                <DialogClose type="submit" className="cursor-pointer">
                  <AvatarWrapper className="h-[40px] w-[40px]">
                    <AvatarImage src={avatar} />
                  </AvatarWrapper>
                </DialogClose>
              </form>
            ))}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
