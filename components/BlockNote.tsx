import {EditorProps} from "./CollaborativeEditor";
import {BlockNoteView} from "@blocknote/shadcn";
import {BlockNoteEditor} from "@blocknote/core";
import {useCreateBlockNote} from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import {useSelf} from "@liveblocks/react/suspense";
import {stringToColor} from "@/lib/stringToColor";

function BlockNote({doc, provider, darkMode}: EditorProps) {
  const userInfo = useSelf((me) => me.info);
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo?.name,
        color: stringToColor(userInfo?.email),
      },
    },
  });
  return (
    <div className='max-w-6xl mx-auto relative'>
      <BlockNoteView
        editor={editor}
        theme={darkMode ? "dark" : "light"}
        className='min-h-screen'
      />
    </div>
  );
}
export default BlockNote;
