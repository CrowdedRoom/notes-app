import RoomsProvider from "@/components/RoomsProvider";
import {auth} from "@clerk/nextjs/server";

function DocLayout({
  children,
  params: {id},
}: {
  children: React.ReactNode;
  params: {id: string};
}) {
  auth().protect();
  return <RoomsProvider roomId={id}>{children}</RoomsProvider>;
}
export default DocLayout;
