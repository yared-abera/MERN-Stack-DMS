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
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const onSubmit = (event) => {
    event.preventDefault();
    setErrorMessage(""); // Clear any previous error messages
    
    dispatch(loginUser(formData)).then(data => {
      console.log(data);
      if (data?.payload?.success) {
        toast.success(`${data?.payload.message}`);
      } else {
        const message = data?.payload?.message || "Login failed. Please try again.";
        setErrorMessage(message);
        toast.error(message);
      }
    }).catch(error => {
      console.error("Login error:", error);
      const message = "An error occurred during login. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    });
  };
  
  return (
    <div className="w-auto p-10 rounded-lg shadow-lg bg-transparent">
      {errorMessage && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h5 className="font-medium">Error</h5>
          </div>
          <p className="mt-1 text-sm">{errorMessage}</p>
        </div>
      )}
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
