import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { fetchProctorBlocks } from '@/store/blockSlice/index';
import {  getAllocatedStudent, updateStudent } from "../../store/studentAllocation/allocateSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { setUpdateAllocation } from "../../store/common/sidebarSlice";
import { toast } from "sonner";

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#42b3f5",
      color: "#0a0a0a",
      fontWeight: "bold",
      fontSize: "14px",
      textTransform: "uppercase",
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  },
  cells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  },
  rows: {
    style: {
      "&:hover": {
        backgroundColor: "#F5DEB3",
        cursor: "pointer",
        transition: "background-color 0.2s ease-in-out",
      },
    },
  },
};


export default function ProctorViewInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filterButtonText, setFilterButtonText] = useState(null);
  const { list: blocks } = useSelector((state) => state.block);
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    phoneNum: "",
    email: "",
    emergencyContactNumber: "",
    parentFirstName: "",
    parentLastName: "",
    parentPhone: "",
    parentAddress: "",
    additionalInfo: "",
    arrivalDate: "",
    dormId: "",
  });
  
  // Add form validation state
  const [formErrors, setFormErrors] = useState({});
  
  useEffect(() => {
     
    const fetchBlocks = async () => {
      try {
        await dispatch(fetchProctorBlocks()).unwrap();
      } catch (error) {
        console.error("Failed to fetch blocks:", error);
      }
    };
    fetchBlocks();
  }, [dispatch]);  
  
  useEffect(() => {  
    if (blocks.length === 0) return; // 
  
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await dispatch(getAllocatedStudent()).unwrap();
        if (response.data.length > 0) {
          const proctorStudents = response.data.filter((student) => 
            blocks.some((block) => block.blockNum === student.blockNum)
          );
          setStudents(proctorStudents);
          setFilteredStudents(proctorStudents);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStudents();
  }, [blocks, dispatch]);  
  
  console.log("Proctor blocks updated:", blocks);
  
  const filterByInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    // Filter students by ID and only show those in proctor's blocks
    const filteredProctorStudents = students.filter((student) => 
      student.userName.toLowerCase().includes(query) && 
      blocks.some(block => block.blockNum === student.blockNum)
    );
    
    setFilteredStudents(filteredProctorStudents);
  };

 
  const resetFilters = () => {
    setSearchQuery("");
    setFilteredStudents(students);
  };

  const filterByButton = (status) => {
    setFilteredStudents(
      students.filter(
        (student) =>
          student.studCategory &&
          student.studCategory.toLowerCase() === status.toLowerCase()
      )
    );
  };

  // Define Table Columns
  const columns = useMemo(
    () => [
      { 
        name: "Student ID", 
        selector: (row) => row.userName, 
        sortable: true,
        width: '130px',
      },
      { 
        name: "First Name", 
        selector: (row) => row.Fname, 
        sortable: true,
        width: '120px',
      },
      { 
        name: "Last Name", 
        selector: (row) => row.Lname, 
        sortable: true,
        width: '120px',
      },
      { 
        name: "Student Type", 
        selector: (row) => row.studCategory, 
        sortable: true,
        width: '120px',
      },
      { 
        name: "Block Number", 
        selector: (row) => row.blockNum, 
        sortable: true,
        width: '90px',
      },
      { 
        name: "Dorm Number", 
        selector: (row) => row.dormId, 
        sortable: true,
        width: '90px',
      },
      { 
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
        width: '150px',
        cell: (row) => (
          <span className={`px-2 py-1 rounded-full text-sm ${
            row.status === true ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {row.status === true ? "Registered" : "Not Registered"}
          </span>
        )
      },
      {
        name: "Actions",
        width: '100px',
        cell: (row) => (
          <button
            onClick={() => {
              // Update the student with lastUpdated timestamp
              const updatedStudent = {
                ...row,
                lastUpdated: new Date().toISOString()
              };
              
              // Set selected student and open dialog
              setSelectedStudent(updatedStudent);
              setIsViewDialogOpen(true);
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            View
          </button>
        ),
      },
    ],
    []
  );

  // Add validation function with improved error messages
  const validateRegistrationForm = () => {
    const errors = {};
    
    // Phone Number: Must be 10 digits, numbers only
    if (registrationForm.phoneNum) {
      if (!/^\d{10}$/.test(registrationForm.phoneNum.trim())) {
        errors.phoneNum = "Phone Number must be exactly 10 digits.";
        toast.error("Phone Number must be exactly 10 digits.");
      }
    }
    
    // Email: Must be valid email format
    if (registrationForm.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationForm.email.trim())) {
        errors.email = "Invalid email address.";
        toast.error("Invalid email address.");
      }
    }
    
    // Emergency Contact: If filled, must be 10 digits
    if (registrationForm.emergencyContactNumber) {
      if (!/^\d{10}$/.test(registrationForm.emergencyContactNumber.trim())) {
        errors.emergencyContactNumber = "Emergency Contact must be 10 digits.";
        toast.error("Emergency Contact must be 10 digits.");
      }
    }
    
    // Parent First Name: Required (at least 2 letters)
    if (!registrationForm.parentFirstName || registrationForm.parentFirstName.trim().length < 2) {
      errors.parentFirstName = "Parent First Name is required (at least 2 letters).";
      toast.error("Parent First Name is required.");
    }
    
    // Parent Last Name: Required (at least 2 letters)
    if (!registrationForm.parentLastName || registrationForm.parentLastName.trim().length < 2) {
      errors.parentLastName = "Parent Last Name is required (at least 2 letters).";
      toast.error("Parent Last Name is required.");
    }
    
    // Parent Phone: Required, must be 10 digits
    if (!registrationForm.parentPhone || !/^\d{10}$/.test(registrationForm.parentPhone.trim())) {
      errors.parentPhone = "Parent Phone must be exactly 10 digits.";
      toast.error("Parent Phone must be exactly 10 digits.");
    }
    
    // Parent Address: Required (at least 5 characters)
    if (!registrationForm.parentAddress || registrationForm.parentAddress.trim().length < 5) {
      errors.parentAddress = "Parent Address is required (at least 5 characters).";
      toast.error("Parent Address is required.");
    }
    
    // Arrival Date: Required, must be a valid date
    if (!registrationForm.arrivalDate || registrationForm.arrivalDate.trim() === "") {
      errors.arrivalDate = "Arrival Date is required.";
      toast.error("Arrival Date is required.");
    }
    
    // Dorm Number: Required (at least 1 character)
    if (!registrationForm.dormId || registrationForm.dormId.trim() === "") {
      errors.dormId = "Dorm Number is required.";
      toast.error("Dorm Number is required.");
    }
    
    // Display summary notification if multiple errors
    if (Object.keys(errors).length > 1) {
      toast.error(`${Object.keys(errors).length} validation issues need to be fixed`);
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Improve handle input change function with better validation feedback
  const handleInputChange = (e, field) => {
    const value = e.target.value;
    
    setRegistrationForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Real-time validation with proper error messages
    let error = null;
    
    switch (field) {
      case 'phoneNum':
        if (value && !/^\d{10}$/.test(value.trim())) {
          error = "Phone Number must be exactly 10 digits.";
        }
        break;
        
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Invalid email address.";
        }
        break;
        
      case 'emergencyContactNumber':
        if (value && !/^\d{10}$/.test(value.trim())) {
          error = "Emergency Contact must be 10 digits.";
        }
        break;
        
      case 'parentFirstName':
        if (!value || value.trim().length < 2) {
          error = "Parent First Name is required (at least 2 letters).";
        }
        break;
        
      case 'parentLastName':
        if (!value || value.trim().length < 2) {
          error = "Parent Last Name is required (at least 2 letters).";
        }
        break;
        
      case 'parentPhone':
        if (!value || !/^\d{10}$/.test(value.trim())) {
          error = "Parent Phone must be exactly 10 digits.";
        }
        break;
        
      case 'parentAddress':
        if (!value || value.trim().length < 5) {
          error = "Parent Address is required (at least 5 characters).";
        }
        break;
        
      case 'arrivalDate':
        if (!value || value.trim() === "") {
          error = "Arrival Date is required.";
        }
        break;
        
      case 'dormId':
        if (!value || value.trim() === "") {
          error = "Dorm Number is required.";
        }
        break;
        
      default:
        break;
    }
    
    setFormErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };
  
  // Function to add error validation indicators to input fields
  const renderInputWithValidation = (field, label, type, placeholder, required = false) => {
    // Adjust placeholders to match specific validation requirements
    let updatedPlaceholder = placeholder;
    
    if (field === 'phoneNum' || field === 'emergencyContactNumber' || field === 'parentPhone') {
      updatedPlaceholder = "10 digits required (e.g., 0912345678)";
    } else if (field === 'parentFirstName' || field === 'parentLastName') {
      updatedPlaceholder = "Minimum 2 letters required";
    } else if (field === 'parentAddress') {
      updatedPlaceholder = "Minimum 5 characters required";
    }
    
    return (
      <div className="space-y-2">
        <label className="font-semibold text-gray-600">
          {label} {required || field.includes('parent') ? <span className="text-red-500">*</span> : null}
          {field === 'phoneNum' || field === 'emergencyContactNumber' || field === 'parentPhone' ? (
            <span className="text-xs text-gray-500 ml-1">(10 digits)</span>
          ) : null}
          {field === 'email' ? (
            <span className="text-xs text-gray-500 ml-1">(example@email.com)</span>
          ) : null}
          {field === 'parentFirstName' || field === 'parentLastName' ? (
            <span className="text-xs text-gray-500 ml-1">(min 2 letters)</span>
          ) : null}
          {field === 'parentAddress' ? (
            <span className="text-xs text-gray-500 ml-1">(min 5 characters)</span>
          ) : null}
        </label>
        <div className="relative">
          <input
            type={type}
            className={`w-full p-2 border rounded-md ${formErrors[field] ? 'border-red-500 bg-red-50' : ''}`}
            value={registrationForm[field]}
            onChange={(e) => handleInputChange(e, field)}
            required={required || field.includes('parent')}
            placeholder={updatedPlaceholder}
          />
          {formErrors[field] && (
            <div className="absolute right-2 top-2 text-red-500" title={formErrors[field]}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        {formErrors[field] && (
          <div className="bg-red-50 p-2 rounded border border-red-200 mt-1">
            <p className="text-red-600 text-xs">{formErrors[field]}</p>
          </div>
        )}
      </div>
    );
  };

  // Show registration form with validation message banner at the top
  const renderRegistrationDialog = () => {
    // Check if there are any validation errors to show a banner
    const hasErrors = Object.keys(formErrors).length > 0;
    
    return (
      <Dialog open={isRegistrationDialogOpen} onOpenChange={setIsRegistrationDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl font-bold">Student Registration</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6 p-6 overflow-y-auto">
              {/* Validation Banner - Show at the top of the form */}
              {hasErrors && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-amber-800 font-medium">Please resolve the highlighted issues before submitting</p>
                  </div>
                </div>
              )}
              
              {/* Existing Student Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-600">Student ID</p>
                  <p className="text-gray-900">{selectedStudent.userName}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Full Name</p>
                  <p className="text-gray-900">{`${selectedStudent.Fname} ${selectedStudent.Lname}`}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Block Number</p>
                  <p className="text-gray-900">{selectedStudent.blockNum}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Student Type</p>
                  <p className="text-gray-900">{selectedStudent.studCategory}</p>
                </div>
              </div>

              {/* Registration Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderInputWithValidation(
                  'arrivalDate', 
                  'Arrival Date', 
                  'date', 
                  '', 
                  true
                )}
                
                {renderInputWithValidation(
                  'dormId', 
                  'Room Number', 
                  'text', 
                  'Enter room number', 
                  true
                )}
                
                {renderInputWithValidation(
                  'phoneNum', 
                  'Phone Number', 
                  'tel', 
                  'e.g. +251XXXXXXXXX or 09XXXXXXXX'
                )}
                
                {renderInputWithValidation(
                  'email', 
                  'Email', 
                  'email', 
                  'example@email.com'
                )}
                
                {renderInputWithValidation(
                  'emergencyContactNumber', 
                  'Emergency Contact', 
                  'tel', 
                  'e.g. +251XXXXXXXXX or 09XXXXXXXX'
                )}
                
                {renderInputWithValidation(
                  'parentFirstName', 
                  'Parent First Name', 
                  'text', 
                  'First name'
                )}
                
                {renderInputWithValidation(
                  'parentLastName', 
                  'Parent Last Name', 
                  'text', 
                  'Last name'
                )}
                
                {renderInputWithValidation(
                  'parentPhone', 
                  'Parent Phone', 
                  'tel', 
                  'e.g. +251XXXXXXXXX or 09XXXXXXXX'
                )}
                
                {renderInputWithValidation(
                  'parentAddress', 
                  'Parent Address', 
                  'text', 
                  'Address'
                )}
                
                <div className="col-span-1 sm:col-span-2 space-y-2">
                  <label className="font-semibold text-gray-600">Additional Information</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows="3"
                    value={registrationForm.additionalInfo}
                    onChange={(e) => handleInputChange(e, 'additionalInfo')}
                    placeholder="Add any additional information here"
                  />
                </div>
              </div>

              {/* Error Summary (if any) - Enhance with better visibility */}
              {Object.keys(formErrors).length > 0 && (
                <div className="bg-red-50 p-4 rounded-md border-l-4 border-red-500 shadow-md mt-6 animate-pulse">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-red-700 font-bold text-sm mb-1">Form Validation Failed</h3>
                      <p className="text-red-700 text-xs mb-2">
                        The following {Object.keys(formErrors).length} {Object.keys(formErrors).length === 1 ? 'error' : 'errors'} must be resolved:
                      </p>
                      <ul className="list-disc ml-5 space-y-1">
                        {Object.entries(formErrors)
                          .filter(([_, value]) => Boolean(value))
                          .map(([field, error], index) => (
                            <li key={index} className="text-red-600 text-xs">
                              <span className="font-semibold">{field === 'dormId' ? 'Room Number' : 
                                field === 'arrivalDate' ? 'Arrival Date' : 
                                field === 'phoneNum' ? 'Phone Number' : 
                                field === 'emergencyContactNumber' ? 'Emergency Contact' : 
                                field === 'parentPhone' ? 'Parent Phone' : 
                                field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span> {error}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button - Enhanced with validation state styling */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setIsRegistrationDialogOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegistration}
                  disabled={Object.keys(formErrors).length > 0}
                  className={`px-4 py-2 rounded-md flex items-center transition duration-200 
                    ${Object.keys(formErrors).length > 0 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  {Object.keys(formErrors).length > 0 ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Fix Errors to Continue
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Complete Registration
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  // Modify handleRegistration function with better error handling
  const handleRegistration = async () => {
    try {
      // Run validation before submission
      if (!validateRegistrationForm()) {
        return; // Stop if validation fails - toast notifications will show errors
      }
      
      // Show processing state
      toast.loading("Processing registration...");
      
      // Create updated student object with correct field names matching the database schema
      const updatedStudent = {
        ...selectedStudent,
        phoneNum: registrationForm.phoneNum,
        email: registrationForm.email,
        emergencyContactNumber: registrationForm.emergencyContactNumber,
        parentFirstName: registrationForm.parentFirstName,
        parentLastName: registrationForm.parentLastName,
        parentPhone: registrationForm.parentPhone,
        parentAddress: registrationForm.parentAddress,
        additionalInfo: registrationForm.additionalInfo,
        arrivalDate: registrationForm.arrivalDate,
        dormId: registrationForm.dormId,
        status: true,
        registrationDate: new Date().toISOString(),
        registeredBy: "proctor",
        lastUpdated: new Date().toISOString()
      };
      
      console.log("Submitting student data:", updatedStudent);
      
      const result = await dispatch(updateStudent(updatedStudent)).unwrap();
      
      // Dismiss loading toast
      toast.dismiss();
      
      if (result && result.success === false) {
        throw new Error(result.message || "Registration failed");
      }
      
      // Update local state
      const updateStudentList = (list) => list.map(student => 
        student.userName === selectedStudent.userName ? updatedStudent : student
      );
      
      setStudents(updateStudentList(students));
      setFilteredStudents(updateStudentList(filteredStudents));
      
      setIsRegistrationDialogOpen(false);
      // Show success message
      toast.success("Student registered successfully!");
    } catch (error) {
      console.error("Failed to register student:", error);
      
      // Show specific error message based on error type
      if (error.message.includes("network") || error.message.includes("connection")) {
        toast.error("Network error. Please check your internet connection.");
      } else if (error.message.includes("duplicate")) {
        toast.error("This student is already registered.");
      } else {
        toast.error(`Registration failed: ${error.message}`);
      }
    }
  };

  // When opening registration dialog, populate existing data with correct field names
  const handleOpenRegistration = (student) => {
    setSelectedStudent(student);
    setRegistrationForm({
      phoneNum: student.phoneNum || "",
      email: student.email || "",
      emergencyContactNumber: student.emergencyContactNumber || "",
      parentFirstName: student.parentFirstName || "",
      parentLastName: student.parentLastName || "",
      parentPhone: student.parentPhone || "",
      parentAddress: student.parentAddress || "",
      additionalInfo: student.additionalInfo || "",
      arrivalDate: new Date().toISOString().split('T')[0],
      dormId: student.dormId || "",
    });
    // Clear any previous form errors
    setFormErrors({});
    setIsRegistrationDialogOpen(true);
  };

  return (
    <div className="flex-1 relative min-h-screen bg-gray-50">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <button
              className="flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition duration-300 mr-4"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Student List of Block{blocks.length > 1 ? 's' : ''} {blocks.map(block => block.blockNum).join(', ')}
              </h2>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-96">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Student ID"
              className="w-full h-10 pl-10 pr-4 py-2 border
                border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500
                focus:border-transparent"
              value={ searchQuery }
              onChange={ filterByInput }
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-end gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              filterButtonText === "All"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => {
              resetFilters();
              setFilterButtonText("All");
            }}
          >
            All Students
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              filterButtonText === "Fresh"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => {
              filterByButton("Fresh");
              setFilterButtonText("Fresh");
            }}
          >
            Fresh Students
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              filterButtonText === "Senior"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => {
              filterByButton("Senior");
              setFilterButtonText("Senior");
            }}
          >
            Senior Students
          </button>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden w-[100%]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-600">Loading Students...</div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredStudents}
              pagination
              customStyles={{
                ...customStyles,
                table: {
                  style: {
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    width: '100%',
                  },
                },
                responsiveWrapper: {
                  style: {
                    overflowX: 'visible',
                  },
                },
              }}
              highlightOnHover
              striped
              responsive
              fixedHeader
              fixedHeaderScrollHeight="calc(100vh - 300px)"
            />
          )}
        </div>
      </div>

      {/* View Student Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl font-bold">Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6 p-6 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Personal Information */}
                <div className="flex-1 space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 border-b border-blue-200 pb-2">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-gray-600">Student ID</p>
                        <p className="text-gray-900">{selectedStudent.userName}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">Full Name</p>
                        <p className="text-gray-900">{`${selectedStudent.Fname} ${selectedStudent.Lname}`}</p>
                      </div>
                      {selectedStudent.Mname && (
                        <div>
                          <p className="font-semibold text-gray-600">Middle Name</p>
                          <p className="text-gray-900">{selectedStudent.Mname}</p>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-600">Gender</p>
                        <p className="text-gray-900">{selectedStudent.sex}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">Email</p>
                        <p className="text-gray-900">{selectedStudent.email || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">Phone</p>
                        <p className="text-gray-900">{selectedStudent.phoneNum || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <h3 className="text-lg font-semibold text-green-900 mb-4 border-b border-green-200 pb-2">Academic Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-gray-600">Student Type</p>
                        <p className="text-gray-900">{selectedStudent.studCategory}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">Stream</p>
                        <p className="text-gray-900">{selectedStudent.stream}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">Department</p>
                        <p className="text-gray-900">{selectedStudent.department || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">Batch</p>
                        <p className="text-gray-900">{selectedStudent.batch || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">College</p>
                        <p className="text-gray-900">{selectedStudent.collage || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dormitory and Registration Information */}
                <div className="flex-1 space-y-6">
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4 border-b border-purple-200 pb-2">Dormitory Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-gray-600">Block Number</p>
                        <p className="text-gray-900">{selectedStudent.blockNum}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">Dorm Number</p>
                        <p className="text-gray-900">{selectedStudent.dormId || "Not assigned"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">Registration Status</p>
                        <p className={`${selectedStudent.status === true ? 'text-green-600 font-semibold' : 'text-yellow-600'}`}>
                          {selectedStudent.status === true ? "Registered" : "Not Registered"}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">Key Holder</p>
                        <p className="text-gray-900">{selectedStudent.keyHolder === true ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <h3 className="text-lg font-semibold text-amber-900 mb-4 border-b border-amber-200 pb-2">Emergency Contact</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-gray-600">Emergency Contact</p>
                        <p className="text-gray-900">{selectedStudent.emergencyContactNumber || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">Parent Name</p>
                        <p className="text-gray-900">
                          {selectedStudent.parentFirstName || selectedStudent.parentLastName ? 
                            `${selectedStudent.parentFirstName || ""} ${selectedStudent.parentLastName || ""}` : 
                            "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">Parent Phone</p>
                        <p className="text-gray-900">{selectedStudent.parentPhone || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">Parent Address</p>
                        <p className="text-gray-900">{selectedStudent.parentAddress || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Registration Details */}
                  {selectedStudent.status === true && (
                    <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                      <h3 className="text-lg font-semibold text-teal-900 mb-4 border-b border-teal-200 pb-2">Registration Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold text-gray-600">Arrival Date</p>
                          <p className="text-gray-900">{selectedStudent.arrivalDate ? 
                            new Date(selectedStudent.arrivalDate).toLocaleDateString() : 
                            "Not recorded"}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">Registered By</p>
                          <p className="text-gray-900">{selectedStudent.registeredBy || "Not recorded"}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">Last Updated</p>
                          <p className="text-gray-900">{selectedStudent.lastUpdated ? 
                            new Date(selectedStudent.lastUpdated).toLocaleString() : 
                            "Not recorded"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                {!selectedStudent.status && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      dispatch(setUpdateAllocation());
                    }}
                  >
                    Register Student
                  </Button>
                )}
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Registration Dialog */}
      {renderRegistrationDialog()}
    </div>
  );
}
 
