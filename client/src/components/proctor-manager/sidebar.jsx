import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar, setUpdateAllocation } from  "@/store/common/sidebarSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Wrench,
  FileText,
  User,
  Menu,
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navigationItems = [
  { id: "registerBlock", label: "Register Block", icon: LayoutDashboard, url:"/proctor-manager/registerBlock" },
  { id: "registerStudent", label: "Register Student", icon: Users , url:"/proctor-manager/registerStudent"},
  { id: "viewFeedback", label: "View Feedback", icon: MessageSquare , url:"/proctor-manager/viewFeedback"},
  { id: "viewMaintenance", label: "View Maintenance", icon: Wrench , url:"/proctor-manager/viewMaintenance"},
  { id: "generateReport", label: "Generate Report", icon: FileText , url:"/proctor-manager/generateReport"},
  { id: "profile", label: "Profile", icon: User , url:"/proctor-manager/profile"},
];

export default function SideBarComponent() {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const updateAllocation = useSelector((state) => state.sidebar.updateAllocation);
  const dispatch = useDispatch();
  const navigate = useNavigate();

   
  return (
    <Sidebar className={cn("bg-white shadow-md transition-all", isOpen ? "w-64" : "w-16")}>
      <SidebarHeader className="flex items-center justify-between p-4">
        <span className={cn("text-lg font-semibold", !isOpen && "hidden")}>
          Proctor Manager
        </span>
        <Menu className="h-6 w-6 cursor-pointer" onClick={() => dispatch(toggleSidebar())} />
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((item) => (
          <SidebarMenuItem
            key={item.id}
           onClick={() => {
            navigate(item.url)
            {item.id === "registerStudent" && dispatch(setUpdateAllocation(!updateAllocation))}
           }
           } 
            className="flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <item.icon className="h-5 w-5" />
            <span className={cn(!isOpen && "hidden")}>{item.label}</span>
          </SidebarMenuItem>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
