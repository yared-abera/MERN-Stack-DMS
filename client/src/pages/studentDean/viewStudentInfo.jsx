import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector} from "react-redux";
import {  getAllocatedStudent } from "../../store/studentAllocation/allocateSlice";
import { FaArrowLeft, FaSearch } from "react-icons/fa"; 
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

const StudentInfo = () => {  // Renamed from StudentInfo to IncidentList for clarity
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [Students, setStudents] = useState([]);
  const [filteredIncidents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [filterButtonText, setFilterButtonText] = useState(null); // Default filter button text

  // Fetch Incidents
  useEffect(() => {
    const getStudents = async () => {
      setLoading(true);
      try {
        
        const { payload } = await dispatch(getAllocatedStudent());
         console.log(payload, "payload");
         
        if (payload?.data) {
          setStudents(payload.data);
          setFilteredStudents(payload.data);  
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getStudents();
  }, [dispatch]);

  // Filter function for search input
  const filterByInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredStudents(
      Students.filter((student) =>
        student?.userName?.toLowerCase().includes(query)
      )
    );
  };

  // Filter functions for buttons
  const resetFilters = () => {
    setSearchQuery("");
    setFilteredStudents(Students);
  };

  const filterByButton = (status) => {
    setFilteredStudents(
      Students.filter(
        (student) =>
          student.studCategory &&
          student.studCategory.toLowerCase() === status.toLowerCase()
      )
    );
  };

  // Add this function to handle student updates
  const handleUpdateStudent = async (updatedData) => {
    try {
      // Add your API call here to update the student
      // After successful update, refresh the student list
      const { payload } = await dispatch(getAllocatedStudent());
      if (payload?.data) {
        setStudents(payload.data);
        setFilteredStudents(payload.data);
      }
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  // Define Table Columns using useMemo for performance optimization
  const columns = useMemo(
    () => [
      { name: "Student ID", selector: (row) => row.userName, sortable: true },
      { name: "First Name", selector: (row) => row.Fname, sortable: true },
      { name: "Last Name", selector: (row) => row.Lname, sortable: true },
      { name: "Student Type", selector: (row) => row.studCategory, sortable: true },
      { name: "Block Number", selector: (row) => row.blockNum, sortable: true },
      {
        name: "Dorm Number",
        selector: (row) => row.dormId,
        sortable: true,
      },
      {
        name: "Actions",
        cell: (row) => (
          <>
            <button
              onClick={() => {
                setSelectedStudent(row);
                setIsViewDialogOpen(true);
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
            >
              View
            </button>
            <button
              onClick={() => {
                setSelectedStudent(row);
                setIsEditDialogOpen(true);
              }}
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Edit
            </button>
          </>
        ),
      },
    ],
    [] // Removed unnecessary dependency
  );

  return (
    <>
      <div className="flex flex-col">
        {/* Header */}
       
        {/* Main Content */}
        <div className="flex-1 relative min-h-screen mt-32">
        <div
          className={` p-4 pt-0  md:w-full flex flex-wrap items-center justify-between transition-all duration-300 ml-2 gap-4 ${
            // isCollapsed ? "left-16 w-[calc(100%-5rem)]" : 
            "left-64 w-[calc(100%-17rem)]"
          }`}
        >
          {/* Back Button */}
          <button
            className="flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition duration-300 mr-4"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="mr-2 text-lg" /> Back
          </button>
          
          <div  />
          
          {/* Search Input */}
          <div className="relative flex items-center w-72 md:w-1/3 mr-4">
            <FaSearch className="absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search by Student ID"
              className="h-10 px-4 py-2 border border-gray-300 rounded-md w-full pl-10"
              value={searchQuery}
              onChange={filterByInput}
            />
          </div>
          
          
         <button
            onClick={() => setOpen(true)}
            className=" hidden h-10 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md   items-center justify-center min-w-[150px] md:w-auto"
          >
             
          </button> 
           
        </div>
        
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4"> Student List</h2>
            
            {/* Filter Buttons placed above the table */}
            <div className="flex justify-end space-x-2 mb-4">
              <button
                className={`${filterButtonText==="All"?"bg-blue-600":" bg-gray-600"} px-3 py-1 text-white rounded-md hover:opacity-50`}
                onClick={ 
                  () => { resetFilters()
                  setFilterButtonText("All")
                }
              }
              >
                All
              </button>
              <button
                className={`${filterButtonText==="Remedial"?"bg-blue-600":"bg-red-600"} px-3 py-1  text-white rounded-md hover:opacity-50 `}
                onClick={() => {filterByButton("Remedial")
                  setFilterButtonText("Remedial")
                }}
              >
                Remedial
              </button>
              <button
                className={`${filterButtonText==="Fresh"?"bg-blue-600":"bg-yellow-600"} px-3 py-1 text-white rounded-md hover:opacity-50`}
                onClick={() => {filterByButton("Fresh")
                  setFilterButtonText("Fresh")
                }}
              >
                Fresh
              </button>
              <button
                className={`${filterButtonText==="Senior"?"bg-blue-600":" bg-green-600"} px-3 py-1 text-white rounded-md hover:opacity-50`}
                onClick={() => {filterByButton("Senior")
                  setFilterButtonText("Senior")
                }}
              >
                Senior
              </button>
            </div>
            
            {loading ? (
              <div className="text-center text-gray-600">Loading Students...</div>
            ) : (
              <div className="overflow-x-auto">
                <DataTable
                  columns={columns}
                  data={filteredIncidents}
                  pagination
                  customStyles={customStyles}
                  highlightOnHover
                  striped
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold">Student ID:</p>
                <p>{selectedStudent.userName}</p>
              </div>
              <div>
                <p className="font-bold">Name:</p>
                <p>{`${selectedStudent.Fname} ${selectedStudent.Lname}`}</p>
              </div>
              <div>
                <p className="font-bold">Student Type:</p>
                <p>{selectedStudent.studCategory}</p>
              </div>
              <div>
                <p className="font-bold">Block Number:</p>
                <p>{selectedStudent.blockNum}</p>
              </div>
              <div>
                <p className="font-bold">Dorm Number:</p>
                <p>{selectedStudent.dormId}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const updatedData = {
                userName: formData.get('userName'),
                Fname: formData.get('Fname'),
                Lname: formData.get('Lname'),
                studCategory: formData.get('studCategory'),
                blockNum: formData.get('blockNum'),
                dormId: formData.get('dormId'),
              };
              handleUpdateStudent(updatedData);
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="userName" className="font-medium text-right">
                    Student ID:
                  </label>
                  <input
                    id="userName"
                    name="userName"
                    defaultValue={selectedStudent.userName}
                    className="border p-2 rounded col-span-2"
                    placeholder="Student ID"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="Fname" className="font-medium text-right">
                    First Name:
                  </label>
                  <input
                    id="Fname"
                    name="Fname"
                    defaultValue={selectedStudent.Fname}
                    className="border p-2 rounded col-span-2"
                    placeholder="First Name"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="Lname" className="font-medium text-right">
                    Last Name:
                  </label>
                  <input
                    id="Lname"
                    name="Lname"
                    defaultValue={selectedStudent.Lname}
                    className="border p-2 rounded col-span-2"
                    placeholder="Last Name"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="studCategory" className="font-medium text-right">
                    Student Type:
                  </label>
                  <input
                    id="studCategory"
                    name="studCategory"
                    defaultValue={selectedStudent.studCategory}
                    className="border p-2 rounded col-span-2"
                    placeholder="Student Type"
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
    </>
  );
};

export default StudentInfo; // Changed to match component name