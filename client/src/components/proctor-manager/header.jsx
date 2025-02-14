import { useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, UserCircle, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md px-8 flex justify-between items-center">
      {/* Logo & Name */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Proctor Management System
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className={cn("hidden lg:flex gap-6 text-gray-700 dark:text-gray-300")}>
        <Link to="/dashboard" className="hover:text-blue-500">Dashboard</Link>
        <Link to="/profile" className="hover:text-blue-500">Profile</Link>
        <Link to="/reports" className="hover:text-blue-500">Reports</Link>
        <Link to="/feedback" className="hover:text-blue-500">Feedback</Link>
      </nav>

      {/* Right Section: Dark Mode & Profile */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          className="p-2 rounded-md text-gray-700 dark:text-gray-300"
          onClick={toggleDarkMode}
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <UserCircle size={28} />
            <span className="hidden lg:block">User</span>
          </button>
        </div>
      </div>
    </header>
  );
}
