"use client";

import {FormEvent, useEffect, useState, useTransition} from "react";
import {Input} from "./ui/input";
import {Button} from "./ui/button";
import {doc, updateDoc} from "firebase/firestore";
import {db} from "@/firebase";
import {useDocumentData} from "react-firebase-hooks/firestore";
import useOwner from "@/lib/useOwner";
import CollaborativeEditor from "./CollaborativeEditor";

function Document({id}: {id: string}) {
  const [input, setInput] = useState("");
  const [isUpdating, startTransition] = useTransition();
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const isOwner = useOwner();

  useEffect(() => {
    // Fetch document data
    setInput(data?.title || "");
  }, [data]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, "documents", id), {
          title: input,
        });
      });
    }
  };

  return (
    <div className='flex-1 h-full bg-white p-5'>
      <div className='flex max-w-4xl mx-auto justify-between pb-5'>
        <form className='flex flex-1 space-x-2 ' onSubmit={updateTitle}>
          <Input
            placeholder='Document Title'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type='submit' disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update"}
          </Button>
          {
            /* if owner && invite /delete docs */

            isOwner && (
              <>
                <Button>Delete</Button>
                <Button>Invite</Button>
              </>
            )
          }
        </form>
      </div>
      <div>
        {/* Manage Users */}
        {/* avatars */}
      </div>
      <hr className='pb-10' />
      {/* collaboartive editor */}
      <CollaborativeEditor />
    </div>
  );
}
export default Document;
