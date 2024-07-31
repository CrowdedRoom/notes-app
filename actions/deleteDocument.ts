"use server";

import {adminDb} from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import {auth} from "@clerk/nextjs/server";

async function deleteDocument(roomId: string) {
  // delete a document
  auth().protect();
  console.log("DeleteDocument", roomId);
  try {
    // delete the firebase document
    await adminDb.collection("documents").doc(roomId).delete();

    // delete all user rooms associated with the document
    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();
    const batch = adminDb.batch();
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // commit batch
    await batch.commit();

    // delete liveblocks room
    await liveblocks.deleteRoom(roomId);
  } catch (e) {
    console.error("Error deleting document", e);
    return {success: false, error: e};
  }

  return {success: true};
}
export default deleteDocument;
