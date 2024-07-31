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
import deleteDocument from "@/actions/deleteDocument";
import {toast} from "sonner";

function DeleteDocument() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {id} = useRoom();
  const router = useRouter();

  function handleDelete() {
    // delete document
    if (!id) return;
    startTransition(async () => {
      const {success} = await deleteDocument(id);
      if (success) {
        setIsOpen(false);
        router.replace("/");
        toast.success("Document deleted successfully");
      } else {
        toast.error("Failed to delete document");
      }
    });
  }

  useCallback(handleDelete, [id, router]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant='destructive'>
        <DialogTrigger>Delete</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure you want to Delete?</DialogTitle>
          <DialogDescription>
            This will delete the document and all it&apos;s contents, removing
            all users from the document..
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='sm:justify-end gap-2'>
          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default DeleteDocument;
