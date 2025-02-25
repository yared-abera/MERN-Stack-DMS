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
import { setUpdateAllocation } from  "@/store/common/sidebarSlice";

import { Link, useLocation } from "react-router-dom"; // React Router imports

import { useSelector, useDispatch } from "react-redux";

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
    icon: UserRoundPen,
  },
  {
    id: "registerStudent",
    title: "Register Student ",
    url: "/proctor/register",
    icon: UserRoundPen,
  },
  {
    id: "issue",
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
  const updateAllocation = useSelector((state) => state.sidebar.updateAllocation);
  const location = useLocation(); // Get current location
  const dispatch = useDispatch();

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
                     onClick={() => {item.id === "registerStudent" && dispatch(setUpdateAllocation(updateAllocation))}}  
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