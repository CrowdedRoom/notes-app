"use client";

import {useTransition} from "react";
import {Button} from "./ui/button";
import {useRouter} from "next/navigation";
import {createNewDocument} from "@/actions/createNewDocument";

function NewDocumentButton() {
  const [isPending, startTransiton] = useTransition();
  const router = useRouter();

  const handleCreateNewDocument = () => {
    startTransiton(async () => {
      const {docId} = await createNewDocument();
      router.push(`/doc/${docId}`);
    });
  };

  return (
    <Button onClick={handleCreateNewDocument} disabled={isPending}>
      {isPending ? "Creating new document..." : "+ New Document"}
    </Button>
  );
}
export default NewDocumentButton;
