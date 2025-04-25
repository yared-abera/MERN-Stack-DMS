import { Bug, Home, LogOut, MessageSquareShare, View, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
import DarkMode from "../common/darkMode";
import Comment from "@/pages/student/comment";
import MyCommnt from "@/pages/student/myCommnt";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { LogOutUser } from "@/store/auth-slice";
import { motion } from "framer-motion";

const headerComponent = [
  { label: "Home", url: "/student/home", icon: Home },
  { label: "View Dorm", url: "/student/dorm", icon: View },
  { label: "Maintenance Issue", url: "/student/issue", icon: Bug },
  { label: "Comments", url: "#", icon: MessageSquareShare },
];

export default function StudentHeader() {
  const [time, setTime] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [selectedNavigation, setNavigation] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  function HandleRemoveDialog() {
    setIsDialogOpen(false);
  }

  function handleLogOut() {
    dispatch(LogOutUser());
  }

  return (
    <div className="fixed h-24 top-0 w-full p-3 z-20 border-b border-blue-600 shadow-lg bg-gray-400/45 dark:bg-gray-900 text-gray-100">
      {/* Desktop Header - shown only on md screens and up */}
      <div className="hidden md:flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-6">
          {headerComponent.map((item, idx) =>
            item.label === "Comments" ? (
              <DropdownMenu
                key={idx}
                open={menuOpen}
                onOpenChange={setMenuOpen}
              >
                <motion.div
                  onMouseEnter={() => setMenuOpen(true)}
                  onMouseLeave={() => setMenuOpen(false)}
                  whileHover={{ scale: 1.05 }}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center px-4 py-2 rounded-full transition-all duration-300 ease-in-out text-blue-600 hover:bg-blue-600 hover:text-white dark:text-gray-400 dark:hover:bg-blue-700 group"
                    >
                      <item.icon className="mr-2 w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
                      {item.label}
                    </button>
                  </DropdownMenuTrigger>
                </motion.div>

                <DropdownMenuContent
                  side="bottom"
                  align="start"
                  className="w-48 bg-slate-500 dark:bg-gray-700 text-white dark:text-gray-100 rounded-md shadow-xl border border-gray-600"
                  onMouseEnter={() => setMenuOpen(true)}
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <DropdownMenuLabel className="text-blue-200 dark:text-blue-400">
                    Comment Actions
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-600" />
                  <DropdownMenuItem
                    className="flex items-center px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer rounded-md transition-colors"
                    onClick={() => {
                      setNavigation("submit");
                      setIsDialogOpen(true);
                      setMenuOpen(false);
                    }}
                  >
                    <MessageSquareShare className="mr-2 w-4 h-4 text-green-400 group-hover:text-white" />
                    Submit Comment
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer rounded-md transition-colors"
                    onClick={() => {
                      setNavigation("see");
                      setIsDialogOpen(true);
                      setMenuOpen(false);
                    }}
                  >
                    <View className="mr-2 w-4 h-4 text-purple-400 group-hover:text-white" />
                    My Comments
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div key={idx} whileHover={{ scale: 1.05 }}>
                <Link
                  to={item.url}
                  className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ease-in-out group ${
                    location.pathname === item.url
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-blue-600 hover:bg-blue-600 hover:text-white dark:text-gray-400 dark:hover:bg-blue-700"
                  }`}
                >
                  <item.icon
                    className={`mr-2 w-5 h-5 ${
                      location.pathname === item.url
                        ? "text-white"
                        : "text-blue-400 group-hover:text-white"
                    } transition-colors`}
                  />
                  {item.label}
                </Link>
              </motion.div>
            )
          )}
        </div>

        <div className="flex items-center justify-between gap-6">
          <span className="text-lg font-semibold text-blue-400">{time}</span>
          <DarkMode />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="bg-blue-600 cursor-pointer ring-2 ring-blue-400 hover:ring-blue-500 transition-colors">
                <AvatarFallback className="bg-blue-700 text-white font-extrabold">
                  {user?.username
                    ? user.username.slice(0, 2).toUpperCase()
                    : "YA"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              className="w-56 bg-gray-700 dark:bg-gray-800 text-gray-200 dark:text-gray-100 rounded-md shadow-xl border border-gray-600"
            >
              <DropdownMenuLabel className="text-blue-400">
                Logged in as{" "}
                <span className="text-violet-400 text-sm md:text-base">
                  {user?.username}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-600" />
              <DropdownMenuItem className="flex items-center px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer rounded-md transition-colors">
                <UserCog className="mr-2 w-4 h-4 text-blue-400" />
                <Link to="/student/account">
                  Profile
                </Link>
               
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-600" />
              <DropdownMenuItem
                onClick={handleLogOut}
                className="flex items-center px-4 py-2 hover:bg-red-600 hover:text-white text-red-400 cursor-pointer rounded-md transition-colors"
              >
                <LogOut className="mr-2 w-4 h-4 text-red-400" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Comment dialogs */}
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
          id={user?.id}
        />
      )}

      {/* Mobile Sidebar - no header, only sidebar trigger */}
      <div className="md:hidden">
        <SidebarProvider>
          <StudentSideBar />
          <SidebarTrigger />
        </SidebarProvider>
      </div>
    </div>
  );
}