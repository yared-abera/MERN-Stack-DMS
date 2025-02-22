
import React from 'react'
import { toggleTheme } from "@/store/common/ThemeSlice";
import { useSelector, useDispatch } from "react-redux";
import { Moon, Sun } from "lucide-react";
export default function DarkMode() {
    const theme = useSelector((state) => state.theme.mode);
    const dispatch = useDispatch();

    const toggleDarkMode = () => {
      dispatch(toggleTheme(theme)); 
    }
  return (
    <button
    className="p-2 rounded-md text-gray-700 dark:text-gray-300"
    onClick={toggleDarkMode}
  >
    {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
  </button>
  )
}










