import React from 'react';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setUpdateAllocation } from "../../store/common/sidebarSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllocatedStudent,UpdateStudentByStudent} from "../../store/studentAllocation/allocateSlice";
import { fetchProctorBlocks } from '@/store/blockSlice/index';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

const RegisterStudentPage = () => { 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const openDialog = useSelector((state) => state.sidebar.updateAllocation);
  const [isOpen, setIsOpen] = useState(openDialog);
  const [searchId, setSearchId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { list: blocks } = useSelector((state) => state.block);
  const {user}=useSelector((state)=>state.auth);
  const [isPreviouslyRegistered, setIsPreviouslyRegistered] = useState(false);
  const [previousPath, setPreviousPath] = useState("/proctor/home");
 
  const [registrationForm, setRegistrationForm] = useState({
    phoneNum: "",
    email: "",
    emergencyContact: "",
    parentFirstName: "",
    parentLastName: "",
    parentPhone: "",
    parentAddress: "",
    keyHolder: false,
    arrivalDate: "",
    dormNumber: ""
  });

  useEffect(() => {
    dispatch(fetchProctorBlocks());
    
    // Store the current path when the dialog opens
    if (openDialog && location.pathname !== "/proctor/register") {
      setPreviousPath(location.pathname);
    }
  }, [dispatch, openDialog, location.pathname]);

  useEffect(() => {
    setIsOpen(openDialog);
  }, [openDialog]);
  
  const handleOpenChange = (newOpenState) => {
    setIsOpen(newOpenState);
    if (!newOpenState) {
      dispatch(setUpdateAllocation(false)); 
      setSelectedStudent(null);
      setSearchId("");
      setError("");
      setIsPreviouslyRegistered(false);
      
      // Navigate back to the previous path when closing the dialog
      if (location.pathname === "/proctor/register") {
        navigate(previousPath);
      }
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError("Please enter a student ID");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await dispatch(getAllocatedStudent()).unwrap();
      const student = response.data.find(
        (s) => s.userName.toLowerCase() === searchId.toLowerCase() &&
        blocks.some(block => block.blockNum === s.blockNum)
      );
      
      if (student) {
        setSelectedStudent(student);
        // Format date if it exists
        const formattedDate = student.arrivalDate ? 
          new Date(student.arrivalDate).toISOString().split('T')[0] : 
          "";
          
        // Check if student has been registered before
        const hasParentInfo = !!(student.parentFirstName || student.parentLastName || student.parentPhone);
        const hasBeenRegistered = student.status === true || hasParentInfo;
        setIsPreviouslyRegistered(hasBeenRegistered);
        
        setRegistrationForm({
          phoneNum: student.phoneNum || "",
          email: student.email || "",
          emergencyContact: student.emergencyContactNumber || "",
          parentFirstName: student.parentFirstName || "",
          parentLastName: student.parentLastName || "",
          parentPhone: student.parentPhone || "",
          parentAddress: student.parentAddress || "",
          keyHolder: student.keyHolder === true,
          arrivalDate: formattedDate,
          dormNumber: student.dormId || ""
        });
      } else {
        setError("Student not found in your blocks");
        setSelectedStudent(null);
        setIsPreviouslyRegistered(false);
      }
    } catch (error) {
      setError("Failed to search for student");
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async () => {
    setLoading(true);
    try {
      if (!selectedStudent) {
        setError("No student selected");
        return;
      }
      
      const updatedStudent = {
        ...selectedStudent,
        phoneNum: registrationForm.phoneNum,
        email: registrationForm.email,
        emergencyContactNumber: registrationForm.emergencyContact,
        parentFirstName: registrationForm.parentFirstName,
        parentLastName: registrationForm.parentLastName,
        parentPhone: registrationForm.parentPhone,
        parentAddress: registrationForm.parentAddress,
        keyHolder: registrationForm.keyHolder,
        arrivalDate: registrationForm.arrivalDate,
        dormId: registrationForm.dormNumber,
        status: true,
        registeredBy: user.firstName + " " + user.lastName,
        lastUpdated: new Date().toISOString()
      };
      
      const result = await dispatch(UpdateStudentByStudent({ 
        id: selectedStudent._id, 
        formData: updatedStudent 
      }));
      
      if (result.error) {
        throw new Error(result.error.message || "Failed to update student");
      }
      
      toast.success(`Student ${isPreviouslyRegistered ? 'updated' : 'registered'} successfully!`);
      handleOpenChange(false);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(`Failed to ${isPreviouslyRegistered ? 'update' : 'register'} student: ${error.message}`);
      setError(`Failed to ${isPreviouslyRegistered ? 'update' : 'register'} student: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyHolderChange = (value) => {
    console.log("RadioGroup value changed to:", value);
    setRegistrationForm({
      ...registrationForm,
      keyHolder: value === "true"
    });
  };
  
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogContent className="max-w-md p-0 gap-0">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full"
            >        
              <DialogHeader className="px-6 py-4 border-b">
                <DialogTitle className="text-2xl font-bold text-center">
                  {isPreviouslyRegistered ? "Update Student" : "Register Student"}
                </DialogTitle>
              </DialogHeader>

              <div className="p-6 max-h-[80vh] overflow-y-auto">
                {/* Search Section */}
                <div className="flex gap-4 mb-6">
                  <Input 
                    placeholder="Enter Student ID" 
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSearch}
                    disabled={loading}
                    className="min-w-[100px]"
                  >
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md mb-6">
                    {error}
                  </div>
                )}

                {selectedStudent && (
                  <div className="space-y-8">
                    {/* Student Info Card */}
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">Student Information</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="font-semibold text-gray-600">Student ID</p>
                          <p className="text-gray-900">{selectedStudent.userName}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">Name</p>
                          <p className="text-gray-900">
                            {`${selectedStudent.Fname} ${selectedStudent.Lname}`}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">Block</p>
                          <p className="text-gray-900">{selectedStudent.blockNum}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">Student Type</p>
                          <p className="text-gray-900">{selectedStudent.studCategory}</p>
                        </div>
                        {isPreviouslyRegistered && (
                          <div className="col-span-2">
                            <p className="font-semibold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200 text-center">
                              This student has been registered previously
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Registration Form */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {isPreviouslyRegistered ? "Update Details" : "Registration Details"}
                      </h3>
                      
                      {/* Primary Information */}
                      <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                        <h4 className="font-medium text-gray-700">Primary Information</h4>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="font-semibold text-gray-600">Arrival Date</label>
                            <Input
                              type="date"
                              value={registrationForm.arrivalDate}
                              onChange={(e) => setRegistrationForm({
                                ...registrationForm,
                                arrivalDate: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="font-semibold text-gray-600">Dorm Number</label>
                            <Input
                              type="text"
                              value={registrationForm.dormNumber}
                              onChange={(e) => setRegistrationForm({
                                ...registrationForm,
                                dormNumber: e.target.value
                              })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                        <h4 className="font-medium text-gray-700">Contact Information</h4>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="font-semibold text-gray-600">Phone Number</label>
                            <Input
                              type="tel"
                              value={registrationForm.phoneNum}
                              onChange={(e) => setRegistrationForm({
                                ...registrationForm,
                                phoneNum: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="font-semibold text-gray-600">Email</label>
                            <Input
                              type="email"
                              value={registrationForm.email}
                              onChange={(e) => setRegistrationForm({
                                ...registrationForm,
                                email: e.target.value
                              })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Emergency Contact */}
                      <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                        <h4 className="font-medium text-gray-700">Emergency Contact Information</h4>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="font-semibold text-gray-600">Emergency Contact</label>
                            <Input
                              type="tel"
                              value={registrationForm.emergencyContact}
                              onChange={(e) => setRegistrationForm({
                                ...registrationForm,
                                emergencyContact: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="font-semibold text-gray-600">Parent First Name</label>
                            <Input
                              type="text"
                              value={registrationForm.parentFirstName}
                              onChange={(e) => setRegistrationForm({
                                ...registrationForm,
                                parentFirstName: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="font-semibold text-gray-600">Parent Last Name</label>
                            <Input
                              type="text"
                              value={registrationForm.parentLastName}
                              onChange={(e) => setRegistrationForm({
                                ...registrationForm,
                                parentLastName: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="font-semibold text-gray-600">Parent Phone</label>
                            <Input
                              type="tel"
                              value={registrationForm.parentPhone}
                              onChange={(e) => setRegistrationForm({
                                ...registrationForm,
                                parentPhone: e.target.value
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="font-semibold text-gray-600">Parent Address</label>
                            <Input
                              type="text"
                              value={registrationForm.parentAddress}
                              onChange={(e) => setRegistrationForm({
                                ...registrationForm,
                                parentAddress: e.target.value
                              })}
                            />
                          </div> 
                          <div className="space-y-2">
                            <Label className="font-semibold text-gray-600">
                              Will he/she take the key?
                            </Label>
                            
                            <RadioGroup
                              value={registrationForm.keyHolder ? "true" : "false"}
                              onValueChange={handleKeyHolderChange}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id="yes" />
                                <Label htmlFor="yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id="no" />
                                <Label htmlFor="no">No</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-4 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => handleOpenChange(false)}
                          className="min-w-[100px]"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleRegistration}
                          disabled={loading}
                          className={`min-w-[100px] ${isPreviouslyRegistered ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                          {loading 
                            ? (isPreviouslyRegistered ? "Updating..." : "Registering...") 
                            : (isPreviouslyRegistered ? "Update" : "Register")
                          }
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default RegisterStudentPage;

 