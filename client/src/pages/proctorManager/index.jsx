import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Wrench,
  FileText,
  User,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarItem,
  SidebarFooter,
} from "@/components/ui/sidebar"; // Import ShadCN Sidebar components
import { cn } from "@/lib/utils";
import { RegisterBlock } from "../../components/proctor-manager/RegisterBlock.jsx";
import { RegisterStudent } from "../../components/proctor-manager/RegisterStudent.jsx";
import { ViewFeedback } from "../../components/proctor-manager/ViewFeedback.jsx";
import { ViewMaintenance } from "../../components/proctor-manager/ViewMaintenance.jsx";
import { GenerateReport } from "../../components/proctor-manager/GenerateReport.jsx";
import { ProfileManagement } from "../../components/proctor-manager/ProfileManagement.jsx";

export const ProctorManagerLayout = () => {
  const [activeSection, setActiveSection] = useState("registerBlock");
  const navigationItems = [
    { id: "registerBlock", label: "Register Block", icon: LayoutDashboard },
    { id: "registerStudent", label: "Register Student", icon: Users },
    { id: "viewFeedback", label: "View Feedback", icon: MessageSquare },
    { id: "viewMaintenance", label: "View Maintenance", icon: Wrench },
    { id: "generateReport", label: "Generate Report", icon: FileText },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar className="w-64 bg-white shadow-md">
        <SidebarHeader>
          <div className="flex flex-col items-center py-4">
            <Avatar className="h-12 w-12 mb-2" />
            <span className="text-lg font-semibold">Proctor Manager</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.id}
              className={cn(
                "w-full flex items-center gap-2 p-3 rounded-lg cursor-pointer",
                activeSection === item.id ? "bg-gray-200" : "hover:bg-gray-100"
              )}
              onClick={() => setActiveSection(item.id)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </SidebarItem>
          ))}
        </SidebarContent>
        <SidebarFooter className="p-4 text-center text-sm text-gray-500">
          &copy; 2025 Proctor Manager
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeSection === "registerBlock" && <RegisterBlock />}
        {activeSection === "registerStudent" && <RegisterStudent />}
        {activeSection === "viewFeedback" && <ViewFeedback />}
        {activeSection === "viewMaintenance" && <ViewMaintenance />}
        {activeSection === "generateReport" && <GenerateReport />}
        {activeSection === "profile" && <ProfileManagement />}
      </main>
    </div>
  );
};
