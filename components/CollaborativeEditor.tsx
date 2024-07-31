"use client";
import {useRoom} from "@liveblocks/react/suspense";
import {useEffect, useState} from "react";
import * as Y from "yjs";
import {LiveblocksYjsProvider} from "@liveblocks/yjs";
import {MoonIcon, SunIcon} from "lucide-react";
import {Button} from "./ui/button";
import BlockNote from "./BlockNote";

export type EditorProps = {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  darkMode: boolean;
};

function CollaborativeEditor() {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);

  const style = `hover:text-white hover:text-gray-700 ${
    darkMode
      ? "text-gray-300 bg-gray-700 hover:bg-gray-100"
      : "text-gray-700 bg-gray-200 hover:bg-gray-300"
  }`;

  useEffect(() => {
    const doc = new Y.Doc();
    const provider = new LiveblocksYjsProvider(room, doc);
    setDoc(doc);
    setProvider(provider);
    return () => {
      provider.destroy();
      doc.destroy();
    };
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='flex items-center gap-2 justify-end mb-10'>
        {/* translate document */}
        {/* Chat to Document */}

        {/* dark mode  */}
        <Button className={style} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>
      {/* BlockNote */}
      <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
    </div>
  );
}
export default CollaborativeEditor;
