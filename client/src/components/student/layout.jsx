import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function StudentDashboard() {
  const [tab, setTab] = useState("view-dorm");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [maintenanceRequest, setMaintenanceRequest] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleTabChange = (newTab) => {
    setIsLoading(true);
    setTab(newTab);
    setTimeout(() => setIsLoading(false), 500); // Simulate loading
  };

  const handleSubmitMaintenance = () => {
    toast.success("Maintenance request submitted!");
    setMaintenanceRequest("");
  };

  const handleSubmitFeedback = () => {
    toast.success("Feedback submitted!");
    setFeedback("");
  };

  const handleProfileUpdate = () => {
    toast.success("Profile updated!");
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-all">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Student Dashboard</h1>
        <div className="flex gap-4">
          <Button variant="destructive" className="bg-red-500 text-white">Logout</Button>
          <Button variant="outline" onClick={() => document.body.classList.toggle("dark")}>
            Toggle Dark Mode
          </Button>
        </div>
      </header>
      
      {/* Navigation */}
      <div className="flex flex-wrap justify-center gap-4 my-6">
        {["view-dorm", "submit-maintenance", "submit-feedback", "profile"].map((item) => (
          <Button 
            key={item} 
            variant="ghost" 
            className={`transition-all transform hover:scale-105 active:scale-95 ${
              tab === item ? "bg-blue-500 text-white" : "hover:bg-blue-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => handleTabChange(item)}
          >
            {item.replace("-", " ").replace(/\b\w/g, (char) => char.toUpperCase())}
          </Button>
        ))}
      </div>
      
      {/* Main Content */}
      <motion.div 
        key={tab} 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -20 }} 
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-lg rounded-2xl overflow-hidden bg-white dark:bg-gray-800 transition-all">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {tab.replace("-", " ").replace(/\b\w/g, (char) => char.toUpperCase())}
            </h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
              </div>
            ) : (
              <div className="mt-4">
                {tab === "view-dorm" && (
                  <p className="text-gray-600 dark:text-gray-400">Check your assigned dorm details.</p>
                )}
                {tab === "submit-maintenance" && (
                  <div className="space-y-4">
                    <textarea
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder="Describe the issue..."
                      value={maintenanceRequest}
                      onChange={(e) => setMaintenanceRequest(e.target.value)}
                    />
                    <Button onClick={handleSubmitMaintenance}>Submit</Button>
                  </div>
                )}
                {tab === "submit-feedback" && (
                  <div className="space-y-4">
                    <textarea
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder="Your feedback..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                    <Button onClick={handleSubmitFeedback}>Submit</Button>
                  </div>
                )}
                {tab === "profile" && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder="Name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                    <input
                      type="email"
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder="Email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                    <Button onClick={handleProfileUpdate}>Update Profile</Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}