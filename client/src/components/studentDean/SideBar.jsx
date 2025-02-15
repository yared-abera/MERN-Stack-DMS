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

const StudDeanSideBar = [
  {
    title: "Home",
    url: "/dean/home",
    icon: Home,
  },
  {
    title: "Dorm Allocation",
    url: "/dean/allocate",
    icon: LayoutGrid,
  },
  {
    title: "View Student Info",
    url: "/dean/info",
    icon: View,
  },
  {
    title: "Account",
    url: "/dean/account",
    icon: UserRoundPen,
  },
];

export default function StudentDeanSideBar() {
  const location = useLocation(); // Get current location

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="sm:text-lg sm:font-semibold md:text-2xl font-bold mb-4">
            Student Dean
          </SidebarGroupLabel>
          <SidebarGroupContent className='mt-4'>
            <SidebarMenu>
              {StudDeanSideBar.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={`text-lg font-semibold hover:bg-slate-400 dark:hover:bg-blue-400 ${
                        location.pathname === item.url ? "bg-blue-500 text-white" : ""
                      }`}
                    >
                      <item.icon />
                      <span>{item.title}</span>
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