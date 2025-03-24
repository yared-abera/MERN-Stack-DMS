import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Maintainance_Issue, typeOfIssue } from "@/config/data";
import { useState } from "react";

export default function ReportMaintenace() {
  const [IssueTrigered, setIssueTriggered] = useState(false);
  const [formData, setFormData] = useState({
    userInfo: Object.fromEntries(
      Maintainance_Issue.map((item) => [item.name, ""])
    ),
    issueTypes: Object.fromEntries(
      typeOfIssue.map((item) => [item.name, false])
    ),
    description: "",
    otherIssue: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your submission logic here
  };

  return (
    <div className="mt-4 md:mt-20 w-full grid grid-cols-1 gap-2 md:gap-4 min-h-screen px-2">
      {/* Issue Display Section */}
      <div className="w-full h-auto flex flex-col gap-2 my-4">
        <div className="w-1/2">
          <h1 className="text-center text-xl md:text-2xl font-semibold ">
            Issue User Submitted
          </h1>
        </div>

        {IssueTrigered ? (
          <div className="flex flex-wrap   gap-2 p-2">
            <div className="w-full md:w-auto p-3   rounded-lg shadow-md border border-sky-600">
              <h2 className="text-sm md:text-base">Issue Type: Electricity</h2>
              <p className="text-xs md:text-sm">Triggered By: Ahmed Yusuf</p>
              <p className="text-xs md:text-sm">Triggered Date: 12/34/12</p>
              <p className="text-xs md:text-sm">Status: Solved</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="text-gray-500">"No issue submitted by user"</p>
          </div>
        )}
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2   w-full gap-4  p-2 rounded-lg">
        {/* User Information // /**  */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg md:text-2xl font-semibold text-center">
            Enter User Information
          </h2>

          {Maintainance_Issue.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center"
            >
              <Label className="text-sm md:text-base">{item.label}</Label>
              <Input
                placeholder={item.placeholder}
                type={item.type}
                className="w-full text-sm md:text-base"
              />
            </div>
          ))}
        </div>

        {/* Issue Type Information */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg md:text-2xl font-semibold text-center mt-4 md:mt-0">
            Issue Type Information
          </h2>

          <div className="w-full space-y-2">
            {typeOfIssue.map((item, index) => (
              <div key={index} className="w-full flex items-center gap-2 p-1">
                <Checkbox
                  checked={formData.issueTypes[item.name]}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      issueTypes: { ...prev.issueTypes, [item.name]: checked },
                    }))
                  }
                  name={item.name}
                />
                <Label className="text-sm md:text-base">{item.label}</Label>
              </div>
            ))}
          </div>

          <div className="w-full mt-2">
            <Label className="block text-sm md:text-base mb-1">
              Other Issues:
            </Label>
            <Input
              placeholder="Enter other type of issue"
              className=" text-sm md:text-base"
            />
          </div>
        </div>
      </div>

      {/* Description & Submit */}
      <div className="flex flex-col md:flex-row items-center gap-4 p-2">
        <div className="w-full md:w-1/2">
          <Textarea
            placeholder="Enter description about the issue"
            className="w-full h-32 text-sm md:text-base"
          />
        </div>
        <Button
          className="w-full md:w-auto px-8 py-2 text-sm md:text-base"
          onClick={() => {
            console.log("button is clicked");
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
