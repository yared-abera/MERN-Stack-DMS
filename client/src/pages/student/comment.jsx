import CommonForm from "@/components/common/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// Added missing import
import { Comment_Report } from "@/config/data";
import { getFeedBackForUser, InsertFeedBack } from "@/store/feedBack/feedBack";
import { getSingleStudent } from "@/store/studentAllocation/allocateSlice";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Comment({isDialogOpen,
  HandleRemoveDialog}) {
  const { user } = useSelector((state) => state.auth);
  const { AllFeedBack } = useSelector((state) => state.feedBack);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [thisStudent, setThisStudent] = useState(null); // Renamed to thisStudent
  const [formData, setFormData] = useState({
    userInfo: {},
    description: "",
  });
 
  // Fetch student data
  useEffect(() => {
    if (user?.id) {
      dispatch(getSingleStudent({ id: user.id })).then((data) => {
        if (data?.payload?.success) {
          setThisStudent(data.payload.data);
        }
      });
    }
  }, [user, dispatch]);

  // Initialize form data when student data loads
  useEffect(() => {
    if (thisStudent) {
      setFormData((prev) => ({
        ...prev,
        userInfo: {
          Fname: thisStudent.Fname || "",
          Mname: thisStudent.Mname || "",
          Lname: thisStudent.Lname || "",
          Gender: thisStudent.sex || "",
          userName: thisStudent.userName || "",
          block: thisStudent.blockNum || "",
          dorm: thisStudent.dormId || "",
        },
      }));
    }
  }, [thisStudent]);

  // Fetch feedback when user sex changes
  useEffect(() => {
    if (user?.sex) {
      const sex = capitalizeFirstLetter(user.sex);
      dispatch(getFeedBackForUser(sex));
    }
  }, [dispatch, user?.sex]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  
  const isFormValid = () => {
    return formData.description.trim() !== ""; // Only validate description
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }

 
    const userName = formData.userInfo.userName;
    const description = formData.description;
    const sex = formData.userInfo.Gender;
    dispatch(InsertFeedBack({ userName, description, sex }))
      .then((data) => {
        console.log(data.payload,"data payload from comment")
        if (data?.payload?.success) {
          toast.success('Feedback added successfully');
          const sex = capitalizeFirstLetter(user.sex);
          dispatch(getFeedBackForUser(sex)); // Added dispatch
          handleDialogClose();
        }
      })
      .catch((error) => {
        toast.error("Failed to submit feedback");
      });

      
  };

  if (!thisStudent) return null; // Add loading state

  return (
    <div className="mt-4 md:mt-20 bg-green-700 w-full h-screen">
      <Dialog open={isDialogOpen} onOpenChange={HandleRemoveDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              If you have not been assigned a dorm, please report here.
            </DialogTitle>
            <DialogDescription>
              <form
                onSubmit={handleSubmit}
                className="h-full flex items-center justify-center mt-6"
              >
                <div className="w-full">
                  {[
                    { label: "First Name", value: thisStudent.Fname },
                    { label: "Middle Name", value: thisStudent.Mname },
                    { label: "Last Name", value: thisStudent.Lname },
                    { label: "Gender", value: thisStudent.sex },
                    { label: "User Name", value: thisStudent.userName },
                    { label: "Block Number", value: thisStudent.blockNum },
                    { label: "Dorm Number", value: thisStudent.dormId },
                  ].map((field, index) => (
                    <div className="mb-4" key={index}>
                      <Label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        value={field.value || ""}
                        readOnly
                        className="cursor-not-allowed bg-gray-100"
                      />
                    </div>
                  ))}
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Please provide a detailed description of the issue..."
                    className="w-full h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
