"use client";
import {useOthers, useSelf} from "@liveblocks/react/suspense";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";

function Avatars() {
  const self = useSelf();
  const others = useOthers();
  const all = [self, ...others];
  return (
    <div className='flex gap-2 items-center'>
      <p className='font-light text-sm'>Users currently view this page</p>
      <div className='flex -space-x-5'>
        {all.map((other) => (
          //   <Image
          //     key={other.id}
          //     src={other.info.avatar}
          //     alt={other.info.name}
          //     width={24}
          //     height={24}
          //     className='w-6 h-6 rounded-full'
          //   />
          <TooltipProvider key={other.id}>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className='border-2 hover:z-50'>
                  <AvatarImage src={other?.info.avatar} />
                  <AvatarFallback>{other?.info.name}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{self?.id === other?.id ? "You" : other.info.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
export default Avatars;
