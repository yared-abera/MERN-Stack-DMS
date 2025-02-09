import CommonForm from "@/components/common/form";
import { logInForm } from "@/config/data";
import { useState } from "react";
const intialFormData = {
  userName: "",
  password: "",
};

export default function LogIn() {
  const [formData, setFormData] = useState(intialFormData);
  const onSubmit = (event) => {
    event.preventDefault();
  };
  
  return (
    <div className="w-auto p-10 rounded-lg shadow-md ">
        <div className="">
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
