import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label"; // Adjusted path example

import { Input } from "@/components/ui/input"; // Adjusted path example

import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";

import { toast } from "sonner";
import { getSingleStudent, UpdateStudentByStudent } from "@/store/studentAllocation/allocateSlice";
 
const initialData = {
  Fname: "",
  Mname: "",
  Lname: "",
  email: "",
  userName: "",
  sex: "",
  phoneNum: "",
};

export default function EditAccount({ ThisUser, HandleEdit, editDialog }) {
  const [formData, setFormData] = useState(ThisUser || initialData); // Initialize with ThisUser or initial data
  const [isChanged, setIsChanged] = useState(false);
  const [initialValues, setInitialValues] = useState(ThisUser || initialData);
  const dispatch = useDispatch();

  useEffect(() => {
    // Update initialValues when ThisUser prop changes (e.g., when the dialog opens)
    if (ThisUser) {
      setInitialValues(ThisUser);
      setFormData(ThisUser); // Reset form data when dialog opens with new user data
      setIsChanged(false); // Reset isChanged state
    } else {
      setInitialValues(initialData);
      setFormData(initialData);
      setIsChanged(false);
    }
  }, [ThisUser]);

  function HandleEditInput(data, student) {
    dispatch(UpdateStudentByStudent({ id: student._id, formData: data })).then(
      (data) => {
        if (data.payload.success) {
          toast.success(data.payload.message);
          dispatch(getSingleStudent({id:student._id}))
          HandleEdit()
        } else {
          toast.error(data.payload.message);
        }
      }
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Check if formData has changed compared to initialValues
    const hasChanged = Object.keys(formData).some(
      (key) => formData[key] !== initialValues[key]
    );
    setIsChanged(hasChanged);
  }, [formData, initialValues]);

  return (
    <Dialog open={editDialog} onOpenChange={HandleEdit}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Account</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <div className="grid grid-cols-2 gap-2">
            <Label>First Name :</Label>

            <Input
              name="Fname"
              value={formData.Fname}
              onChange={handleInputChange}
            />

            <Label>Middle Name :</Label>

            <Input
              name="Mname"
              value={formData.Mname}
              onChange={handleInputChange}
            />

            <Label>Last Name :</Label>

            <Input
              name="Lname"
              value={formData.Lname}
              onChange={handleInputChange}
            />

            <Label>Email:</Label>

            <Input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />

            <Label>User Name :</Label>

            <Input
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
            />

            <Label>Phone:</Label>

            <Input
              name="phoneNum"
              value={formData.phoneNum}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Button
              onClick={() => HandleEditInput(formData, ThisUser)}
              disabled={!isChanged}
            >
              Edit
            </Button>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
