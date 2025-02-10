import { useState } from "react";
import { LayoutDashboard, Users, MessageSquare, Wrench, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {RegisterBlock} from "../../components/proctor-manager/RegisterBlock.jsx";
import {RegisterStudent} from  "../../components/proctor-manager/RegisterStudent.jsx";
import {ViewFeedback} from  "../../components/proctor-manager/ViewFeedback.jsx";
import {ViewMaintenance} from "../../components/proctor-manager/ViewMaintenance.jsx";
import {GenerateReport} from '../../components/proctor-manager/GenerateReport.jsx';
import {ProfileManagement} from "../../components/proctor-manager/ProfileManagement.jsx"; 




 export const ProctorManagerLayout = () => {
  const [activeSection, setActiveSection] = useState("registerBlock");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <nav className="space-y-2">
          <Button
            variant={activeSection === "registerBlock" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("registerBlock")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Register Block
          </Button>
          <Button
            variant={activeSection === "registerStudent" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("registerStudent")}
          >
            <Users className="mr-2 h-4 w-4" />
            Register Student
          </Button>
          <Button
            variant={activeSection === "viewFeedback" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("viewFeedback")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            View Feedback
          </Button>
          <Button
            variant={activeSection === "viewMaintenance" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("viewMaintenance")}
          >
            <Wrench className="mr-2 h-4 w-4" />
            View Maintenance
          </Button>
          <Button
            variant={activeSection === "generateReport" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("generateReport")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button
            variant={activeSection === "profile" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("profile")}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </nav>
      </aside>

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

 