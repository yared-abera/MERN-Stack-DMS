import { SidebarTrigger } from "../ui/sidebar";
import DarkMode from "@/components/common/darkMode";
import AvatarComponent from "@/components/common/avatar";
import ChatButton from "@/components/common/ChatButton";
import { useState } from "react";

export default function Header() {
  
      const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar default state
    
      return (
        <nav
          className={`fixed top-0 left-0 h-20 shadow-md flex items-center px-4 md:px-6 dark:bg-black bg-white justify-between transition-all duration-300 ${
            isSidebarOpen ? "w-[calc(100%-16rem)] md:left-64" : " left-16 md:w-[calc(100%-4rem)]"
          }`}
        >
          {/* Sidebar Trigger */}
          <div className="flex items-center">
            <SidebarTrigger onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          </div>
    
          <div className="flex items-center gap-4 ml-auto">
            <DarkMode />
            <ChatButton />
            <AvatarComponent />
          </div>
        </nav>
      );
    }

