import React from 'react';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setUpdateAllocation } from "../../store/common/sidebarSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllocatedStudent, updateStudent} from "../../store/studentAllocation/allocateSlice";
import { fetchProctorBlocks } from '@/store/blockSlice/index';


const RegisterStudentPage = () => { 
  const dispatch = useDispatch();
  const openDialog = useSelector((state) => state.sidebar.updateAllocation);
  const [isOpen, setIsOpen] = useState(openDialog);
  const [searchId, setSearchId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { list: blocks } = useSelector((state) => state.block);
  const [registrationForm, setRegistrationForm] = useState({
    phone: "",
    email: "",
    emergencyContact: "",
    parentName: "",
    parentPhone: "",
    address: "",
    additionalInfo: "",
    roomNumber: ""
  });

  useEffect(() => {
    dispatch(fetchProctorBlocks());
  }, [dispatch]);

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
        setRegistrationForm({
          phone: student.phone || "",
          email: student.email || "",
          emergencyContact: student.emergencyContact || "",
          parentName: student.parentName || "",
          parentPhone: student.parentPhone || "",
          address: student.address || "",
          additionalInfo: student.additionalInfo || "",
          arrivalDate: new Date().toISOString().split('T')[0],
          roomNumber: student.dormId || ""
        });
        console.log("Student data:", response.data);
      } else {
        setError("Student not found in your blocks");
        setSelectedStudent(null);
      }
    } catch (error) {
      setError("Failed to search for student");
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async () => {
    try {
      const updatedStudent = {
        ...selectedStudent,
        ...registrationForm,
        status: 'Registered',
        registrationDate: new Date().toISOString(),
        dormId: registrationForm.roomNumber,
        registeredBy: "proctor",
        lastUpdated: new Date().toISOString()
      };
      
      await dispatch(updateStudent(updatedStudent)).unwrap();
      alert("Student registered successfully!");
      handleOpenChange(false);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register student. Please try again.");
      }
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
                <DialogTitle className="text-2xl font-bold text-center">Register Student</DialogTitle>
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
                      </div>
                    </div>

                    {/* Registration Form */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">Registration Details</h3>
                      
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
                            <label className="font-semibold text-gray-600">Room Number</label>
                            <Input
                              type="text"
                              value={registrationForm.roomNumber}
                              onChange={(e) => setRegistrationForm({
                                ...registrationForm,
                                roomNumber: e.target.value
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
                              value={registrationForm.phone}
                              onChange={(e) => setRegistrationForm({
                                ...registrationForm,
                                phone: e.target.value
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
                        <h4 className="font-medium text-gray-700">Emergency Contact</h4>
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
                            <label className="font-semibold text-gray-600">Parent Name</label>
                            <Input
                              type="text"
                              value={registrationForm.parentName}
                              onChange={(e) => setRegistrationForm({
                                ...registrationForm,
                                parentName: e.target.value
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
                            <label className="font-semibold text-gray-600">Address</label>
                            <Input
                              type="text"
                              value={registrationForm.address}
                              onChange={(e) => setRegistrationForm({
                                ...registrationForm,
                                address: e.target.value
                              })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                        <h4 className="font-medium text-gray-700">Additional Information</h4>
                        <div className="space-y-2">
                          <label className="font-semibold text-gray-600">Notes</label>
                          <textarea
                            className="w-full p-3 border rounded-md min-h-[100px]"
                            value={registrationForm.additionalInfo}
                            onChange={(e) => setRegistrationForm({
                              ...registrationForm,
                              additionalInfo: e.target.value
                            })}
                            placeholder="Enter any additional information..."
                          />
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
                        className="min-w-[100px] bg-green-600 hover:bg-green-700"
                      >
                        Register
                      </Button>
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

 