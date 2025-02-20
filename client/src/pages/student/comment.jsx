import CommonForm from "@/components/common/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Comment_Report } from "@/config/data";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialFormData = {
  Fname: "",
  Mname: "",
  Lname: "",
  id: "",
  date: "",
};

export default function Comment() {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate();

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    navigate("/student/home");
  };

  const isFormValid = () => {
    return Object.values(formData).every((item) => item.trim() !== "");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add form submission logic here
    // After submission, you might want to close the dialog
    handleDialogClose();
  };

  return (
    <div className="mt-4 md:mt-20 bg-green-700 w-full h-screen">
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
            If you have not been assigned a dorm, please report here.
            </DialogTitle>
            <DialogDescription>
              <div className="h-full flex items-center justify-center mt-6">
                <CommonForm
                  formControls={Comment_Report}
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  buttonText="Submit"
                  isBtnDisabled={!isFormValid()}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
