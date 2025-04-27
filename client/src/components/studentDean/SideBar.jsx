import { motion } from "framer-motion"; // Import motion from framer-motion
import {
  BugIcon,
  CircleSlash2,
  Cuboid,
  Home,
  LayoutGrid,
  LogOut,
  TowerControlIcon,
  UserRoundPen,
  View,
  ChevronUp,
  FileTextIcon, // Changed from FileText to FileTextIcon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "../ui/sidebar"; // Ensure correct import path
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LogOutUser } from "@/store/auth-slice"; // Ensure correct import path
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"; // Ensure correct import path

import { toast } from "sonner"; // Ensure correct import path

const menuItems = [
  { title: "Home", url: "/dean/home", icon: Home },
  { title: "Dorm Allocation", url: "/dean/dorm", icon: LayoutGrid },
  { title: "View Student Info", url: "/dean/info", icon: View },
  { title: "View Block Info", url: "/dean/block", icon: Cuboid },
  { title: "Maintenance Issue", url: "/dean/issue", icon: BugIcon },
  { title: "Control", url: "/dean/control", icon: CircleSlash2 },
  { title: "Generate Report", url: "/dean/report", icon: FileTextIcon },
  { title: "Account", url: "/dean/account", icon: UserRoundPen },
];

export default function StudentDeanSideBar() {
  const location = useLocation();
  const dispatch = useDispatch();

  function HandleLogOut() {
    dispatch(LogOutUser()).then((data) => {
      if (data.payload.success) {
        toast.success(`${data.payload.message}`);
      } else {
        toast.error(`${data.payload.message}`);
      }
    });
  }

  return (
    // Use motion.aside or motion.div if animating the sidebar container itself
    // For simplicity, applying styles and letting the sidebar component handle structure
    <Sidebar
      variant="floating"
      collapsible="icon"
      className="border-r shadow-lg bg-white dark:bg-gray-900 min-h-screen flex flex-col" // Added shadow-lg, min-h-screen, flex-col
    >
      {/* Use flex-grow to push the footer to the bottom */}
      <SidebarContent className="flex-grow">
        <SidebarGroup>
          {/* Title - Full on desktop, short on mobile */}
          <div className="p-4">
            {/* Text will be visible on all screen sizes when sidebar is expanded */}
            <SidebarGroupLabel className="text-xl font-bold text-gray-800 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">
              Student Dean
            </SidebarGroupLabel>
          </div>

          {/* Menu Items */}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2"> {/* Adjusted space */}
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  // Use motion.div as a wrapper, not directly on the Link
                  <motion.div 
                    key={item.title} 
                    whileHover={{ x: 5 }}
                    className="w-full"
                  > 
                    <SidebarMenuItem>
                      {/* Wrap Button with motion for button animations */}
                      <motion.div
                        whileHover={{ scale: 1.02 }} // Subtle scale effect on hover
                        whileTap={{ scale: 0.98 }} // Subtle press effect
                        className="w-full" // Ensure motion.div takes full width
                      >
                        <SidebarMenuButton asChild>
                          <Link
                            to={item.url}
                            className={
                              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 ease-in-out
                               hover:bg-gray-100 dark:hover:bg-gray-800
                               ${isActive
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400" // Enhanced active state
                                : "text-gray-600 dark:text-gray-400" // Default state
                              }`
                            }
                          >
                            {/* Icon color controlled by the Link className isActive state */}
                            <item.icon className="h-5 w-5 shrink-0" />

                            {/* Text is now visible on all screen sizes when expanded */}
                            {/* The sidebar component should handle hiding it when collapsed */}
                            {/* Add whitespace-nowrap and overflow-hidden for cleaner look when sidebar is narrow */}
                            <span
                              className={`text-sm font-medium transition-all duration-200 ease-in-out whitespace-nowrap overflow-hidden text-ellipsis
                                ${isActive
                                  ? "text-blue-700 dark:text-blue-400" // Match text color to active state
                                  : "text-gray-600 dark:text-gray-400" // Match text color to default state
                                }`
                              }
                            >
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </motion.div>
                    </SidebarMenuItem>
                  </motion.div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-gray-200 dark:border-gray-700"> {/* Added border to footer */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* Wrap Logout button with motion */}
                <motion.div
                    whileHover={{ scale: 1.02 }} // Subtle scale effect on hover
                    whileTap={{ scale: 0.98 }} // Subtle press effect
                    className="w-full" // Ensure motion.div takes full width
                >
                    <SidebarMenuButton className="w-full justify-center"> {/* Center content for collapsed state */}
                      <div className="flex items-center gap-2">
                        {/* Icon should also be styled based on context if possible,
                           but hardcoding a fixed margin here might be problematic
                           when the sidebar is collapsed. Let's keep it simple
                           and rely on gap-2 and potential centering */}
                        <LogOut className="h-5 w-5 text-gray-600 dark:text-gray-400 shrink-0" /> {/* Icon color */}

                        {/* Chevron is likely for the dropdown, may not need to animate */}
                        <ChevronUp className="h-4 w-4 shrink-0 ml-auto text-gray-600 dark:text-gray-400" /> {/* Chevron color */}
                      </div>
                    </SidebarMenuButton>
                 </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-48" align="start">
                {/* DropdownMenuItem is simple, probably doesn't need motion */}
                <DropdownMenuItem onClick={() => HandleLogOut()}>
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