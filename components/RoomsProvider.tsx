"use client";

import {LiveList, LiveObject} from "@liveblocks/client";
import {
  RoomProvider as RoomProviderWapper,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import LoadingSpinner from "./LoadingSpinner";
import LiveCursorProvider from "./LiveCursorProvider";
function RoomsProvider({
  roomId,
  children,
}: {
  roomId: string;
  children: React.ReactNode;
}) {
  return (
    <RoomProviderWapper
      id={roomId}
      initialPresence={{cursor: null}}
      //   initialStorage={{
      //     people: new LiveList([new LiveObject({name: "Alice", age: 30})]),
      //   }}
    >
      <ClientSideSuspense fallback={<LoadingSpinner />}>
        {/* Live Cursor */}
        <LiveCursorProvider>{children}</LiveCursorProvider>
      </ClientSideSuspense>
    </RoomProviderWapper>
  );
}
export default RoomsProvider;
