import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from  "@/store/common/sidebarSlice";
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
  { id: "registerBlock", label: "Register Block", icon: LayoutDashboard },
  { id: "registerStudent", label: "Register Student", icon: Users },
  { id: "viewFeedback", label: "View Feedback", icon: MessageSquare },
  { id: "viewMaintenance", label: "View Maintenance", icon: Wrench },
  { id: "generateReport", label: "Generate Report", icon: FileText },
  { id: "profile", label: "Profile", icon: User },
];

export default function SideBarComponent() {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const dispatch = useDispatch();

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
