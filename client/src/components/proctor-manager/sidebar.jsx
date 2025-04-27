import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Wrench,
  FileText,
  User,
  Menu,
  LucideFireExtinguisher,
  OctagonPauseIcon,
  HammerIcon,
  LucideTowerControl,
  LogOut,
  ChevronUp,
  Ratio,
  LucideHome,
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
  SidebarFooter,
} from "../ui/sidebar"; // Assuming this path is correct
import { setUpdateAllocation } from "@/store/common/sidebarSlice"; // Assuming this path is correct
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion"; // Import motion
import { toast } from "sonner";
import { LogOutUser } from "@/store/auth-slice";

const ProSideBar = [
  {
    id: "home",
    label: "Home",
    icon: LucideHome ,
    url: "/proctor-manager/home",
  },
  {
    id: "registerBlock",
    label: "Register Block",
    icon: LayoutDashboard,
    url: "/proctor-manager/registerBlock",
  },
  {
    id: "updateAllocation",
    label: "Update Allocation",
    icon: Users,
    url: "/proctor-manager/registerStudent",
  },

  {
    id: "viewMaintenance",
    label: "View Maintenance",
    icon: Wrench,
    url: "/proctor-manager/viewMaintenance",
  },
  {
    id: "generateReport",
    label: "Generate Report",
    icon: FileText,
    url: "/proctor-manager/generateReport",
  },
  {
    id: "Attendance",
    label: "Attendance Report",
    icon: OctagonPauseIcon,
    url: "/proctor-manager/attendance",
  },
  {
    id: "Control",
    label: "control",
    icon: Ratio,
    url: "/proctor-manager/Control",
  },
  {
    id: "viewFeedback",
    label: "View Feedback",
    icon: MessageSquare,
    url: "/proctor-manager/viewFeedback",
  },

  {
    id: "Account",
    label: "Account",
    icon: User,
    url: "/proctor-manager/Account",
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

export default function SideBarComponent() {
  const updateAllocation = useSelector(
    (state) => state.sidebar.updateAllocation
  );
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
    // Added some base styling to the sidebar itself for a modern look
    <Sidebar
      variant="floating"
      collapsible="icon"
      className="bg-gradient-to-b from-gray-50 to-white dark:from-neutral-900 dark:to-black border-r border-gray-200 dark:border-neutral-800 shadow-lg"
    >
      <SidebarContent className="p-2">
        {" "}
        {/* Added padding around content */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-8 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 tracking-tight justify-center sm:text-lg md:text-xl">
            Proctor Manager Portal {/* Changed text content for clarity */}
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-10">
            {" "}
            {/* Reduced margin top slightly */}
            {/* Use motion.ul for list semantics and animations */}
            <motion.ul
              className="space-y-1" // Add vertical spacing between items
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
            >
              <SidebarMenu>
                {" "}
                {/* Keep SidebarMenu if it provides necessary structure */}
                {ProSideBar.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    // Use motion.div instead of motion.li to avoid nesting li elements
                    <motion.div key={item.label} variants={menuItemVariants}>
                      <SidebarMenuItem className="p-0 ">
                        {" "}
                        {/* Remove padding from item wrapper */}
                        <SidebarMenuButton asChild>
                          <Link
                            to={item.url}
                            className={`
                              flex items-center gap-5 px-4 py-2.5 rounded-lg w-full
                              text-sm font-medium transition-all duration-200 ease-in-out
                              group relative {/* Added group for potential icon animations */}
                              ${
                                isActive
                                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md scale-[1.02]" // Enhanced active state
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white hover:scale-[1.03] hover:translate-x-1" // Enhanced hover state
                              }
                            `}
                            onClick={() => {
                              if (item.id === "registerStudent") {
                                dispatch(setUpdateAllocation(updateAllocation)); // Keep original logic
                              }
                            }}
                            // Remove whileHover from Link component
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 15,
                            }}
                          >
                            {/* Active indicator (optional, a subtle line on the left) */}
                            {isActive && (
                              <motion.div
                                className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-300 dark:bg-yellow-400 rounded-r-full"
                                layoutId="activeIndicator" // Animate layout changes smoothly
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              />
                            )}

                            <item.icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                            <span className="truncate">
                              {" "}
                              {/* Use truncate if text might overflow */}
                              {item.label}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
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
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <div className="flex items-center gap-2 text-center ">
                    <LogOut className="h-5 w-5 text-center ml-5" />

                    <ChevronUp className="h-4 w-4 ml-auto shrink-0" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-48" align="start">
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
