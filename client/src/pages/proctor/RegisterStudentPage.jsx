import React from 'react';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setUpdateAllocation } from "../../store/common/sidebarSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllocatedStudent, UpdateStudentByStudent } from "../../store/studentAllocation/allocateSlice";
import { fetchProctorBlocks } from '@/store/blockSlice/index';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

const RegisterStudentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Selector for Redux state indicating if the dialog should be open
  const openDialog = useSelector((state) => state.sidebar.updateAllocation);

  // Local state to control the dialog's open/close state
  const [isOpen, setIsOpen] = useState(openDialog);
  const [searchId, setSearchId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State for validation errors
  const [validationErrors, setValidationErrors] = useState({});
  // State to track touched fields
  const [touchedFields, setTouchedFields] = useState({});

  // Selectors for Redux state
  const { list: blocks } = useSelector((state) => state.block);
  const { user } = useSelector((state) => state.auth);

  // State to track if the student was previously registered
  const [isPreviouslyRegistered, setIsPreviouslyRegistered] = useState(false);

  // State to store the path before the dialog opened
  const [previousPath, setPreviousPath] = useState("/proctor/home");

  // State for the registration form fields
  const [registrationForm, setRegistrationForm] = useState({
    phoneNum: "",
    email: "",
    emergencyContact: "",
    parentFirstName: "",
    parentLastName: "",
    parentPhone: "",
    parentAddress: "",
    keyHolder: false, // Boolean for radio button
    arrivalDate: "",
    dormNumber: ""
  });

  // Effect to fetch proctor blocks on component mount or when the dialog state changes
  useEffect(() => {
    dispatch(fetchProctorBlocks());

    // Store the current path when the dialog opens, if not already on the registration path
    if (openDialog && location.pathname !== "/proctor/register") {
      setPreviousPath(location.pathname);
    }
  }, [dispatch, openDialog, location.pathname]);

  // Effect to sync the local `isOpen` state with the Redux `openDialog` state
  useEffect(() => {
    setIsOpen(openDialog);
    // When dialog opens via Redux state, if it's a new registration flow, navigate
    if (openDialog && location.pathname !== "/proctor/register") {
      navigate("/proctor/register");
    }
  }, [openDialog, location.pathname, navigate]);

  // Handler for the dialog's open/close state change
  const handleOpenChange = (newOpenState) => {
    setIsOpen(newOpenState);
    if (!newOpenState) {
      // Reset Redux and local states when the dialog is closed
      dispatch(setUpdateAllocation(false));
      setSelectedStudent(null);
      setSearchId("");
      setError("");
      setValidationErrors({}); // Clear validation errors on close
      setTouchedFields({}); // Clear touched fields on close
      setIsPreviouslyRegistered(false);
      // Reset form fields to initial empty state
      setRegistrationForm({
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

      // Navigate back to the previous path if currently on the registration path
      if (location.pathname === "/proctor/register") {
        navigate(previousPath);
      }
    }
  };

  // Validation function
  const validateForm = (formData) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Ethiopian phone number regex: Starts with +2519, +2517, 09, or 07 followed by 8 digits
    const phoneRegex = /^(?:(?:\+251(?:9|7)\d{8})|(?:0(?:9|7)\d{8}))$/;


    // Required fields validation
    if (!formData.phoneNum) {
      errors.phoneNum = "Phone Number is required.";
    } else if (!phoneRegex.test(formData.phoneNum)) {
        errors.phoneNum = "Please enter a valid Ethiopian phone number (e.g., +2519... or 09...).";
    }

    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.emergencyContact) {
      errors.emergencyContact = "Emergency Contact is required.";
    } else if (!phoneRegex.test(formData.emergencyContact)) {
        errors.emergencyContact = "Please enter a valid Ethiopian emergency contact number (e.g., +2519... or 09...).";
    }

    if (!formData.parentFirstName) {
      errors.parentFirstName = "Parent First Name is required.";
    }

    if (!formData.parentLastName) {
      errors.parentLastName = "Parent Last Name is required.";
    }

    if (!formData.parentPhone) {
      errors.parentPhone = "Parent Phone is required.";
    } else if (!phoneRegex.test(formData.parentPhone)) {
        errors.parentPhone = "Please enter a valid Ethiopian parent phone number (e.g., +2519... or 09...).";
    }


    if (!formData.parentAddress) {
        errors.parentAddress = "Parent Address is required.";
      }


    // Optional fields (add validation if needed)
    // if (!formData.arrivalDate) {
    //   errors.arrivalDate = "Arrival Date is required.";
    // }
    // if (!formData.dormNumber) {
    //   errors.dormNumber = "Dorm Number is required.";
    // }

    return errors;
  };


  // Handler to search for a student by ID
  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError("Please enter a student ID");
      setSelectedStudent(null); // Clear previously selected student
      setRegistrationForm({ // Reset form fields
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
      setValidationErrors({}); // Clear validation errors on new search attempt
      setTouchedFields({}); // Clear touched fields on new search attempt
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors
    setValidationErrors({}); // Clear validation errors on new search
    setTouchedFields({}); // Clear touched fields on new search

    try {
      // Fetch all allocated students
      const response = await dispatch(getAllocatedStudent()).unwrap();

      // Find the student by ID and check if they belong to the proctor's blocks
      const student = response.data.find(
        (s) => s.userName.toLowerCase() === searchId.toLowerCase() &&
        blocks.some(block => block.blockNum === s.blockNum)
      );

      if (student) {
        setSelectedStudent(student);

        // Format arrival date for the date input
        const formattedDate = student.arrivalDate ?
          new Date(student.arrivalDate).toISOString().split('T')[0] :
          "";

        // Determine if the student has been previously registered
        // Assuming "registered" means they have status true and parent info
        const hasParentInfo = !!(student.parentFirstName || student.parentLastName || student.parentPhone);
        const hasBeenRegistered = student.status === true && hasParentInfo;
        setIsPreviouslyRegistered(hasBeenRegistered);

        // Populate the form with existing student data (or default to empty strings)
        const initialFormData = {
          phoneNum: student.phoneNum ?? "",
          email: student.email ?? "",
          emergencyContact: student.emergencyContactNumber ?? "",
          parentFirstName: student.parentFirstName ?? "",
          parentLastName: student.parentLastName ?? "",
          parentPhone: student.parentPhone ?? "",
          parentAddress: student.parentAddress ?? "",
          keyHolder: student.keyHolder === true, // Ensure boolean
          arrivalDate: formattedDate,
          dormNumber: student.dormId ?? "" // Assuming dormId corresponds to dormNumber
        };
        setRegistrationForm(initialFormData);
        // Do NOT set validationErrors or touchedFields here immediately
        // Validation errors will appear on blur or submit.

      } else {
        setError("Student not found in your blocks");
        setSelectedStudent(null);
        setIsPreviouslyRegistered(false);
        // Reset form fields if student not found
        setRegistrationForm({
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
        setValidationErrors({}); // Clear validation errors
        setTouchedFields({}); // Clear touched fields
      }
    } catch (error) {
      setError("Failed to search for student");
      console.error("Search error:", error);
      toast.error("Failed to search for student");
    } finally {
      setLoading(false);
    }
  };

  // Handler to update form state and trigger validation on blur
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const updatedForm = {
      ...registrationForm,
      [id]: value
    };
    setRegistrationForm(updatedForm);

    // Validate the form after the change and update errors state
    const errors = validateForm(updatedForm);
    setValidationErrors(errors);
  };

  // Handler for input blur to mark field as touched and update validation
  const handleInputBlur = (e) => {
      const { id } = e.target;
      setTouchedFields({
          ...touchedFields,
          [id]: true,
      });
      // Validation is already happening in handleInputChange,
      // but we re-validate here to ensure errors are up-to-date on blur
      const errors = validateForm(registrationForm);
      setValidationErrors(errors);
  };

  // Handler to submit the registration/update form
  const handleRegistration = async () => {
     // Mark all fields as touched before validation on submit
     const allFields = Object.keys(registrationForm);
     const newTouchedFields = allFields.reduce((acc, field) => {
         acc[field] = true;
         return acc;
     }, {});
     setTouchedFields(newTouchedFields);

    // Validate form before submitting
    const errors = validateForm(registrationForm);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      // If there are errors, stop the submission
      toast.error("Please fix the errors in the form.");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors

    try {
      if (!selectedStudent) {
        setError("No student selected");
        setLoading(false);
        return;
      }

      // Create the updated student object
      const updatedStudent = {
        ...selectedStudent, // Keep existing data
        phoneNum: registrationForm.phoneNum,
        email: registrationForm.email,
        emergencyContactNumber: registrationForm.emergencyContact,
        parentFirstName: registrationForm.parentFirstName,
        parentLastName: registrationForm.parentLastName,
        parentPhone: registrationForm.parentPhone,
        parentAddress: registrationForm.parentAddress,
        keyHolder: registrationForm.keyHolder,
        arrivalDate: registrationForm.arrivalDate || null, // Send null if empty
        dormId: registrationForm.dormNumber,
        status: true, // Mark student as registered
        registeredBy: user ? `${user.firstName} ${user.lastName}` : "Unknown", // Add registering user info
        lastUpdated: new Date().toISOString() // Timestamp of update
      };

      // Dispatch the update action
      const result = await dispatch(UpdateStudentByStudent({
        id: selectedStudent._id,
        formData: updatedStudent
      }));

      // Check if the action resulted in an error (using RTK Query unwrap pattern)
      if (result.error) {
        // Handle specific error structures if needed, otherwise use a generic message
        throw new Error(result.error.message || "Failed to update student");
      }

      // Show success toast and close the dialog
      toast.success(`Student ${isPreviouslyRegistered ? 'updated' : 'registered'} successfully!`);
      handleOpenChange(false);

    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.message || `Failed to ${isPreviouslyRegistered ? 'update' : 'register'} student`;
      toast.error(errorMessage);
      setError(errorMessage); // Set local error state as well
    } finally {
      setLoading(false);
    }
  };

  // Handler for the Key Holder radio group change
  const handleKeyHolderChange = (value) => {
    const updatedForm = {
        ...registrationForm,
        keyHolder: value === "true" // Convert string value back to boolean
    };
    setRegistrationForm(updatedForm);
    // Trigger validation after radio button change
    const errors = validateForm(updatedForm);
    setValidationErrors(errors);
    // Mark keyHolder as touched after change
    setTouchedFields({
        ...touchedFields,
        keyHolder: true,
    });
  };

  // Check if the form is valid for enabling the submit button
  // Button is disabled if loading or if there are any validation errors
  const isSubmitDisabled = loading || Object.keys(validationErrors).length > 0 || selectedStudent === null;

  return (
    // Use AnimatePresence for exit animations
    <AnimatePresence mode="wait">
      {isOpen && (
        // Dialog component from shadcn/ui
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogContent className="max-w-md p-0 gap-0">
            {/* Motion div for entry/exit animation */}
            <motion.div
              initial={{ x: "-100%" }} // Start off-screen to the left
              animate={{ x: 0 }} // Animate to the original position
              exit={{ x: "-100%" }} // Exit off-screen to the left
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full"
            >
              {/* Dialog Header */}
              <DialogHeader className="px-6 py-4 border-b">
                <DialogTitle className="text-2xl font-bold text-center">
                  {isPreviouslyRegistered ? "Update Student" : "Register Student"}
                </DialogTitle>
              </DialogHeader>

              {/* Dialog Body with scrollable content */}
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                {/* Search Section */}
                <div className="flex gap-4 mb-6">
                  <Input
                    placeholder="Enter Student ID (e.g., 12345)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={loading} // Disable button while loading
                    className="min-w-[100px]"
                  >
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>

                {/* Error Message Display (for search errors) */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md mb-6">
                    {error}
                  </div>
                )}

                {/* Student Info and Registration Form (shown only if a student is selected) */}
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
                          <p className="font-semibold text-gray-600">Dorm</p>
                          <p className="text-gray-900">{selectedStudent.dormId}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">Student Type</p>
                          <p className="text-gray-900">{selectedStudent.studCategory}</p>
                        </div>
                        {/* Previously Registered Indicator */}
                        {isPreviouslyRegistered && (
                          <div className="col-span-2">
                            <p className="font-semibold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200 text-center">
                              This student has been registered previously
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Registration/Update Form */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {isPreviouslyRegistered ? "Update Details" : "Registration Details"}
                      </h3>

                      {/* Primary Information */}
                      <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                        <h4 className="font-medium text-gray-700">Primary Information</h4>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="font-semibold text-gray-600" htmlFor="arrivalDate">Arrival Date</label>
                            <Input
                              id="arrivalDate"
                              type="date"
                              placeholder="Select arrival date"
                              value={registrationForm.arrivalDate}
                              onChange={handleInputChange}
                              onBlur={handleInputBlur}
                            />
                             {/* Display error only if the field is touched and has an error */}
                             {touchedFields.arrivalDate && validationErrors.arrivalDate && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.arrivalDate}</p>
                              )}
                          </div>
                          <div className="space-y-2">
                            
                             {/* Display error only if the field is touched and has an error */}
                             {touchedFields.dormNumber && validationErrors.dormNumber && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.dormNumber}</p>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                        <h4 className="font-medium text-gray-700">Contact Information</h4>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="font-semibold text-gray-600" htmlFor="phoneNum">Phone Number</label>
                            <Input
                              id="phoneNum"
                              type="tel"
                              placeholder="e.g., +251912345678 or 0912345678"
                              value={registrationForm.phoneNum}
                              onChange={handleInputChange}
                              onBlur={handleInputBlur}
                            />
                            {/* Display error only if the field is touched and has an error */}
                            {touchedFields.phoneNum && validationErrors.phoneNum && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.phoneNum}</p>
                              )}
                          </div>
                          <div className="space-y-2">
                            <label className="font-semibold text-gray-600" htmlFor="email">Email</label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="e.g., student@example.com"
                              value={registrationForm.email}
                              onChange={handleInputChange}
                              onBlur={handleInputBlur}
                            />
                             {/* Display error only if the field is touched and has an error */}
                            {touchedFields.email && validationErrors.email && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Emergency Contact */}
                      <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                        <h4 className="font-medium text-gray-700">Emergency Contact Information</h4>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="font-semibold text-gray-600" htmlFor="emergencyContact">Emergency Contact</label>
                            <Input
                              id="emergencyContact"
                              type="tel"
                              placeholder="e.g., +251912345678 or 0912345678"
                              value={registrationForm.emergencyContact}
                              onChange={handleInputChange}
                              onBlur={handleInputBlur}
                            />
                             {/* Display error only if the field is touched and has an error */}
                            {touchedFields.emergencyContact && validationErrors.emergencyContact && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.emergencyContact}</p>
                              )}
                          </div>
                          <div className="space-y-2">
                            <label className="font-semibold text-gray-600" htmlFor="parentFirstName">Parent First Name</label>
                            <Input
                              id="parentFirstName"
                              type="text"
                              placeholder="Enter parent's first name"
                              value={registrationForm.parentFirstName}
                              onChange={handleInputChange}
                              onBlur={handleInputBlur}
                            />
                             {/* Display error only if the field is touched and has an error */}
                             {touchedFields.parentFirstName && validationErrors.parentFirstName && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.parentFirstName}</p>
                              )}
                          </div>
                          <div className="space-y-2">
                            <label className="font-semibold text-gray-600" htmlFor="parentLastName">Parent Last Name</label>
                            <Input
                              id="parentLastName"
                              type="text"
                              placeholder="Enter parent's last name"
                              value={registrationForm.parentLastName}
                              onChange={handleInputChange}
                              onBlur={handleInputBlur}
                            />
                             {/* Display error only if the field is touched and has an error */}
                            {touchedFields.parentLastName && validationErrors.parentLastName && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.parentLastName}</p>
                              )}
                          </div>
                          <div className="space-y-2">
                            <label className="font-semibold text-gray-600" htmlFor="parentPhone">Parent Phone</label>
                            <Input
                              id="parentPhone"
                              type="tel"
                              placeholder="e.g., +251912345678 or 0912345678"
                              value={registrationForm.parentPhone}
                              onChange={handleInputChange}
                              onBlur={handleInputBlur}
                            />
                             {/* Display error only if the field is touched and has an error */}
                            {touchedFields.parentPhone && validationErrors.parentPhone && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.parentPhone}</p>
                              )}
                          </div>
                          {/* Make Parent Address span two columns */}
                          <div className="space-y-2 col-span-2">
                            <label className="font-semibold text-gray-600" htmlFor="parentAddress">Parent Address</label>
                            <Input
                              id="parentAddress"
                              type="text"
                              placeholder="Enter parent's address"
                              value={registrationForm.parentAddress}
                              onChange={handleInputChange}
                              onBlur={handleInputBlur}
                            />
                             {/* Display error only if the field is touched and has an error */}
                            {touchedFields.parentAddress && validationErrors.parentAddress && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.parentAddress}</p>
                              )}
                          </div>
                          {/* Key Holder Radio Buttons */}
                          {/* Make Radio buttons span two columns */}
                          <div className="space-y-2 col-span-2">
                            <Label className="font-semibold text-gray-600">
                              Will he/she take the key?
                            </Label>

                            <RadioGroup
                              value={registrationForm.keyHolder ? "true" : "false"}
                              onValueChange={handleKeyHolderChange}
                              className="flex space-x-4"
                              // Add blur event to RadioGroup if needed, though less common for validation on blur
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id="key-yes" />
                                <Label htmlFor="key-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id="key-no" />
                                <Label htmlFor="key-no">No</Label>
                              </div>
                            </RadioGroup>
                             {/* Display error only if the field is touched and has an error */}
                             {/* Note: RadioGroup validation might need a different approach if required */}
                             {/* {touchedFields.keyHolder && validationErrors.keyHolder && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.keyHolder}</p>
                              )} */}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-4 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => handleOpenChange(false)}
                          className="min-w-[100px]"
                          disabled={loading} // Disable cancel while submitting
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleRegistration}
                          disabled={isSubmitDisabled} // Use the new disabled variable
                          // Dynamically set button color based on whether it's an update or registration
                          className={`min-w-[100px] ${isPreviouslyRegistered ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                          {/* Dynamically set button text */}
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