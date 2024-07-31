"use server";
import {adminDb} from "@/firebase-admin";
import {auth} from "@clerk/nextjs/server";

function removeUserFromRoom(userId: string, roomId: string) {
  auth().protect();
  console.log("removeUserFromRoom", userId, roomId);
  try {
    adminDb
      .collection("users")
      .doc(userId)
      .collection("rooms")
      .doc(roomId)
      .delete();
  } catch (error) {
    console.error("Error removing user from room", error);
    return {success: false};
  }

  return {success: true};
}
export default removeUserFromRoom;
