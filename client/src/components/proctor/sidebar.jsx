import { Home, LayoutGrid, UserRoundPen, View } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

import { Link, useLocation } from "react-router-dom"; // React Router imports

const ProSideBar = [
  {
    title: "Home",
    url: "/proctor/home",
    icon: Home,
  },
  {
    title: "Register Dorm",
    url: "/proctor/dorm",
    icon: LayoutGrid,
  },
  {
    title: "View Student Info",
    url: "/proctor/info",
    icon: View,
  },
  {
    title: "Generate Report",
    url: "/proctor/report",
    icon: UserRoundPen,
  },
  {
    title: "Register Student ",
    url: "/proctor/register",
    icon: UserRoundPen,
  },
  {
    title: "Maintenance Issue",
    url: "/proctor/issue",
    icon: UserRoundPen,
  },
  {
    title: "Account",
    url: "/proctor/account",
    icon: UserRoundPen,
  },
];

export default function ProctorSideBar() {
  
  const location = useLocation(); // Get current location

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="sm:text-lg sm:font-semibold md:text-4xl font-bold mb-2 justify-center">
            proctor
          </SidebarGroupLabel>
          <SidebarGroupContent className='mt-4'>
            <SidebarMenu>
              {ProSideBar.map((item) => (
                <SidebarMenuItem className="py-4" key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={`text-lg font-semibold hover:bg-slate-400 dark:hover:bg-blue-400 ${
                        location.pathname === item.url ? "bg-blue-500 text-white" : ""
                      }`}
                      
                    >
                      <item.icon />
                      <span className="text-xl ">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}