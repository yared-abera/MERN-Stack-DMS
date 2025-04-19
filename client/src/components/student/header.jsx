import { Bug, Home, LogOut, MessageSquareShare, View } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import StudentSideBar from "./sideBar";
import AvatarComponent from "../common/avatar";
import DarkMode from "../common/darkMode";
import Comment from "@/pages/student/comment";

import MyCommnt from "@/pages/student/myCommnt";
import { useSelector } from "react-redux";

const headerComponent = [
  { label: "home", url: "/student/home", icon: Home },
  { label: "viewDorm", url: "/student/dorm", icon: View },
  { label: "Maintenance Issue", url: "/student/issue", icon: Bug },

  {
    label: "CommentHover",
    url: "/student/commentHover",
    icon: MessageSquareShare,
  },
];

export default function StudentHeader() {
  const [time, setTime] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {user}=useSelector(state=>state.auth)
  const [selectedNavigation, setNavigation] = useState("");
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  function HandleRemoveDialog() {
    setIsDialogOpen(false);
    setNavigation("");
  }

  return (
    <>
      <div className="sticky top-0 w-full overflow-hidden p-3 z-30 border-b shadow-md dark:bg-black bg-white ">
       
        <div className="hidden md:flex items-center justify-between px-6">
          <div className="w-[60%] flex items-center justify-evenly ml-4 h-full gap-6">
            {headerComponent.map((item, idx) =>
              item.label === "CommentHover" ? (
                <DropdownMenu
                  key={idx}
                  open={menuOpen}
                  onOpenChange={setMenuOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      onMouseEnter={() => setMenuOpen(true)}
                      onMouseLeave={() => setMenuOpen(false)}
                      className={`flex items-center px-4 py-2 rounded-md transition ${
                        location.pathname === item.url
                          ? "bg-blue-500 text-white"
                          : "bg-sky-50 text-gray-700 hover:bg-sky-500"
                      }`}
                    >
                      <item.icon className="mr-2" />
                      {item.label}
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    side="bottom"
                    align="start"
                    className="w-40"
                    onMouseEnter={() => setMenuOpen(true)}
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    <DropdownMenuLabel>Comment Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setNavigation("submit");  
                        setIsDialogOpen(true);
                      }}>
                      submit Comment
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setNavigation("see");
                        setIsDialogOpen(true);
                      }}
                    >
                      My comment
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={idx}
                  to={item.url}
                  className={`flex items-center px-4 py-2 rounded-md transition ${
                    location.pathname === item.url
                      ? "bg-blue-500 text-white"
                      : "bg-sky-50 text-gray-700 hover:bg-sky-500"
                  }`}
                >
                  <item.icon className="mr-2" />
                  {item.label}
                </Link>
              )
            )}
          </div>

          <div className=" flex items-center justify-around  w-[40%]">
            <span className="text-xl font-bold">{time}</span>
            <DarkMode />
            <AvatarComponent />
          </div>
        </div>
 
        
        {selectedNavigation === "submit" && (
          <Comment
          
            isDialogOpen={isDialogOpen}
            HandleRemoveDialog={HandleRemoveDialog}
          />
        )}
     
        {selectedNavigation === "see" && (
          <MyCommnt
          
            isDialogOpen={isDialogOpen}
            HandleRemoveDialog={HandleRemoveDialog}
            id={user.id}
          />
        )}
     
        <div className="sm:flex md:hidden">
          <SidebarProvider className="sm:inline-flex md:hidden">
            <StudentSideBar />
            <main className="w-full">
              <SidebarTrigger />
              <Outlet/>
            </main>
          </SidebarProvider>
        </div>
      </div>

    
    </>
  );
}
