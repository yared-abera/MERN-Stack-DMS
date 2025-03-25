import CommonForm from "@/components/common/form";
import { logInForm } from "@/config/data";
import { checkAuthorization, loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
const intialFormData = {
  userName: "",
  password: "",
};

export default function LogIn() {
  const [formData, setFormData] = useState(intialFormData);
  const dispatch=useDispatch()
  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(loginUser(formData)).then(data=>{
      console.log(data);
      if(data?.payload.success){
        toast.success(`${data?.payload.message}`)
      }else{
        toast.error(`${data?.payload.message}`)
      }
      
    })
  };
  
  return (
    <div className="w-auto p-10 rounded-lg shadow-lg  bg-transparent">
      <div className="flex items-center justify-center">
      <CommonForm
        formControls={logInForm}
        formData={formData}
        setFormData={setFormData}
        buttonText={"LOGIN"}
        onSubmit={onSubmit}
        isLogIN={true}
      />
       </div>
    </div>
  );
}
