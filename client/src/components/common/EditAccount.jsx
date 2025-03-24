import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { getSingleUser, UpdateUser } from "@/store/user-slice/userSlice";
import { toast } from "sonner";

const intialData = {
  fName: '',
  mName: '',
  lName: '',
  email: '',
  userName: '',
  sex: '',
  phoneNum: '',
  address:''
};

export default function EditAccount({ ThisUser, HandleEdit, EditDialog }) {
  const [formData, setFormData] = useState(ThisUser || intialData); // Initialize with ThisUser or initial data
  const [isChanged, setIsChanged] = useState(false);
  const [initialValues, setInitialValues] = useState(ThisUser || intialData);
  const dispatch=useDispatch()

  useEffect(() => {
    // Update initialValues when ThisUser prop changes (e.g., when the dialog opens)
    if (ThisUser) {
      setInitialValues(ThisUser);
      setFormData(ThisUser); // Reset form data when dialog opens with new user data
      setIsChanged(false); // Reset isChanged state
    } else {
      setInitialValues(intialData);
      setFormData(intialData);
      setIsChanged(false);
    }
  }, [ThisUser]);


  function HandleEditInput() {
    console.log(formData,"formData");
    const id=formData._id
   
    
    dispatch(UpdateUser({formData,id})).then(data=>{
      if(data?.payload?.success){
        toast.success("Updated Successfully")
        dispatch(getSingleUser(id))
      }
    })
     
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  useEffect(() => {
    // Check if formData has changed compared to initialValues
    const hasChanged = Object.keys(formData).some(key => formData[key] !== initialValues[key]);
    setIsChanged(hasChanged);
  }, [formData, initialValues]);

  return (
    <Dialog open={EditDialog} onOpenChange={HandleEdit}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Account</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="grid grid-cols-2 gap-2">
            <Label>First Name :</Label>
            <Input
              name="fName"
              value={formData.fName}
              onChange={handleInputChange}
            />
            <Label>Middle Name :</Label>
            <Input
              name="mName"
              value={formData.mName}
              onChange={handleInputChange}
            />
            <Label>Last Name :</Label>
            <Input
              name="lName"
              value={formData.lName}
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
            
            <Label>Address:</Label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />

          </div>
          <div>
            <Button onClick={HandleEditInput} disabled={!isChanged}>
              Edit
            </Button>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}