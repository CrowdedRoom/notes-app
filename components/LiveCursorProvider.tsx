"use client";

import {useMyPresence, useOthers} from "@liveblocks/react/suspense";
import FollowPointer from "./FollowPointer";

function LiveCursorProvider({children}: {children: React.ReactNode}) {
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();

  function handlePointerMove(event: React.PointerEvent) {
    updateMyPresence({cursor: {x: event.pageX, y: event.pageY}});
  }
  function handlePointerLeave() {
    updateMyPresence({cursor: null});
  }

  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      {others
        .filter((other) => other.presence.cursor !== null)
        .map(({connectionId, presence, info}) => (
          <FollowPointer
            key={connectionId}
            info={info}
            x={presence.cursor!.x}
            y={presence.cursor!.y}
          />
        ))}
      {children}
    </div>
  );
}
export default LiveCursorProvider;
