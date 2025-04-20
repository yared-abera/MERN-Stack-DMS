import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Wrench,
  FileText,
  User,
  Menu,
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
} from "../ui/sidebar";
import { setUpdateAllocation } from  "@/store/common/sidebarSlice";
import { Link, useLocation } from "react-router-dom"; // React Router imports

import { useSelector, useDispatch } from "react-redux";

const promSide = [
  { id: "registerBlock", label: "Register Block", icon: LayoutDashboard, url:"/proctor-manager/registerBlock" },
  { id: "updateAllocation", label: "Register Student", icon: Users , url:"/proctor-manager/registerStudent"},
  { id: "viewFeedback", label: "View Feedback", icon: MessageSquare , url:"/proctor-manager/viewFeedback"},
  { id: "viewMaintenance", label: "View Maintenance", icon: Wrench , url:"/proctor-manager/viewMaintenance"},
  { id: "messages", label: "Messages", icon: MessageSquare, url:"/messages"},
  { id: "generateReport", label: "Generate Report", icon: FileText , url:"/proctor-manager/generateReport"},
  { id: "profile", label: "Profile", icon: User , url:"/proctor-manager/profile"},
];

export default function SideBarComponent() {
  // const isOpen = useSelector((state) => state.sidebar.isOpen); 
  //  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const location = useLocation(); // Get current location
   

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="sm:text-lg sm:font-semibold md:text-2xl pt-6 font-bold mb-2 justify-center">
          Proctor Manager
          </SidebarGroupLabel>
          <SidebarGroupContent className='mt-4'>
            <SidebarMenu>
              {promSide.map((item) => (
                <SidebarMenuItem className="py-4" key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={`text-lg font-semibold hover:bg-slate-400 dark:hover:bg-blue-400 ${
                        location.pathname === item.url ? "bg-blue-500 text-white" : ""
                      }`} 
                    >
                      <item.icon />
                      <span className="text-xl ">{item.label}</span>
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
