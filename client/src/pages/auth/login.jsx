import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Import Lucide icons
import { Eye, EyeOff } from 'lucide-react'; // Import the eye icons

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginUser } from "@/store/auth-slice";

const initialFormData = {
  userName: "",
  password: "",
};

export default function LogIn() {
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.userName.trim()) {
      errors.userName = "Username is required";
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await dispatch(loginUser(formData));

      if (result.payload?.success) {
        toast.success(`${result.payload.message}`);
        // Redirect or perform other actions on success
      } else {
        const message = result.payload?.message || "Login failed. Please try again.";
        setErrorMessage(message);
        toast.error(message);
      }
    } catch (error) {
      console.error("Login error:", error);
      const message = "An error occurred during login. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !formData.userName || !formData.password || isLoading;

  return (
    <form onSubmit={onSubmit} className="w-auto p-10 rounded-lg shadow-lg bg-transparent">
      {errorMessage && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          <div className="flex items-center">
             {/* Consider using a Lucide icon for general error too, e.g., <AlertCircle className="w-5 h-5 mr-2" /> */}
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <h5 className="font-medium">Error</h5>
          </div>
          <p className="mt-1 text-sm">{errorMessage}</p>
        </div>
      )}

      <div className="flex items-center justify-center">
        <Card className="w-[350px] bg-transparent ">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to sign in.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4">
              {/* Username Field */}
              <div className="grid gap-2">
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="userName"
                  name="userName"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.userName}
                  onChange={handleInputChange}
                />
                {formErrors.userName && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.userName}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-10" // Add padding to the right for the icon
                  />
                  {/* Password visibility toggle button using Lucide icons */}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500" // Added text-gray-500 for icon color
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                     {/* Conditionally render Lucide Eye or EyeOff icon */}
                    {showPassword ? (
                       <EyeOff className="h-5 w-5" /> // Lucide EyeOff icon
                    ) : (
                       <Eye className="h-5 w-5" /> // Lucide Eye icon
                    )}
                  </button>
                </div>
                 {formErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isButtonDisabled}
            >
              {isLoading ? "Logging In..." : "Log In"}
            </Button>

            <div className="text-center text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}