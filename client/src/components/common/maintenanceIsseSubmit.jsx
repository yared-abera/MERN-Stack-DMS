import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Maintainance_Issue, typeOfIssue } from "@/config/data";
import { SubmitMaintainanceIssue } from "@/store/maintenanceIssue/maintenanceIssue";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { format } from "date-fns";
import { CheckCircle2 } from "lucide-react";

export default function MaintenanceIssueSubmit() {
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionDate, setSubmissionDate] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(SubmitMaintainanceIssue(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(`${data?.payload?.message}`);
        setIsSubmitted(true);
        setSubmissionDate(new Date());
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">
              Maintenance Request Submitted!
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Your request has been received. Here are the details:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-gray-50 rounded-lg">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Submission Date:
                </Label>
                <p className="text-gray-600">
                  {format(submissionDate, "MMMM do, yyyy 'at' h:mm a")}
                </p>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Requester Information:
                </Label>
                <p className="text-gray-600">
                  {formData.userInfo.firstName} {formData.userInfo.lastName}
                </p>
                <p className="text-gray-600">{formData.userInfo.email}</p>
                <p className="text-gray-600">{formData.userInfo.phone}</p>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status:
                </Label>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                  Pending Review
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Reported Issues:
                </Label>
                <ul className="list-disc pl-5 space-y-2">
                  {typeOfIssue.map((issue) =>
                    formData.issueTypes[issue.name] ? (
                      <li key={issue.name} className="text-gray-600">
                        {issue.label}
                      </li>
                    ) : null
                  )}
                  {formData.otherIssue && (
                    <li className="text-gray-600">{formData.otherIssue}</li>
                  )}
                </ul>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Description:
                </Label>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {formData.description}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3"
            >
              Submit New Request
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Original form JSX remains the same below
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* ... keep the existing form JSX exactly as it was ... */}
    </div>
  );
}