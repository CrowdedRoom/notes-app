"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {useCallback, useState, useTransition} from "react";
import {Button} from "./ui/button";
import {useRouter} from "next/navigation";
import {useRoom} from "@liveblocks/react/suspense";

import {toast} from "sonner";
import inviteUser from "@/actions/inviteUser";
import {Input} from "./ui/input";

function isValidEmail(email: string) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function InviteUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {id} = useRoom();
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    // Invite user
    if (!id) return;
    startTransition(async () => {
      if (!email || !isValidEmail(email)) {
        toast.error("Please enter an email");
        return;
      }
      const {success} = await inviteUser(email, id);
      if (success) {
        setIsOpen(false);
        setEmail("");
        toast.success("Invited user successfully");
      } else {
        toast.error("Failed to invite user");
      }
    });
  }

  useCallback(handleInvite, [email, id]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant='outline'>
        <DialogTrigger>Invite</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a user to collaborate with!</DialogTitle>
          <DialogDescription>
            Enter the email of the user you want to invite.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInvite} className='flex gap-2'>
          <Input
            type='email'
            placeholder='Enter email address'
            className='w-full'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type='submit'
            disabled={!email || isPending}
            className=''
          >
            {isPending ? "Inviting..." : "Invite"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default InviteUser;
