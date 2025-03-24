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
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(SubmitMaintainanceIssue(formData)).then(data => {
      if(data?.payload?.success){
        toast.success(`${data?.payload?.message}`)
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-200 flex flex-col items-center  mt-[5%]" >
  <h1 className="text-2xl font-bold text-gray-900">Maintenance Issue Submission</h1>
  <p className="mt-1 text-sm text-gray-500 text-center">Please fill in all required fields to submit a maintenance request</p>
</div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* User Information Section */}
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-800 mb-4">User Information</h2>
              {Maintainance_Issue.map((item, index) => (
                <div key={index} className="mb-4">
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    {item.label}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    value={formData.userInfo[item.name]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      userInfo: { ...prev.userInfo, [item.name]: e.target.value }
                    }))}
                    placeholder={item.placeholder}
                    type={item.type}
                    className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Issue Selection Section */}
          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-indigo-800 mb-4">Select Issue Types</h2>
              <div className="grid grid-cols-1 gap-4">
                {typeOfIssue.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md transition-all ${
                      formData.issueTypes[item.name]
                        ? 'bg-indigo-100 border-2 border-indigo-300'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`issue-${item.name}-${index}`}
                        checked={formData.issueTypes[item.name]}
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({
                            ...prev,
                            issueTypes: {
                              ...prev.issueTypes,
                              [item.name]: checked
                            }
                          }))
                        }}
                        className="h-5 w-5 text-indigo-600"
                      />
                      <div className="flex-1">
                        <Label 
                          htmlFor={`issue-${item.name}-${index}`}
                          className="block text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {item.label}
                        </Label>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </Label>
                <Input
                  value={formData.otherIssue}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    otherIssue: e.target.value
                  }))}
                  placeholder="Describe any other issues not listed above"
                  className="w-full focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <Label className="block text-sm font-medium text-gray-700 mb-3">
              Detailed Description
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
              placeholder="Please provide a detailed description of the issue..."
              className="w-full h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Submit Section */}
        <div className="px-8 py-4 border-t border-gray-200">
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="text-gray-700 hover:bg-gray-50"
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 shadow-sm transition-colors"
            >
              Submit Request
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}