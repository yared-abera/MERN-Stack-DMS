import { SidebarTrigger } from "../ui/sidebar";
import DarkMode from "@/components/common/darkMode";
import AvatarComponent from "@/components/common/avatar";

export default function Header() {
  return (
    <nav className="fixed top-0 w-full h-20 shadow-md flex items-center px-4 md:px-6 dark:bg-black bg-white">
      {/* Sidebar Trigger */}
      <div className="flex items-center">
        <SidebarTrigger />
    </div>

      {/* Spacer for center alignment
      <div className="flex-1"></div> */}

      {/* Right-side actions */}
      <div className="flex items-center gap-4">
        <DarkMode />
        <AvatarComponent />
      </div>
    </nav>
  );
}
