import { BugIcon, Cuboid, Home, LayoutGrid, LogOut, UserRoundPen, View } from "lucide-react";
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
} from "../ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { LogOutUser } from "@/store/auth-slice";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ChevronUp } from "lucide-react";

const menuItems = [
  { title: "Home", url: "/dean/home", icon: Home },
  { title: "Dorm Allocation", url: "/dean/dorm", icon: LayoutGrid },
  { title: "View Student Info", url: "/dean/info", icon: View },
  { title: "View Block Info", url: "/dean/block", icon: Cuboid },
  { title: "Maintenance Issue", url: "/dean/issue", icon: BugIcon },
  { title: "Account", url: "/dean/account", icon: UserRoundPen },
];

export default function StudentDeanSideBar() {
  const location = useLocation();
  const dispatch = useDispatch();

  function HandleLogOut(){
    dispatch(LogOutUser())

  }

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      className="border-r shadow-sm bg-white dark:bg-gray-900"
    >
      <SidebarContent>
        <SidebarGroup>
          {/* Title - Full on desktop, short on mobile */}
          <div className="p-4">
            <SidebarGroupLabel className="hidden md:block text-2xl font-bold text-gray-800 dark:text-white">
              Student Dean
            </SidebarGroupLabel>
            <SidebarGroupLabel className="md:hidden text-xl font-bold text-gray-800 dark:text-white">
              SD
            </SidebarGroupLabel>
          </div>

          {/* Menu Items */}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                          "hover:bg-gray-100 dark:hover:bg-gray-800",
                          isActive && "bg-blue-50 dark:bg-blue-900/50"
                        )}
                      >
                        <item.icon 
                          className={cn(
                            "h-5 w-5",
                            isActive 
                              ? "text-blue-600 dark:text-blue-400" 
                              : "text-gray-600 dark:text-gray-400"
                          )} 
                        />
                        <span 
                          className={cn(
                            "text-sm font-medium transition-all duration-200",
                            "opacity-0 md:opacity-100", // Hide text on mobile, show on desktop
                            "absolute md:relative", // Position text for accessibility
                            "invisible md:visible", // Hide from layout on mobile
                            isActive 
                              ? "text-blue-600 dark:text-blue-400" 
                              : "text-gray-600 dark:text-gray-400"
                          )}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

     

        
      </SidebarContent>



      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <div className="flex items-center gap-2 text-center " >
                    <LogOut className="h-5 w-5 text-center ml-5"  />
                     
                    <ChevronUp className="h-4 w-4 ml-auto shrink-0" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                side="top" 
                className="w-48"
                align="start"
              >
                
                <DropdownMenuItem onClick={()=>HandleLogOut()}>
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