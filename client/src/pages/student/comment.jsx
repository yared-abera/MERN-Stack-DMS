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


import { motion, AnimatePresence } from "framer-motion";
import { Send, AlertCircle, User, Info, Blocks, Bed, User2Icon, User2, UserCheck } from "lucide-react";

export default function Comment({ isDialogOpen, HandleRemoveDialog }) {
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
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
    dispatch(InsertFeedBack({ userName, description, sex })).then((data) => {
      console.log(data.payload, "data payload from comment");
      if (data?.payload?.success) {
        const sex = capitalizeFirstLetter(user.sex);
        dispatch(getFeedBackForUser(sex)); // Added dispatch
       
        toast.success("Feedback submitted successfully");
      }
    });
  };

  if (!thisStudent) return null; // Add loading state

  return (
    <Dialog open={isDialogOpen} onOpenChange={HandleRemoveDialog}>
      <AnimatePresence>
        {isDialogOpen && (
          <DialogContent className="max-h-[90vh] overflow-y-auto p-0 border-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg"
            >
              <DialogHeader>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 mb-4"
                >
                  <AlertCircle className="w-8 h-8 text-blue-600" />
                  <DialogTitle className="text-2xl font-bold text-gray-800">
                    Dormitory Allocation Support
                  </DialogTitle>
                </motion.div>

                <DialogDescription>
                  <motion.form
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <motion.div
                      variants={fadeInUp}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {[
                        { label: "First Name", value: thisStudent.Fname, icon: User },
                        { label: "Middle Name", value: thisStudent.Mname, icon: User },
                        { label: "Last Name", value: thisStudent.Lname, icon: User2Icon },
                        { label: "User Name", value: thisStudent.Fname, icon:UserCheck  },
                        { label: "Block", value: thisStudent.blockNum, icon: Blocks },
                        { label: "Dorm", value: thisStudent.dormId, icon: Bed },

                        // ... other fields ...
                      ].map((field, index) => (
                        <motion.div
                          key={index}
                          variants={fadeInUp}
                          className="relative"
                        >
                          <Label className="block text-sm font-medium text-gray-600 mb-1">
                            <field.icon className="inline w-4 h-4 mr-2 text-blue-500" />
                            {field.label}
                          </Label>
                          <Input
                            value={field.value || ""}
                            readOnly
                            className="bg-white/80 backdrop-blur-sm border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          />
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <Label className="block text-sm font-medium text-gray-600 mb-2">
                        <Info className="inline w-4 h-4 mr-2 text-blue-500" />
                        Issue Description
                      </Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                        placeholder="Describe your issue in detail..."
                        className="w-full h-32 bg-white/80 backdrop-blur-sm border-gray-200 rounded-lg shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </motion.div>

                    <motion.div
                      variants={fadeInUp}
                      className="pt-4"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Submit Feedback
                      </motion.button>
                    </motion.div>
                  </motion.form>
                </DialogDescription>
              </DialogHeader>

              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-t-lg" />
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
   
}





 
 

