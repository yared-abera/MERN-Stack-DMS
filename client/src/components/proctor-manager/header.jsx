import { useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, UserCircle, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import DarkMode from "@/components/common/darkMode";
import AvatarComponent from "../common/avatar";
import ChatButton from "../common/ChatButton";

export default function Header() {  
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md px-4 pt-8 flex justify-between items-center">
      {/* Logo & Name */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Proctor Manager
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className={cn("hidden lg:flex gap-6 text-gray-700 dark:text-gray-300")}>
        <Link to="/dashboard" className="hover:text-blue-500">Dashboard</Link>
        <Link to="/profile" className="hover:text-blue-500">Profile</Link>
        <Link to="/reports" className="hover:text-blue-500">Reports</Link>
        <Link to="/feedback" className="hover:text-blue-500">Feedback</Link>
      </nav>

      {/* Right Section: Dark Mode, Chat & Profile */}
      <div className="flex items-center gap-4">
        {/* dark mode component */}
        <DarkMode/>
        
        {/* Chat Button */}
        <ChatButton />
         
        {/* User Profile Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <AvatarComponent/>
          </button>
        </div>
      </div>
    </header>
  );
}
