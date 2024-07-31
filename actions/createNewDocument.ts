"use server";

import {adminDb} from "@/firebase-admin";
import {auth} from "@clerk/nextjs/server";
import { doc } from "firebase/firestore";

export async function createNewDocument() {
  auth().protect();
  const {sessionClaims} = await auth();
  // create a new document

  const docCollectionRef = adminDb.collection("documents");
  const docRef = await docCollectionRef.add({
    title: "Untitled",
  });

  await adminDb
    .collection("users")
    .doc(sessionClaims?.email!)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: sessionClaims?.email!,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

    return {docId: docRef.id};
}
