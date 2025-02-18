import { Bug, Home, LogOut, MessageSquareShare, UserCog, View,  } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
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
    label: "feedback",
    url: "/student/issue",
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
      <div className="fixed top-0 w-full z-10 h-auto py-3 shadow-lg border-solid     ">
        <div className="hidden md:inline-flex w-full">
          <div className="w-[65%] flex items-center justify-evenly h-full gap-1">
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

          <div className="  w-[35%] flex items-center justify-around">
            <div>
              <h1 className="text-xl font-bold">{time}</h1>
            </div>

            <div>
              <Button>DarkMode</Button>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="bg-black cursor-pointer dark:bg-white">
                    <AvatarFallback className="bg-black dark:bg-white dark:text-black text-white font-extrabold">
                      xu
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-56">
                  <DropdownMenuLabel>Logged in as</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserCog
                      className="m-2 w-4 h-4"
                      onClick={() => navigate("/admin/account")}
                    />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="w-4 h-4 m-2" />
                    LogOut
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="sm:inline-flex md:hidden">
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
