import {
  ChartNoAxesColumn,
  ChevronUp, // Used for dropdown indicator
//   ContainerIcon, // Unused - removed
  FilePen,
  Hammer,
  Home,
  LayoutGrid,
  Loader, // Used potentially for loading state, or icon
  LogOut, // Used for logout icon
  TowerControl,
  UserRoundPen,
  View,
  // Add any other icons needed
  AlertCircle // Good icon for error messages, could be used elsewhere
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter // Removed trailing comma
} from "../ui/sidebar"; // Assuming this path is correct

// Assuming this action is meant to update allocation somehow
import { setUpdateAllocation } from "@/store/common/sidebarSlice";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion"; // Import motion, maybe AnimatePresence if needed for exit animations
import { toast } from "sonner";
import { LogOutUser } from "@/store/auth-slice"; // Assuming this is an async thunk
import { useState } from "react";

const ProSideBar = [
  {
    id: "home",
    title: "Home",
    url: "/proctor/home",
    icon: Home,
  },
  {
    id: "registerDorm",
    title: "Register Dorm",
    url: "/proctor/dorm",
    icon: LayoutGrid,
  },
  {
    id: "info",
    title: "View Student Info",
    url: "/proctor/info",
    icon: View,
  },
  {
    id: "report",
    title: "Generate Report",
    url: "/proctor/report",
    icon: ChartNoAxesColumn,
  },
  {
    id: "registerStudent",
    title: "Register Student",
    url: "/proctor/register",
    icon: FilePen,
  },
  {
    id: "issue",
    title: "Maintenance Issue",
    url: "/proctor/issue",
    icon: Hammer,
  },
  {
    id: "attendance", // Added ID for consistency
    title: "Attendance",
    url: "/proctor/attendance",
    icon: TowerControl,
  },
  {
    id: "control", // Added ID for consistency
    title: "Control",
    url: "/proctor/control",
    icon: Loader,
  },
  {
    id: "account", // Added ID for consistency
    title: "Account",
    url: "/proctor/account",
    icon: UserRoundPen,
  },
];

// Framer Motion Variants for subtle animations
const sidebarVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05, // Stagger the appearance of menu items
    },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function ProctorSideBar() {
  // Assuming updateAllocation is a boolean or some state relevant to registration
  const updateAllocation = useSelector((state) => state.sidebar.updateAllocation);
  const location = useLocation();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false); // State for logout loading

  // --- Fixed HandleLogOut function syntax and added loading state ---
  const HandleLogOut = async () => { // Made async to handle promise
    setIsLoggingOut(true); // Start loading state
    try {
        const data = await dispatch(LogOutUser()); // Use await

        if (data.payload?.success) { // Use optional chaining for safety
          toast.success(`${data.payload.message}`);
          // Assuming LogOutUser action also handles redirecting or clearing auth state
        } else {
          // Handle API error message from the payload
          const message = data.payload?.message || "Logout failed. Please try again.";
          toast.error(message);
          console.error("Logout failed:", message); // Log error for debugging
        }
    } catch (error) {
        // Handle unexpected errors (network, action failure)
        console.error("Logout error:", error);
        toast.error("An error occurred during logout.");
    } finally {
        setIsLoggingOut(false); // End loading state
    }
  };
  // --- End of Fixed HandleLogOut ---

  return (
    <Sidebar
      variant="floating"
      collapsible="icon" // Assuming your custom sidebar component handles this prop
      className="bg-gradient-to-b from-gray-50 to-white dark:from-neutral-900 dark:to-black border-r border-gray-200 dark:border-neutral-800 shadow-lg"
    >
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 pt-4 pb-2 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 tracking-tight justify-center sm:text-xl md:text-2xl">
            Proctor Portal
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-6"> {/* Reduced margin top slightly */}
            {/* Use motion.ul for list semantics and animations */}
            <motion.ul
              className="space-y-1" // Add vertical spacing between items
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              // AnimatePresence could be wrapped around the mapped items
              // if you need exit animations when items are removed/added dynamically.
              // For static sidebar items, it's usually not needed.
            >
              <SidebarMenu> {/* Keep SidebarMenu if it provides necessary structure */}
                {ProSideBar.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <motion.div
                        variants={menuItemVariants}
                        className="group/menu-item relative"
                      >
                        <SidebarMenuButton asChild>
                          <motion.div
                            whileHover={!isActive ? { scale: 1.03, x: 4 } : {}}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          >
                          <Link
                            to={item.url}
                            className={`
                              flex items-center gap-3 px-4 py-2.5 rounded-lg w-full
                              text-sm font-medium transition-all duration-200 ease-in-out
                                group relative
                              ${
                                isActive
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md scale-[1.02]"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white"
                              }
                            `}
                            onClick={() => {
                              if (item.id === "registerStudent") {
                                  dispatch(setUpdateAllocation(true));
                              }
                            }}
                          >
                            {isActive && (
                              <motion.div
                                className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-300 dark:bg-yellow-400 rounded-r-full"
                                  layoutId="activeIndicator"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              />
                            )}

                              {/* Update icon rendering */}
                              <div className="flex items-center justify-center w-5 h-5">
                                <item.icon 
                                  className={`w-full h-full transition-transform duration-200 group-hover:scale-110
                                    ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}
                                  `}
                                  strokeWidth={2}
                                  size={20}
                                />
                              </div>
                              <span className="truncate">
                              {item.title}
                            </span>
                          </Link>
                          </motion.div>
                        </SidebarMenuButton>
                      </motion.div>
                      </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </motion.ul>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              {/* --- Disable trigger while logging out --- */}
              <DropdownMenuTrigger asChild disabled={isLoggingOut}>
                <SidebarMenuButton className="w-full">
                  {/* --- Added text "Sign out" for expanded state --- */}
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    {/* Icon on the left */}
                    <div className="flex items-center justify-center w-5 h-5">
                      <LogOut 
                        className="w-full h-full transition-transform duration-200" 
                        strokeWidth={2}
                        size={20}
                      />
                    </div>
                    {/* Text that shows when sidebar is not collapsed */}
                    {/* You might need to adjust this based on how your Sidebar component handles collapsed state text */}
                    <span className="truncate">Sign out</span>
                    {/* Chevron on the right */}
                    <div className="flex items-center ml-auto">
                      <ChevronUp 
                        className="w-4 h-4 text-gray-500 dark:text-gray-400" 
                        strokeWidth={2}
                        size={16}
                      />
                     {/* Optional: Loader icon when logging out */}
                      {isLoggingOut && (
                        <Loader 
                          className="w-4 h-4 animate-spin ml-2" 
                          strokeWidth={2}
                          size={16}
                        />
                      )}
                    </div>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-48"
                align="start"
              >
                {/* --- Dropdown item triggers logout --- */}
                 {/* The dropdown item doesn't need to be disabled if the trigger is */}
                <DropdownMenuItem onClick={HandleLogOut}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}