import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { typeOfIssue } from "@/config/data";
import {
  GetMaintenanceIssueForAuser,
  SubmitMaintainanceIssue,
  VerificationIssue,
} from "@/store/maintenanceIssue/maintenanceIssue";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function MaintenanceIssueSubmit({ ThisUser }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const initialFormState = {
    id: user?.id || "",
    Model: capitalizeFirstLetter(user?.role || ""),
    userInfo: ThisUser
      ? {
          Fname: ThisUser.Fname || "",
          Mname: ThisUser.Mname || "",
          Lname: ThisUser.Lname || "",
          Gender: ThisUser.sex || "",
          userName: ThisUser.userName || "",
          block: ThisUser.blockNum || "",
          dorm: ThisUser.dormId || "",
          phoneNumber: ThisUser.phoneNum || "",
        }
      : {},
    issueTypes: typeOfIssue.map((item) => ({
      issue: false,
      name: item.name,
      description: item.description,
    })),
    otherIssue: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [IssueTriggered, setIssueTriggered] = useState(null);
  const [statusChange, setStatusChange] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  // Sync ThisUser into formData.userInfo
  useEffect(() => {
    if (ThisUser) {
      setFormData((prev) => ({
        ...prev,
        userInfo: {
          Fname: ThisUser.Fname || "",
          Mname: ThisUser.Mname || "",
          Lname: ThisUser.Lname || "",
          Gender: ThisUser.sex || "",
          userName: ThisUser.userName || "",
          block: ThisUser.blockNum || "",
          dorm: ThisUser.dormId || "",
          phoneNumber: ThisUser.phoneNum || "",
        },
      }));
    }
  }, [ThisUser]);

  // Fetch existing issues
  useEffect(() => {
    const id = user.id;
    const Model = capitalizeFirstLetter(user.role);
    dispatch(GetMaintenanceIssueForAuser({ id, Model })).then((data) => {
      if (data?.payload?.success) {
        setIssueTriggered(data.payload.data);
      }
    });
  }, [dispatch]);

  // Handlers
  const handleCheckboxChange = (idx, checked) =>
    setFormData((prev) => {
      const issues = [...prev.issueTypes];
      issues[idx].issue = checked;
      return { ...prev, issueTypes: issues };
    });

  const handleDescriptionChange = (idx, desc) =>
    setFormData((prev) => {
      const issues = [...prev.issueTypes];
      issues[idx].description = desc;
      return { ...prev, issueTypes: issues };
    });

  const handleClearForm = () => {
    setFormData(initialFormState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selected = formData.issueTypes
      .filter((it) => it.issue)
      .map((it) => ({ issue: it.name, description: it.description }));
    if (formData.otherIssue.trim()) {
      selected.push({
        issue: formData.otherIssue.trim(),
        description: formData.description.trim(),
      });
    }
    const payload = { ...formData, issueTypes: selected };
    dispatch(SubmitMaintainanceIssue(payload)).then((data) => {
      if (data.payload?.success) {
        toast.success(data.payload.message);
        handleClearForm();
      } else {
        toast.error(data.payload?.message || "Submission failed");
      }
    });
  };

  const handleStatusChange = (list) => {
    setStatusChange(list);
    setOpenDialog(true);
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setStatusChange({});
  };
  {
    /**{id: '680bc19e8929f29c417e27eb', issue: 'electric', status: 'verified'} */
  }
  // const handleContinue = () => {
  //       // TODO: dispatch status update to backend
  //       console.log(statusChange);

  //       // Destructure status, issue, and _id directly from statusChange
  //       const { status, issue, _id } = statusChange;

  //       // Create the verified object as requested
  //       const verified = {
  //          status:'Resolved', // or status: status
  //           issue,  // or issue: issue
  //           id:_id     // or _id: _id
  //       };

  //       // You can optionally log the 'verified' object if needed
  //       console.log("Verified object:", verified);

  //       // Dispatch the action using the destructured values
  //       dispatch(VerificationIssue(verified)).then(data=>{
  //     if(data.payload.success){
  //       toast.success("Status updated to Verified");
  //     }
  //   })

  //       setOpenDialog(false);

  //       setStatusChange({});

  //       // Changed toast message based on context of "verified object"
  //     };

  const handleContinue = () => {
    if (!statusChange._id) {
      toast.error("No issue selected");
      return;
    }

    const verificationData = {
      issue: statusChange.issue,
      status: "Resolved", // Use lowercase for consistency
      id: statusChange._id,
    };

    dispatch(VerificationIssue(verificationData))
      .then((result) => {
        if (result.payload?.success) {
          toast.success(`Status updated to Resolved`);
          // Refresh issues list
          dispatch(
            GetMaintenanceIssueForAuser({
              id: user.id,
              Model: capitalizeFirstLetter(user.role),
            })
          );
        }
      })
      .catch((error) => {
        toast.error(error.message || "Update failed");
      });

    setOpenDialog(false);
    setStatusChange({});
  };
  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change status to Resolved?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p className="mb-4">
              Are you sure you want to mark issue{" "}
              <strong>{statusChange.issue}</strong> as Resolved?
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleContinue}>Continue</Button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Maintenance Issue Submission
          </h1>
          <p className="text-blue-100">
            Please fill in all required fields to submit a maintenance request
          </p>
        </div>

        {/* Previously Submitted Issues */}
        <div className="px-6 py-8">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Previously Submitted Issues
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {IssueTriggered?.issueTypes?.length ? (
              IssueTriggered.issueTypes.map((list, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-lg border p-4 hover:shadow-xl transition"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">
                        {list.issue.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{list.issue}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {new Date(list.createdAt).toLocaleDateString()}
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      list.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {list.status}
                  </span>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label>Mark as Resolved:</Label>
                      <input
                        type="radio"
                        name={`resolve-${idx}`}
                        checked={statusChange._id === list._id}
                        onChange={() => handleStatusChange(list)}
                        className="h-4 w-4"
                      />
                    </div>
                    {Object.keys(statusChange).length > 0 &&
                      statusChange._id === list._id && (
                        <Button
                          variant="ghost"
                          onClick={() => setStatusChange({})}
                          className="text-red-500 hover:text-red-700"
                        >
                          Clear selection
                        </Button>
                      )}
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No issues have been submitted yet.
              </p>
            )}
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 pb-8">
          {/* User Information */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">
              User Information
            </h2>
            <div className="space-y-4">
              {[
                { label: "First Name", value: ThisUser.Fname },
                { label: "Middle Name", value: ThisUser.Mname },
                { label: "Last Name", value: ThisUser.Lname },
                { label: "Gender", value: ThisUser.sex },
                { label: "User Name", value: ThisUser.userName },
                { label: "Block Number", value: ThisUser.blockNum },
                { label: "Dorm Number", value: ThisUser.dormId },
              ].map((field, i) => (
                <div key={i} className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">
                    {field.label}
                  </Label>
                  <Input
                    readOnly
                    value={field.value}
                    className="bg-white cursor-not-allowed"
                  />
                </div>
              ))}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  value={formData.userInfo.phoneNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userInfo: {
                        ...prev.userInfo,
                        phoneNumber: e.target.value,
                      },
                    }))
                  }
                />
                <p className="text-xs text-gray-500">
                  You can modify the phone number
                </p>
              </div>
            </div>
          </div>

          {/* Issue Types */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-6">
              Select Issue Types
            </h2>
            <div className="space-y-4">
              {formData.issueTypes.map((item, idx) => {
                const label = typeOfIssue.find(
                  (t) => t.name === item.name
                )?.label;
                const desc = typeOfIssue.find(
                  (t) => t.name === item.name
                )?.description;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg transition-all ${
                      item.issue
                        ? "bg-indigo-100 border-2 border-indigo-300"
                        : "bg-white border border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={item.issue}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(idx, checked)
                        }
                      />
                      <div className="flex-1 space-y-2">
                        <Label className="text-sm font-medium text-gray-900">
                          {label}
                        </Label>
                        <p className="text-sm text-gray-500">{desc}</p>
                        {item.issue && (
                          <Textarea
                            value={item.description}
                            onChange={(e) =>
                              handleDescriptionChange(idx, e.target.value)
                            }
                            placeholder="More details..."
                            rows={3}
                            className="mt-2 resize-none"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Other Issue */}
        <div className="px-6 pb-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
            <h2 className="text-2xl font-semibold text-purple-800 mb-6">
              Other Issue
            </h2>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Issue Name
                </Label>
                <Input
                  value={formData.otherIssue}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherIssue: e.target.value,
                    }))
                  }
                  placeholder="Custom issue (max 12 chars)"
                  maxLength={12}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Details (max 30 chars)"
                  rows={3}
                  maxLength={30}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 px-6 pb-8">
          <Button variant="outline" onClick={handleClearForm}>
            Clear Form
          </Button>
          <Button type="submit" className="bg-blue-600 text-white">
            Submit Issue
          </Button>
        </div>
      </form>
    </div>
  );
}
