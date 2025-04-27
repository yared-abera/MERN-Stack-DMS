import { getAllocatedStudent, UpdateStudent } from '@/store/studentAllocation/allocateSlice'; // Assuming this fetches the student allocation data

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
// Removed unused imports: getAllBlock, getAllUser
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Assuming this is from Shadcn UI or similar
import { toast } from 'sonner';

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#42b3f5",
      color: "#0a0a0a",
      fontWeight: "bold",
      fontSize: "14px",
      textTransform: "uppercase",
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

// Renamed component for clarity as it displays Allocated Students
export default function ViewAllocatedStudents() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to hold the list after initial gender filtering
  const [genderFilteredStudents, setGenderFilteredStudents] = useState([]);
  // State to hold the list currently displayed in the table (after search/button filters)
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [filterButtonText, setFilterButtonText] = useState("All"); // Default filter button text
  // Renamed state variables from block to student
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const[editAllocation,setEditAllocation]=useState(false)
  const [editData, setEditData] = useState({});

  const { user } = useSelector(state => state.auth);
  const { AllocatedStudent, isLoading } = useSelector(state => state.student);


  // Fetch allocated students when component mounts or user changes
  useEffect(() => {
    // Only dispatch if user exists, as gender filtering depends on user.sex
    if (user) {
      dispatch(getAllocatedStudent());
    }
  }, [dispatch, user]); // Depend on dispatch and user

  // Apply initial gender filter when AllocatedStudent data changes
  useEffect(() => {
    if (AllocatedStudent && AllocatedStudent.length > 0 && user?.sex) {
      const userGender = user.sex;
      const studentsByGender = AllocatedStudent.filter(
        (stud) => stud.sex?.toUpperCase() === userGender.toUpperCase()
      );
      setGenderFilteredStudents(studentsByGender); // Store the gender-filtered list
      setFilteredStudents(studentsByGender); // Initially display the gender-filtered list
    } else {
        // If no data or no user gender, clear the lists
        setGenderFilteredStudents([]);
        setFilteredStudents([]);
    }
  }, [AllocatedStudent, user]); // Depend on AllocatedStudent and user

  // Filter function for search input - searches within the gender-filtered list
  const filterByInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter the genderFilteredStudents list based on the search query
    const filtered = genderFilteredStudents.filter(
      (student) =>
        student?.userName?.toLowerCase().includes(query) || // Search by userName
        student?.Fname?.toLowerCase().includes(query) ||   // Search by First Name
        student?.Lname?.toLowerCase().includes(query)      // Search by Last Name
      // Add other fields like blockNum or dormId if needed and they are strings
      // student?.blockNum?.toString().includes(query) ||
      // student?.dormId?.toString().includes(query)
    );
    setFilteredStudents(filtered); // Update the displayed list
    setFilterButtonText(null); // Clear button filter state when searching
  };

  // Reset filters - show all students of the user's gender
  const resetFilters = () => {
    setSearchQuery(""); // Clear search query
    setFilteredStudents(genderFilteredStudents); // Reset to the full gender-filtered list
    setFilterButtonText("All"); // Set button state to 'All'
  };

  // Filter function for buttons - filters within the gender-filtered list by student category
  const filterByButton = (category) => {
     setSearchQuery(""); // Clear search query when using buttons
     const filtered = genderFilteredStudents.filter(
       (student) =>
         student.studCategory &&
         student.studCategory.toLowerCase() === category.toLowerCase()
     );
     setFilteredStudents(filtered); // Update the displayed list
     setFilterButtonText(category); // Set button state
  };

  // Define columns for the DataTable to display student details
  const columns = [
    { name: "Student ID", selector: (row) => row.userName, sortable: true },
    { name: "First Name", selector: (row) => row.Fname, sortable: true },
    { name: "Last Name", selector: (row) => row.Lname, sortable: true },
    { name: "Gender", selector: (row) => row.sex, sortable: true },
    {
      name: "Student Type",
      selector: (row) => row.studCategory,
      sortable: true,
    },
    {
      name: "Block Number",
      selector: (row) => row.blockNum,
      sortable: true,
    },
    {
      name: "Dorm Number",
      selector: (row) => row.dormId,
      sortable: true,
    },
    { 
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
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
      cell: (row) => (
        <div className='flex flex-col gap-2'>
          <button
            onClick={() => {
              setSelectedStudent(row);
              setShowStudentDetails(true);
            }}
            className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            View Details
          </button>
          <button
            onClick={() => {
              setSelectedStudent(row);
              setEditAllocation(true);
            }}
            className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Edit
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  const handleUpdateStudent = async (updatedData) => {
    try {
      console.log(updatedData,"updatedData");
      
      dispatch(
        UpdateStudent({ id: updatedData._id, formData: updatedData })
      ).then((res) => {
        if (res.payload.success) {
          toast.success(res.payload.message);
          dispatch(getAllocatedStudent()).then((res) => {
            if (res.payload.success) { 
              setFilteredStudents(res.payload.data);
            }
          });
        } else {
          toast.error(`${res.payload.message}`);
        }
      });

     setEditAllocation(false);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.value, "e.target.value");

    console.log("editData:", editData);
    handleUpdateStudent({
      _id: selectedStudent._id,
      userName: selectedStudent.userName,
      ...editData,
    });
  };

  return (
    <div className="flex flex-col overflow-x-hidden">
      <div className="flex-1 relative min-h-screen mt-2">
        <div className="p-4 pt-0 md:w-[90%] flex flex-wrap items-center justify-between transition-all duration-300 ml-2 gap-4 left-64 w-[calc(100%-17rem)]">
        
          <button
            className="flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition duration-300 mr-4"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="mr-2 text-lg" /> Back
          </button>

          {/* Search Input */}
          <div className="relative flex items-center w-72 md:w-1/3 mr-4">
            <FaSearch className="absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search by Student ID or Name" // Updated placeholder
              className="h-10 px-4 py-2 border border-gray-300 rounded-md w-full pl-10"
              value={searchQuery}
              onChange={filterByInput}
            />
          </div>
        </div>

        <div className="p-6 max-w-min">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Allocated Students List</h2> {/* Updated title */}

          {/* Filter Buttons */}
          {/* Updated button labels and logic to filter by student category */}
          <div className="flex w-full justify-end space-x-2 mb-4">
            <button
              className={`${
                filterButtonText === "All" ? "bg-blue-600" : "bg-gray-600"
              } px-3 py-1 text-white rounded-md hover:opacity-50`}
              onClick={() => {
                resetFilters();
              }}
            >
              All ({genderFilteredStudents.length}) {/* Show count of gender-filtered students */}
            </button>
             {/* Assuming 'senior', 'fresh', 'remedial' are your student categories */}
            <button
              className={`${
                filterButtonText === "senior" ? "bg-blue-600" : "bg-blue-500"
              } px-3 py-1 text-white rounded-md hover:opacity-50`}
              onClick={() => {
                filterByButton("senior");
              }}
            >
              Senior
            </button>
            <button
              className={`${
                filterButtonText === "fresh" ? "bg-blue-600" : "bg-green-500" // Changed color for distinction
              } px-3 py-1 text-white rounded-md hover:opacity-50`}
              onClick={() => {
                filterByButton("fresh");
              }}
            >
              Fresh
            </button>
             <button
              className={`${
                filterButtonText === "remedial" ? "bg-blue-600" : "bg-orange-500" // Changed color for distinction
              } px-3 py-1 text-white rounded-md hover:opacity-50`}
              onClick={() => {
                filterByButton("remedial");
              }}
            >
              Remedial
            </button>
             {/* Add more buttons if you have other categories */}
          </div>

          {isLoading ? (
            <div className="text-center text-gray-600">Loading Students...</div> // Updated loading text
          ) : (
            <div className=" flex flex-col justify-center ml-6 ">
              {/* Corrected the 'data' prop to use the state variable `filteredStudents` */}
              <DataTable className='w-auto md:max-w-4xl'
                columns={columns}
                data={filteredStudents}
                pagination
                customStyles={customStyles}
                highlightOnHover
                striped
                 noDataComponent="No allocated students found matching criteria." // Message when no data
              />
            </div>
          )}
        </div>
      </div>

      {/* Student Details Dialog - Renamed state variables and updated content */}
      {showStudentDetails && selectedStudent && (
        <Dialog open={showStudentDetails} onOpenChange={setShowStudentDetails}>
          <DialogContent className="max-w-2xl h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Student Details</DialogTitle> {/* Updated title */}
            </DialogHeader>
            <DialogDescription>
              <div className="space-y-6">
                {/* Student Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow">
                  <p>
                    <span className="font-semibold">Student ID:</span>{" "}
                    {selectedStudent.userName}
                  </p>
                   <p>
                    <span className="font-semibold">First Name:</span>{" "}
                    {selectedStudent.Fname}
                  </p>
                   <p>
                    <span className="font-semibold">Last Name:</span>{" "}
                    {selectedStudent.Lname}
                  </p>
                   {/* Assuming Mname exists */}
                   {selectedStudent.Mname && (
                       <p>
                        <span className="font-semibold">Middle Name:</span>{" "}
                        {selectedStudent.Mname}
                       </p>
                   )}
                   <p>
                    <span className="font-semibold">Gender:</span>{" "}
                    {selectedStudent.sex}
                  </p>
                   <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {selectedStudent.email}
                  </p>
                   <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {selectedStudent.phoneNum}
                  </p>
                  <p>
                    <span className="font-semibold">Student Type:</span>{" "}
                    {selectedStudent.studCategory}
                  </p>
                  <p>
                    <span className="font-semibold">Allocated Block:</span>{" "}
                    {selectedStudent.blockNum || 'Not Assigned'} {/* Display allocated block if available */}
                  </p>
                  <p>
                    <span className="font-semibold">Allocated Dorm:</span>{" "}
                    {selectedStudent.dormId || 'Not Assigned'} {/* Display allocated dorm if available */}
                  </p>
                  {/* Add other student-specific details here */}
                </div>

               
              </div>
            </DialogDescription>
            {/* Optional: Add DialogFooter for close button if needed */}
             <DialogFooter>
                <DialogClose asChild>
                    <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Close</button>
                </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

<Dialog open={editAllocation} onOpenChange={()=>setEditAllocation(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Student Block or Dorm only</DialogTitle>
          </DialogHeader>

          {selectedStudent && (
            <form onSubmit={onSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="Fname" className="font-medium text-right">
                    First Name:
                  </label>
                  <input
                    id="Fname"
                    name="Fname"
                    value={selectedStudent.Fname}
                    readOnly
                    className="border p-2 rounded col-span-2"
                    placeholder="First Name"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="Mname" className="font-medium text-right">
                    Middle Name:
                  </label>
                  <input
                    id="Mname"
                    name="Mname"
                    value={selectedStudent.Mname}
                    readOnly
                    className="border p-2 rounded col-span-2"
                    placeholder="Middle Name"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="Lname" className="font-medium text-right">
                    Last Name:
                  </label>
                  <input
                    id="Lname"
                    name="Lname"
                    value={selectedStudent.Lname}
                   readOnly
                    className="border p-2 rounded col-span-2"
                    placeholder="Last Name"
                  />
                </div>
 

                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="sex" className="font-medium text-right">
                    Gender:
                  </label>
                  <input
                    id="sex"
                    name="sex"
                    value={selectedStudent.sex}
                    readOnly
                    className="border p-2 rounded col-span-2"
                    placeholder="Block Number"
                    
                  />
                </div>



                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="blockNum" className="font-medium text-right">
                    Block Number:
                  </label>
                  <input
                    id="blockNum"
                    name="blockNum"
                    defaultValue={selectedStudent.blockNum}
                    className="border p-2 rounded col-span-2"
                    placeholder="Block Number"
                    onChange={(e) =>
                      setEditData({ ...editData, blockNum: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="dormId" className="font-medium text-right">
                    Dorm Number:
                  </label>
                  <input
                    id="dormId"
                    name="dormId"
                    defaultValue={selectedStudent.dormId}
                    className="border p-2 rounded col-span-2"
                    placeholder="Dorm Number"
                    onChange={(e) =>
                      setEditData({ ...editData, dormId: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                  >
                    Update Student
                  </button>
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}