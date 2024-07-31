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
import {useRoom} from "@liveblocks/react/suspense";

import {toast} from "sonner";
import {Input} from "./ui/input";
import {useUser} from "@clerk/nextjs";
import {useCollection} from "react-firebase-hooks/firestore";
import {collectionGroup, query, where} from "firebase/firestore";
import {db} from "@/firebase";
import useOwner from "@/lib/useOwner";
import removeUserFromRoom from "@/actions/removeUserFromRoom";

function ManageUsers() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isOwner = useOwner();
  const room = useRoom();
  const {user} = useUser();
  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  const handleUserUpdate = useCallback((userId: string) => {
    // Update user
    console.log("User updated");
  }, []);

  const handleRemoveUser = useCallback((userId: string) => {
    startTransition(async () => {
      // remove user
      console.log("User removed");
      if (!userId) return;
      const {success} = await removeUserFromRoom(userId, room.id);
      if (success) {
        toast.success("User removed successfully");
      } else {
        toast.error("Failed to remove user");
      }
    });
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant='outline'>
        <DialogTrigger>Users ({usersInRoom?.docs.length})</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Users with Access</DialogTitle>
          <DialogDescription>
            Below is a list of users who have access to this document.
          </DialogDescription>
        </DialogHeader>
        <hr className='my-2' />
        {/* Map through users in room */}
        <div className='flex flex-col space-y-2'>
          {usersInRoom?.docs.map((doc) => (
            <div
              key={doc.data().userId}
              className='flex justify-between items-center'
            >
              <p className='font-light'>
                {doc.data().userId === user?.emailAddresses[0].toString()
                  ? `You (${doc.data().userId})`
                  : doc.data().userId}
              </p>
              <div className='flex items-center gap-2'>
                <Button variant='outline'>{doc.data().role}</Button>
                {isOwner &&
                  doc.data().userId !== user?.emailAddresses[0].toString() && (
                    <Button
                      variant='destructive'
                      size={"sm"}
                      disabled={isPending}
                      onClick={() => handleRemoveUser(doc.data().userId)}
                    >
                      {isPending ? "Removing..." : "X"}
                    </Button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default ManageUsers;
