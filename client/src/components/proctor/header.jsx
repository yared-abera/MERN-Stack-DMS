import { SidebarTrigger } from "../ui/sidebar";

import DarkMode from "@/components/common/darkMode";
import AvatarComponent from "@/components/common/avatar";

export default function Header() { 
  return (
    <nav className="overflow-hidden fixed w-full h-20 top-0   md:p-4   border-solid shadow-md  flex gap-4  dark:bg-black bg-white ">
      <div className="flxe text-left ">
        <SidebarTrigger />
      </div>
      <div className="flex-1 flex md:gap-12 ">
        <div className="flex    w-1/2">
         
            </div>
            <div className="flex gap-4 justify-end      w-1/4">
            <DarkMode/>
            <AvatarComponent/> 
            </div>     
      </div>
    </nav>
  );
}
