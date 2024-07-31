"use client";

import {MenuIcon} from "lucide-react";
import NewDocumentButton from "./NewDocumentButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {useCollection} from "react-firebase-hooks/firestore";
import {useUser} from "@clerk/nextjs";
import {collectionGroup, DocumentData, query, where} from "firebase/firestore";
import {db} from "@/firebase";
import {useEffect, useState} from "react";
import SidebarOption from "./SidebarOption";

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor" | "viewer";
  roomId: string;
  userId: string;
}

function Sidebar() {
  const {user} = useUser();
  const [data, loading, error] = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user.emailAddresses[0].toString())
      )
  );
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
    viewer: RoomDocument[];
  } | null>(null);

  useEffect(() => {
    if (!data) {
      return;
    }
    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
      viewer: RoomDocument[];
    }>(
      (acc, current) => {
        const roomData = current.data() as RoomDocument;

        switch (roomData.role) {
          case "owner":
            acc.owner.push({
              id: current.id,
              ...roomData,
            });
            break;
          case "editor":
            acc.editor.push({
              id: current.id,
              ...roomData,
            });
            break;
          case "viewer":
            acc.viewer.push({
              id: current.id,
              ...roomData,
            });
            break;
          default:
        }
        return acc;
      },
      {owner: [], editor: [], viewer: []}
    );
    setGroupedData(grouped);
  }, [data]);

  const menuOptions = (
    <>
      <NewDocumentButton />
      <div className='flex py-4 flex-col space-y-2 sm:max-w-48'>
        {groupedData && groupedData.owner.length === 0 ? (
          <h2 className='text-gray-500 font-semibold text-sm'>
            No Documents Found
          </h2>
        ) : (
          <>
            <h2 className='text-gray-500 font-semibold text-sm'>
              My Documents
            </h2>

            {groupedData?.owner.map((doc) => (
              <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
          </>
        )}

        {/* shared with me (editor) */}
        {groupedData && groupedData.editor.length > 0 && (
          <div className='flex py-4 flex-col space-y-2 md:max-w-48'>
            <h2 className='text-gray-500 font-semibold text-sm'>
              Shared with me(Editor)
            </h2>
            {groupedData.editor.map((doc) => (
              <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
          </div>
        )}

        {/* shared with me (viewer) */}
        {groupedData && groupedData.viewer.length > 0 && (
          <div className='flex py-4 flex-col space-y-2 md:max-w-48'>
            <h2 className='text-gray-500 font-semibold text-sm'>
              Shared with me (viewer)
            </h2>
            {groupedData.viewer.map((doc) => (
              <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
          </div>
        )}
      </div>
    </>
  );
  return (
    <div className='p-2 md:p-5 bg-gray-200 relative'>
      <div className='md:hidden'>
        <Sheet>
          <SheetTrigger>
            <MenuIcon className='p-2 hover:opacity-30 rounded-lg' size={40} />
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div>{menuOptions}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className='hidden md:inline'>{menuOptions}</div>
    </div>
  );
}
export default Sidebar;
