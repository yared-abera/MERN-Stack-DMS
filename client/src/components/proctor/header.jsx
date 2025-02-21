import { SidebarTrigger } from "../ui/sidebar";
import DarkMode from "@/components/common/darkMode";
import AvatarComponent from "@/components/common/avatar";

export default function Header() {
   
  return (

    <nav className="fixed top-0 left-0 md:left-64  w-full md:w-[calc(100%-16rem)] h-20 shadow-md flex items-center px-4 md:px-6 dark:bg-black bg-white justify-between transition-all duration-300">
      {/* Sidebar Trigger */}
      <div className="flex items-center">
        <SidebarTrigger  />
    </div>

      
      <div className="flex items-center gap-4 ml-auto  ">
        <DarkMode />
        <AvatarComponent />
      </div>
    </nav>
  );
}
