import React, { useState, useEffect } from "react"; // Keep React import

import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";

import { motion, AnimatePresence } from "framer-motion";

import {
  Eye,
  EyeOff,
  UserCircle,
  Mail,
  MapPin,
  Phone,
  Lock,
  KeyRound,
  Edit,
  Info,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Home,
  Building,
  MessageSquare,
  Twitter,
  Facebook, // Lucide Icons
} from "lucide-react";

// --- Adjust these paths as needed ---

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label"; // Adjusted path example

import { Input } from "@/components/ui/input"; // Adjusted path example

import { Separator } from "@/components/ui/separator";

import {
  CompareStudentPasswordAndUpdate,
  getSingleStudent,
 
} from "@/store/studentAllocation/allocateSlice";

 
import EditAccount from "./editAccount";
import EditContact from "./editContact";

const containerVariants = {
  hidden: { opacity: 0 },

  visible: {
    opacity: 1,

    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },

  visible: {
    opacity: 1,

    y: 0,

    transition: {
      type: "spring",

      stiffness: 100,

      damping: 12,
    },
  },
};

const inputGroupVariants = {
  hidden: { opacity: 0, x: -10 },

  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function StudentAccount() {
  const dispatch = useDispatch();

  // Selector remains, just without type annotation

  const { user } = useSelector((state) => state.auth);

  const [ThisStudent, setThisStudent] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [viewDetail, setViewDetail] = useState(false);

  const [editDialog, setEditDialog] = useState(false);

  const [editContactDialog, setEditContactDialog] = useState(false);

  

  const [Password, setPassword] = useState({
    currentPassword: "",

    newPassword: "",

    confirmPassword: "",
  });
  const [PasswordIsNotMatch, setPasswordIsNotMatch] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,

      [name]: value,
    }));
  };

  console.log(ThisStudent, "this students");

  useEffect(() => {
    const id = user.id;

    dispatch(getSingleStudent({ id })).then((data) => {
      // Removed type annotation

      if (data.payload?.success) {
        setThisStudent(data.payload?.data); // Removed 'as StudentData'
      }
    });
  }, [dispatch]);

  // --- Handlers ---

  function HandleViewDetail() {
    if (ThisStudent) setViewDetail(true);
    else toast.info("Student data not available yet.");
  }

  function HandleEdit() {
    setEditDialog(!editDialog);
  }

  function HandleContactEdit() {
    setEditContactDialog(!editContactDialog);
  }

  function HandleChangePassword() {
    if (!ThisStudent?._id) {
      toast.error("Student information unavailable.");
      return;
    }

    if (
      !Password.currentPassword ||
      !Password.newPassword ||
      !Password.confirmPassword
    ) {
      toast.warning("Please fill all password fields.", {
        icon: <AlertCircle size={16} />,
      });
      return;
    }

    if (Password.newPassword.length < 5) {
      toast.warning("New password must be at least 5 characters.", {
        icon: <AlertCircle size={16} />,
      });
      return;
    }

    if (Password.newPassword !== Password.confirmPassword) {
      setPasswordIsNotMatch(true);

      toast.error("New passwords do not match.", {
        icon: <XCircle size={16} />,
      });

      return;
    }

    setPasswordIsNotMatch(false);

    setIsChangingPassword(true);

    const id = ThisStudent._id;

    dispatch(CompareStudentPasswordAndUpdate({ Password, id })) // Removed 'as any'
      .unwrap()

      .then((payload) => {
        // Removed type annotation

        if (payload?.success) {
          toast.success(payload?.message || "Password changed!", {
            icon: <CheckCircle size={16} />,
          });

          setPassword({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        } else {
          toast.error(payload?.message || "Failed to change password.", {
            icon: <XCircle size={16} />,
          });

          setPassword((prev) => ({ ...prev, currentPassword: "" }));
        }
      })

      .catch((error) => {
        // Removed type annotation

        console.error("Error changing password:", error);

        toast.error(error?.message || "Password change error.", {
          icon: <XCircle size={16} />,
        });

        setPassword((prev) => ({ ...prev, currentPassword: "" }));
      })

      .finally(() => {
        setIsChangingPassword(false);
      });
  }

  // --- Render Logic ---

  if (isLoading) {
    // Loading state JSX remains the same

    return (
      <div className="w-full min-h-screen mt-20 flex flex-col justify-center items-center p-4 text-gray-500 dark:text-gray-400">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />

        <p className="text-lg font-medium">Loading Student Account...</p>

        <p className="text-sm">Please wait a moment.</p>
      </div>
    );
  }

  if (!ThisStudent) {
    // Error state JSX remains the same

    return (
      <div className="w-full min-h-screen mt-20 flex flex-col justify-center items-center p-4 text-center text-gray-600 dark:text-gray-300">
        <AlertCircle className="h-12 w-12 mb-4 text-destructive" />

        <p className="text-xl font-semibold mb-2">Unable to Load Data</p>

        <p className="text-sm">
          Please ensure you are logged in or try refreshing the page.
        </p>
      </div>
    );
  }
console.log(ThisStudent,"ThisStudent");

  return (
    <motion.div
      className="w-full min-h-screen mt-20 overflow-x-hidden p-4 md:p-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-slate-800"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        {/* --- Personal Information Section --- */}

        <motion.div
          className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300"
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row w-full mb-5 items-start sm:items-center gap-3">
            <div className="flex items-center gap-3 flex-grow">
              <UserCircle className="h-7 w-7 text-primary" />

              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Personal Information
              </h2>
            </div>

            <div className="flex gap-2 self-end sm:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={HandleViewDetail}
                className="flex items-center gap-1"
              >
                <Info size={16} /> View Detail
              </Button>

              <Button
                size="sm"
                onClick={HandleEdit}
                className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Edit size={16} /> Edit Info
              </Button>
            </div>
          </div>

          <Separator className="mb-6 bg-gray-200 dark:bg-gray-600" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm md:text-base pl-4">
            <div className="flex items-center gap-3">
              <UserCircle
                size={18}
                className="text-gray-500 dark:text-gray-400 shrink-0"
              />

              <span className="font-medium text-gray-600 dark:text-gray-300 min-w-[100px]">
                First Name:
              </span>

              <span className="text-gray-800 dark:text-gray-100 text-right flex-1 truncate">
                {ThisStudent.Fname || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <UserCircle
                size={18}
                className="text-gray-500 dark:text-gray-400 shrink-0"
              />

              <span className="font-medium text-gray-600 dark:text-gray-300 min-w-[100px]">
                Middle Name:
              </span>

              <span className="text-gray-800 dark:text-gray-100 text-right flex-1 truncate">
                {ThisStudent.Mname || "N/A"}
              </span>
            </div>

            {ThisStudent.Mname && (
              <div className="flex items-center gap-3 md:col-span-2">
                <UserCircle
                  size={18}
                  className="text-gray-500 dark:text-gray-400 shrink-0"
                />

                <span className="font-medium text-gray-600 dark:text-gray-300 min-w-[100px]">
                  Last Name:
                </span>

                <span className="text-gray-800 dark:text-gray-100 text-right flex-1 truncate">
                  {ThisStudent.Lname}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Mail
                size={18}
                className="text-gray-500 dark:text-gray-400 shrink-0"
              />

              <span className="font-medium text-gray-600 dark:text-gray-300 min-w-[100px]">
                Email:
              </span>

              <span className="text-gray-800 dark:text-gray-100 text-right flex-1 truncate">
                {ThisStudent.email || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <UserCircle
                size={18}
                className="text-gray-500 dark:text-gray-400 shrink-0"
              />

              <span className="font-medium text-gray-600 dark:text-gray-300 min-w-[100px]">
                Username:
              </span>

              <span className="text-gray-800 dark:text-gray-100 text-right flex-1 truncate">
                {ThisStudent.userName || "N/A"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* --- Address & Contact Section --- */}

        <motion.div
          className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300"
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row w-full mb-5 items-start sm:items-center gap-3">
            <div className="flex items-center gap-3 flex-grow">
              <MapPin className="h-7 w-7 text-primary" />

              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Address & Contact
              </h2>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={HandleContactEdit}
              className="flex items-center gap-1 self-end sm:self-center"
            >
              <Edit size={16} /> Edit Address
            </Button>
          </div>

          <Separator className="mb-6 bg-gray-200 dark:bg-gray-600" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm md:text-base pl-4">
            <div className="flex items-center gap-3">
              <Home
                size={18}
                className="text-gray-500 dark:text-gray-400 shrink-0"
              />
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Country:
              </span>{" "}
              <span className="text-gray-800 dark:text-gray-100">
                {ThisStudent.address?.country || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Building
                size={18}
                className="text-gray-500 dark:text-gray-400 shrink-0"
              />
              <span className="font-medium text-gray-600 dark:text-gray-300">
                City:
              </span>{" "}
              <span className="text-gray-800 dark:text-gray-100">
                {ThisStudent.address?.city || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Phone
                size={18}
                className="text-gray-500 dark:text-gray-400 shrink-0"
              />
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Phone:
              </span>{" "}
              <span className="text-gray-800 dark:text-gray-100">
                {ThisStudent.phoneNum || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Facebook
                size={18}
                className="text-gray-500 dark:text-gray-400 shrink-0"
              />
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Facebook:
              </span>{" "}
              <span className="text-blue-600 dark:text-blue-400 hover:underline truncate">
                {ThisStudent.social?.facebook || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Twitter
                size={18}
                className="text-gray-500 dark:text-gray-400 shrink-0"
              />
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Twitter:
              </span>{" "}
              <span className="text-sky-500 dark:text-sky-400 hover:underline truncate">
                {ThisStudent.social?.twitter || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MessageSquare
                size={18}
                className="text-gray-500 dark:text-gray-400 shrink-0"
              />
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Telegram:
              </span>{" "}
              <span className="text-cyan-600 dark:text-cyan-400 hover:underline truncate">
                {ThisStudent.social?.telegram || "N/A"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* --- Change Password Section --- */}

        <motion.div
          className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3 mb-5">
            <Lock className="h-7 w-7 text-primary" />

            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Change Password
            </h2>
          </div>

          <Separator className="mb-6 bg-gray-200 dark:bg-gray-600" />

          <div className="flex flex-col gap-5">
            {/* Current Password */}

            <motion.div
              className="flex flex-col gap-1.5"
              variants={inputGroupVariants}
            >
              <Label
                htmlFor="currentPassword"
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Current Password:
              </Label>

              <div className="relative flex items-center">
                <KeyRound
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />

                <Input
                  id="currentPassword"
                  className="text-sm md:text-base pl-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-primary"
                  placeholder="Enter Your current Password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={Password.currentPassword}
                  onChange={(e) =>
                    setPassword({
                      ...Password,
                      currentPassword: e.target.value,
                    })
                  }
                  disabled={isChangingPassword}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary focus:outline-none transition-colors"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={
                    showCurrentPassword
                      ? "Hide current password"
                      : "Show current password"
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </motion.div>

            {/* New Password */}

            <motion.div
              className="flex flex-col gap-1.5"
              variants={inputGroupVariants}
            >
              <Label
                htmlFor="newPassword"
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                New Password:
              </Label>

              <div className="relative flex items-center">
                <KeyRound
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />

                <Input
                  id="newPassword"
                  className="text-sm md:text-base pl-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-primary"
                  placeholder="Enter New Password (min 5 chars)"
                  type={showNewPassword ? "text" : "password"}
                  value={Password.newPassword}
                  onChange={(e) => {
                    setPassword({ ...Password, newPassword: e.target.value });
                    setPasswordIsNotMatch(false);
                  }}
                  disabled={isChangingPassword}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary focus:outline-none transition-colors"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={
                    showNewPassword ? "Hide new password" : "Show new password"
                  }
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password */}

            <motion.div
              className="flex flex-col gap-1.5"
              variants={inputGroupVariants}
            >
              <Label
                htmlFor="confirmPassword"
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Confirm New Password:
              </Label>

              <div className="relative flex items-center">
                <KeyRound
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />

                <Input
                  id="confirmPassword"
                  className={`text-sm md:text-base pl-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-primary ${
                    PasswordIsNotMatch
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }`}
                  placeholder="Enter New Password again"
                  type={showConfirmPassword ? "text" : "password"}
                  value={Password.confirmPassword}
                  onChange={(e) => {
                    setPassword({
                      ...Password,
                      confirmPassword: e.target.value,
                    });
                    setPasswordIsNotMatch(false);
                  }}
                  disabled={isChangingPassword}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary focus:outline-none transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <AnimatePresence>
                {PasswordIsNotMatch && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-destructive text-xs mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={14} /> Passwords do not match.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Change Button */}

            <div className="w-full flex justify-end pt-2">
              <Button
                onClick={HandleChangePassword}
                disabled={
                  !Password.currentPassword ||
                  !Password.newPassword ||
                  !Password.confirmPassword ||
                  isChangingPassword
                }
                className="flex items-center gap-2 min-w-[150px] justify-center transition-all duration-200 ease-in-out hover:shadow-md disabled:opacity-60"
                aria-live="polite"
              >
                {isChangingPassword ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <CheckCircle size={18} />
                )}

                {isChangingPassword ? "Changing..." : "Update Password"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>{" "}
    
      <AnimatePresence>
       


      <Dialog open={viewDetail} onOpenChange={setViewDetail}>
      <DialogContent className="sm:max-w-lg dark:bg-gray-800 dark:border-gray-700 p-6 h-screen overflow-y-auto"> {/* Added padding */}
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <Info size={24} className="text-blue-500" /> {/* Used a more specific primary color */}
            Student Details
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400 mt-1"> {/* Adjusted margin-top */}
            Comprehensive overview of personal and contact information.
          </DialogDescription>
        </DialogHeader>

        <Separator className="mb-5 bg-gray-200 dark:bg-gray-600" />

        {ThisStudent ? (
          <div className="grid grid-cols-1 gap-3 text-sm md:text-base"> {/* Use grid for better structure */}
            {/* Personal Information */}
            <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                First Name:
              </span>
              <span className="text-gray-800 dark:text-gray-100">
                {ThisStudent.Fname || "N/A"}
              </span>
            </div>

            {ThisStudent.mName && (
              <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Middle Name:
                </span>
                <span className="text-gray-800 dark:text-gray-100">
                  {ThisStudent.Mname}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Last Name:
              </span>
              <span className="text-gray-800 dark:text-gray-100">
                {ThisStudent.Lname || "N/A"}
              </span>
            </div>

            <Separator className="bg-gray-200 dark:bg-gray-700 my-2" /> {/* Separator for Contact/Account Info */}

            {/* Contact/Account Information */}
             <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Username: {/* Moved username up */}
              </span>
              <span className="text-gray-800 dark:text-gray-100">
                {ThisStudent.userName || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Email:
              </span>
              <span className="text-gray-800 dark:text-gray-100 truncate max-w-[60%] text-right"> {/* Added truncate and max-w for long emails */}
                {ThisStudent.email || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Phone: {/* Assuming a phone field exists */}
              </span>
              <span className="text-gray-800 dark:text-gray-100">
                 {ThisStudent.phone || "N/A"} {/* Use a property like 'phone' if it exists */}
              </span>
            </div>


            <Separator className="bg-gray-200 dark:bg-gray-700 my-2" /> {/* Separator for Other Details */}

            {/* Other Details */}
            <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Sex:
              </span>
              <span className="text-gray-800 dark:text-gray-100">
                {ThisStudent.sex || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Role:
              </span>
              <span className="text-gray-800 dark:text-gray-100 capitalize">
                {ThisStudent.role || "N/A"}
              </span>
            </div>

             {/* Dormitory Information */}
            <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Block:
              </span>
              <span className="text-gray-800 dark:text-gray-100">
                {ThisStudent.blockNum || "N/A"}
              </span>
            </div>
             <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Dorm:
              </span>
              <span className="text-gray-800 dark:text-gray-100">
                {ThisStudent.dormId || "N/A"}
              </span>
            </div>

             <Separator className="bg-gray-200 dark:bg-gray-700 my-2" /> {/* Separator for Academic Info */}

             {/* Academic Information */}
             <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                College: {/* Corrected spelling */}
              </span>
              <span className="text-gray-800 dark:text-gray-100">
                {ThisStudent.collage || "N/A"} {/* Assuming 'collage' is the correct property name */}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Stream:
              </span>
              <span className="text-gray-800 dark:text-gray-100">
                {ThisStudent.stream || "N/A"}
              </span>
            </div>

             <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Batch: {/* Assuming 'bacth' was a typo for 'batch' */}
              </span>
              <span className="text-gray-800 dark:text-gray-100">
                {ThisStudent.batch || "N/A"} {/* Use 'batch' property if that's correct */}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Category: {/* Shortened for clarity */}
              </span>
              <span className="text-gray-800 dark:text-gray-100">
                {ThisStudent.studCategory || "N/A"}
              </span>
            </div>

             <Separator className="bg-gray-200 dark:bg-gray-700 my-2" /> {/* Separator for Timestamps */}

             {/* Timestamps */}
             <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Joined: {/* More descriptive label for createdAt */}
              </span>
               {/* Check if createdAt is a valid date before formatting */}
              <span className="text-gray-800 dark:text-gray-100">
                {ThisStudent.createdAt ? new Date(ThisStudent.createdAt).toLocaleString() : "N/A"} {/* Use toLocaleString for date and time */}
              </span>
            </div>

            {/* You can add more fields here following the same pattern */}

          </div>
        ) : (
           <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
              No student details available.
           </div>
        )}

        {/* Dialog Footer (Optional - add buttons here if needed) */}
        {/* <DialogFooter>
          <Button onClick={() => setViewDetail(false)}>Close</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
 
      </AnimatePresence>
      {/* --- Edit Account Component/Dialog --- */}
      <AnimatePresence>
        {editDialog && (
          <EditAccount
            ThisUser={ThisStudent}
            HandleEdit={HandleEdit}
            editDialog={editDialog}
          />
        )}
      </AnimatePresence>
      {editContactDialog && (
        <EditContact
        ThisStudent={ThisStudent}
          HandleEdit={HandleContactEdit}
          editDialog={editContactDialog}
        />
      )}
    </motion.div> // End Framer Motion container
  );
}
