// components/maintenance/ReportMaintenance.jsx
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Maintainance_Issue, typeOfIssue } from "@/config/data";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ReportMaintenance() {
  const [formData, setFormData] = useState({
    userInfo: {
      fullName: "",
      blockNumber: "",
      roomNumber: "",
      phoneNumber: "",
      email: ""
    },
    issueTypes: Object.fromEntries(
      typeOfIssue.map(item => [item.name, false])
    ),
    description: "",
    otherIssue: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.description || !formData.userInfo.blockNumber || !formData.userInfo.roomNumber) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("/api/maintenance/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Submission failed");

      toast.success("Issue submitted successfully!");
      setFormData({
        userInfo: {
          fullName: "",
          blockNumber: "",
          roomNumber: "",
          phoneNumber: "",
          email: ""
        },
        issueTypes: Object.fromEntries(
          typeOfIssue.map(item => [item.name, false])
        ),
        description: "",
        otherIssue: ""
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="mt-4 md:mt-20 w-full grid grid-cols-1 gap-2 md:gap-4 min-h-screen px-2">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 p-2 rounded-lg">
        {/* User Information */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg md:text-2xl font-semibold text-center">
            User Information
          </h2>
          
          {Maintainance_Issue.map((item) => (
            <div key={item.name} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
              <Label className="text-sm md:text-base">{item.label}</Label>
              <Input
                value={formData.userInfo[item.name]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  userInfo: {
                    ...prev.userInfo,
                    [item.name]: e.target.value
                  }
                }))}
                placeholder={item.placeholder}
                type={item.type}
                required
              />
            </div>
          ))}
        </div>

        {/* Issue Selection */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg md:text-2xl font-semibold text-center">
            Issue Types
          </h2>
          
          <div className="w-full space-y-2">
            {typeOfIssue.map((item) => (
              <div key={item.name} className="flex items-center gap-2 p-1">
                <Checkbox
                  checked={formData.issueTypes[item.name]}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    issueTypes: {
                      ...prev.issueTypes,
                      [item.name]: checked
                    }
                  }))}
                />
                <Label>{item.label}</Label>
              </div>
            ))}
          </div>

          <div className="w-full mt-2">
            <Label>Other Issues</Label>
            <Input
              value={formData.otherIssue}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                otherIssue: e.target.value
              }))}
              placeholder="Describe other issues"
            />
          </div>
        </div>

        {/* Description & Submit */}
        <div className="col-span-full flex flex-col gap-4">
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              description: e.target.value
            }))}
            placeholder="Detailed description of the issue"
            className="min-h-[150px]"
            required
          />
          <Button type="submit">Submit Issue</Button>
        </div>
      </form>
    </div>
  );
}