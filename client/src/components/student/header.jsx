import { Bug, Home, LogOut, MessageSquareShare, UserCog, View,  } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

import StudentSideBar from "./sideBar";
import AvatarComponent from "../common/avatar";
import DarkMode from "../common/darkMode";
 
const headerComponent = [
  {
    label: "home",
    url: "/student/home",
    icon: Home,
  },
  {
    label: "viewDorm",
    url: "/student/dorm",
    icon: View,
  },
  {
    label: "Maintenance Issue",
    url: "/student/issue",
    icon: Bug,
  },
  {
    label: "Comment",
    url: "/student/comment",
    icon: MessageSquareShare  ,
  },
];

export default function StudentHeader() {
  const [time, setTime] = useState();
  const location = useLocation();

 
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());

      return () => clearInterval(interval);
    }, 1000);
  }, [time]);

  return (
    <>
      <div className="fixed top-0   z-10 h-auto py-3 shadow-lg border-solid w-[100vw]     ">
        <div className=" hidden md:flex   ">
     
          <div className="w-[60%] flex items-center justify-evenly ml-4 h-full gap-6">
            {headerComponent.map((item, index) => (
              <Link
                key={index}
                to={item.url}
                className={`flex sm:px-1 sm:py-2 dark:text-black   md:px-4 md:py-3 rounded-md hover:bg-sky-500 ${
                  location.pathname === item.url
                    ? "bg-blue-500 text-white"
                    : "bg-sky-50"
                }`}
              >
                <item.icon className="mr-2" />

                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className=" flex items-center justify-around  w-[40%]">
            <div>
              <h1 className="text-xl font-bold">{time}</h1>
            </div>

            <div>
             <DarkMode/>
            </div>
           

            <div>
              <AvatarComponent/>
            </div>
          </div>
        </div>

        <div className="sm:flex md:hidden">
          <SidebarProvider className="sm:inline-flex md:hidden">
            <StudentSideBar />
            <main className="w-full">
              <SidebarTrigger />
             
            </main>
          </SidebarProvider>
        </div>
      </div>
    </>
  );
}
