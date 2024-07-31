"use server";
import { adminDb } from "@/firebase-admin";
import {auth} from "@clerk/nextjs/server";

async function inviteUser(email: string, roomId: string) {
  auth().protect();
  // invite a user to a room
  console.log("InviteUserToDocument", email, roomId);
  try {
    // send an email invite
    // sendEmailInvite(email, roomId);
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        roomId,
      });
  } catch (e) {
    console.error("Error inviting user", e);
    return {success: false, error: e};
  }
  return {success: true};
}
export default inviteUser;
