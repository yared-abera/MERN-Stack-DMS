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
    phone: "",
    email: "",
    emergencyContact: "",
    parentName: "",
    parentPhone: "",
    address: "",
    additionalInfo: "",
    arrivalDate: "",
    roomNumber: "",
  });
  
  
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
        selector: (row) => row.status || "Not Registered",
        sortable: true,
        width: '150px',
        cell: (row) => (
          <span className={`px-2 py-1 rounded-full text-sm ${
            row.status === 'Registered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {row.status || "Not Registered"}
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
              
              // Update the student in the database
              dispatch(updateStudent(updatedStudent));
              
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

  // Add registration handler
  const handleRegistration = async () => {
    try {
      const updatedStudent = {
        ...selectedStudent,
        ...registrationForm,
        status: 'Registered',
        registrationDate: new Date().toISOString(),
        dormId: registrationForm.roomNumber, // Update room number
        registeredBy: "proctor", // Add who registered the student
        lastUpdated: new Date().toISOString()
      };
      
      await dispatch(updateStudent(updatedStudent)).unwrap();
      
      // Update local state
      const updateStudentList = (list) => list.map(student => 
        student.userName === selectedStudent.userName ? updatedStudent : student
      );
      
      setStudents(updateStudentList(students));
      setFilteredStudents(updateStudentList(filteredStudents));
      
      setIsRegistrationDialogOpen(false);
      // Show success message
      alert("Student registered successfully!");
    } catch (error) {
      console.error("Failed to register student:", error);
      alert("Failed to register student. Please try again.");
    }
  };

  // When opening registration dialog, populate existing data
  const handleOpenRegistration = (student) => {
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
      roomNumber: student.dormId || "",
    });
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

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="grid grid-cols-1 gap-3 p-3">
              <div className="space-y-1">
                <p className="font-semibold text-gray-600 text-sm">Student ID</p>
                <p className="text-gray-900">{selectedStudent.userName}</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-600 text-sm">Name</p>
                <p className="text-gray-900">{`${selectedStudent.Fname} ${selectedStudent.Lname}`}</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-600 text-sm">Student Type</p>
                <p className="text-gray-900">{selectedStudent.studCategory}</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-600 text-sm">Block & Dorm</p>
                <p className="text-gray-900">Block {selectedStudent.blockNum}, Room {selectedStudent.dormId}</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-600 text-sm">Gender</p>
                <p className="text-gray-900">{selectedStudent.gender}</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-600 text-sm">Contact Info</p>
                <p className="text-gray-900">
                  {selectedStudent.phone || 'Phone: Not provided'}
                  <br />
                  {selectedStudent.email || 'Email: Not provided'}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Registration Dialog */}
      <Dialog open={isRegistrationDialogOpen} onOpenChange={setIsRegistrationDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Student Registration</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6 p-6">
              {/* Existing Student Info */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-semibold text-gray-600">Arrival Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={registrationForm.arrivalDate}
                    onChange={(e) => setRegistrationForm({...registrationForm, arrivalDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-gray-600">Room Number</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={registrationForm.roomNumber}
                    onChange={(e) => setRegistrationForm({...registrationForm, roomNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-gray-600">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full p-2 border rounded-md"
                    value={registrationForm.phone}
                    onChange={(e) => setRegistrationForm({...registrationForm, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-gray-600">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md"
                    value={registrationForm.email}
                    onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-gray-600">Emergency Contact</label>
                  <input
                    type="tel"
                    className="w-full p-2 border rounded-md"
                    value={registrationForm.emergencyContact}
                    onChange={(e) => setRegistrationForm({...registrationForm, emergencyContact: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-gray-600">Parent Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={registrationForm.parentName}
                    onChange={(e) => setRegistrationForm({...registrationForm, parentName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-gray-600">Parent Phone</label>
                  <input
                    type="tel"
                    className="w-full p-2 border rounded-md"
                    value={registrationForm.parentPhone}
                    onChange={(e) => setRegistrationForm({...registrationForm, parentPhone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-gray-600">Address</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={registrationForm.address}
                    onChange={(e) => setRegistrationForm({...registrationForm, address: e.target.value})}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="font-semibold text-gray-600">Additional Information</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows="3"
                    value={registrationForm.additionalInfo}
                    onChange={(e) => setRegistrationForm({...registrationForm, additionalInfo: e.target.value})}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsRegistrationDialogOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegistration}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Complete Registration
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
 
