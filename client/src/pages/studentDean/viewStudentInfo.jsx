import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllocatedStudent,
  UpdateStudent,
  DeleteStudent,
  DeleteAllStudent,
} from "../../store/studentAllocation/allocateSlice";
import { FaArrowLeft, FaSearch, FaFilePdf, FaFileExcel, FaPrint } from "react-icons/fa";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ArrowBigDownDashIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { read, utils, writeFile } from 'xlsx';

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

const StudentInfo = () => {
  // Renamed from StudentInfo to IncidentList for clarity
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
  const [sexValue, setSexValue] = useState(selectedStudent?.sex || "");
  const [deleteUserConfirmation, setDeleteUserConfirmation] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [editData, setEditData] = useState({});
  const [filterButtonText, setFilterButtonText] = useState("All"); // Default filter button text
  const [deleteAllConfirmation, setDeleteAllConfirmation] = useState(false);
  const [deleteAllStudents, setDeleteAllStudents] = useState([]);

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
  function HandleDeleteStudent(row) {
    console.log("row", row);

    const{_id:id, blockNum, dormId, sex}=row;
    console.log(id, blockNum, dormId ,sex, "id, blockNum, dormId")
    dispatch(DeleteStudent({ id, blockNum, dormId, sex })).then((res) => {
      if (res.payload.success) {
        setDeleteStudentId(null)
        setDeleteUserConfirmation(false);
        toast.success(res.payload.message);
        dispatch(getAllocatedStudent()).then((res) => {
          if (res.payload) {
            setStudents(res.payload.data);
            setFilteredStudents(res.payload.data);
          }
        });
      } else {
        toast.error(`${res.payload.message}`);
      }

   
    });
  
  
  }

  // Add this function to handle student updates
  const handleUpdateStudent = async (updatedData) => {
    try {
      dispatch(
        UpdateStudent({ id: updatedData._id, formData: updatedData })
      ).then((res) => {
        if (res.payload.success) {
          toast.success(res.payload.message);
          dispatch(getAllocatedStudent()).then((res) => {
            if (res.payload) {
              setStudents(res.payload.data);
              setFilteredStudents(res.payload.data);
            }
          });
        } else {
          toast.error(`${res.payload.message}`);
        }
      });

      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const downloadStudentInfo = (students) => {
    try {
      // If single student is passed, convert to array
      const studentsArray = Array.isArray(students) ? students : [students];
      
      const doc = new jsPDF();
      let yOffset = 15;
      
      // Add title with university logo or name
      doc.setFontSize(16);
      doc.text("Student Information Details", 14, yOffset);
      
      // Add timestamp
      doc.setFontSize(10);
      yOffset += 10;
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, yOffset);
      yOffset += 10;

      studentsArray.forEach((student, index) => {
        if (index > 0) {
          // Add a page break for each new student except the first one
          doc.addPage();
          yOffset = 15;
          
          // Add header for new page
          doc.setFontSize(16);
          doc.text("Student Information Details", 14, yOffset);
          yOffset += 10;
          
          doc.setFontSize(10);
          doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, yOffset);
          yOffset += 10;
        }

        // Student header
        doc.setFontSize(14);
        doc.text(`Student #${index + 1}: ${student.userName}`, 14, yOffset);
        yOffset += 10;

        // Define the columns for each table
        const personalInfoColumns = [
          { header: 'Field', dataKey: 'field' },
          { header: 'Value', dataKey: 'value' }
        ];

        // Prepare the data for each table
        const personalInfoData = [
          { field: 'Student ID', value: student.userName || 'N/A' },
          { field: 'First Name', value: student.Fname || 'N/A' },
          { field: 'Middle Name', value: student.Mname || 'N/A' },
          { field: 'Last Name', value: student.Lname || 'N/A' },
          { field: 'Email', value: student.email || 'N/A' },
          { field: 'Phone', value: student.phoneNum || 'N/A' },
          { field: 'Gender', value: student.sex || 'N/A' },
          { field: 'Batch', value: student.batch || 'N/A' },
          { field: 'College', value: student.collage || 'N/A' },
          { field: 'Department', value: student.department || 'N/A' },
          { field: 'Stream', value: student.stream || 'N/A' },
          { field: 'Student Type', value: student.studCategory || 'N/A' }
        ];

        const accommodationInfoData = [
          { field: 'Block Number', value: student.blockNum || 'N/A' },
          { field: 'Dorm Number', value: student.dormId || 'N/A' },
          { field: 'Address', value: student.address || 'N/A' },
          { field: 'Disability Status', value: student.disabilityStatus || 'N/A' },
          { field: 'Special Needs', value: student.isSpecial || 'N/A' }
        ];

        const systemInfoData = [
          { field: 'Role', value: student.role || 'N/A' },
          { field: 'Created At', value: new Date(student.createdAt).toLocaleString() },
          { field: 'Updated At', value: new Date(student.updatedAt).toLocaleString() }
        ];

        // Generate tables
        doc.setFontSize(12);
        doc.text("Personal Information", 14, yOffset);
        
        autoTable(doc, {
          startY: yOffset + 5,
          head: [personalInfoColumns.map(col => col.header)],
          body: personalInfoData.map(row => [row.field, row.value]),
          theme: 'striped',
          headStyles: { fillColor: [66, 139, 202] },
          styles: { fontSize: 10 },
        });

        yOffset = doc.lastAutoTable.finalY + 10;
        doc.text("Accommodation Information", 14, yOffset);
        
        autoTable(doc, {
          startY: yOffset + 5,
          head: [personalInfoColumns.map(col => col.header)],
          body: accommodationInfoData.map(row => [row.field, row.value]),
          theme: 'striped',
          headStyles: { fillColor: [66, 139, 202] },
          styles: { fontSize: 10 },
        });

        yOffset = doc.lastAutoTable.finalY + 10;
        doc.text("System Information", 14, yOffset);
        
        autoTable(doc, {
          startY: yOffset + 5,
          head: [personalInfoColumns.map(col => col.header)],
          body: systemInfoData.map(row => [row.field, row.value]),
          theme: 'striped',
          headStyles: { fillColor: [66, 139, 202] },
          styles: { fontSize: 10 },
        });
      });

      // Save the PDF
      doc.save(`all_students_info_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF. Please try again.');
    }
  };

  const generateExcel = (students) => {
    try {
      // If single student is passed, convert to array
      const studentsArray = Array.isArray(students) ? students : [students];
      
      // Prepare the data in a complete format
      const data = studentsArray.map(student => ({
        'Student ID': student.userName || 'N/A',
        'First Name': student.Fname || 'N/A',
        'Middle Name': student.Mname || 'N/A',
        'Last Name': student.Lname || 'N/A',
        'Email': student.email || 'N/A',
        'Phone': student.phoneNum || 'N/A',
        'Gender': student.sex || 'N/A',
        'Batch': student.batch || 'N/A',
        'College': student.collage || 'N/A',
        'Department': student.department || 'N/A',
        'Stream': student.stream || 'N/A',
        'Student Type': student.studCategory || 'N/A',
        'Block Number': student.blockNum || 'N/A',
        'Dorm Number': student.dormId || 'N/A',
        'Address': student.address || 'N/A',
        'Disability Status': student.disabilityStatus ? 'Yes' : 'No',
        'Special Needs': student.isSpecial ? 'Yes' : 'No',
        'Role': student.role || 'N/A',
        'Created At': new Date(student.createdAt).toLocaleString(),
        'Updated At': new Date(student.updatedAt).toLocaleString()
      }));

      // Create worksheet from data
      const ws = utils.json_to_sheet(data);

      // Set column widths
      const colWidths = [
        { wch: 15 },  // Student ID
        { wch: 15 },  // First Name
        { wch: 15 },  // Middle Name
        { wch: 15 },  // Last Name
        { wch: 25 },  // Email
        { wch: 15 },  // Phone
        { wch: 10 },  // Gender
        { wch: 10 },  // Batch
        { wch: 20 },  // College
        { wch: 20 },  // Department
        { wch: 15 },  // Stream
        { wch: 15 },  // Student Type
        { wch: 10 },  // Block Number
        { wch: 10 },  // Dorm Number
        { wch: 30 },  // Address
        { wch: 15 },  // Disability Status
        { wch: 15 },  // Special Needs
        { wch: 10 },  // Role
        { wch: 20 },  // Created At
        { wch: 20 }   // Updated At
      ];
      ws['!cols'] = colWidths;

      // Add some style to the header row
      const headerRange = utils.decode_range(ws['!ref']);
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const address = utils.encode_cell({ r: 0, c: C });
        if (!ws[address]) continue;
        ws[address].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "CCE5FF" } }
        };
      }

      // Create workbook and append worksheet
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Student Information');

      // Generate file name with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `student_information_${timestamp}.xlsx`;
      
      // Write file
      writeFile(wb, fileName);
      toast.success('Student information exported successfully!');
    } catch (error) {
      console.error('Excel generation error:', error);
      toast.error(`Failed to generate Excel file: ${error.message}`);
    }
  };

  // Define Table Columns using useMemo for performance optimization
  const columns = useMemo(
    () => [
      { name: "Student ID", selector: (row) => row.userName, sortable: true },
      { name: "First Name", selector: (row) => row.Fname, sortable: true },
      { name: "Last Name", selector: (row) => row.Lname, sortable: true },
      { name: "Status", selector: (row) => row.status, sortable: true },
      {
        name: "Student Type",
        selector: (row) => row.studCategory,
        sortable: true,
      },
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <ArrowBigDownDashIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStudent(row);
                    setIsViewDialogOpen(true);
                  }}
                >
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStudent(row);
                    setEditData(row);
                    setSexValue(row.sex);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => downloadStudentInfo(row)}
                  className="text-blue-600"
                >
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                     
                    setDeleteUserConfirmation(true);
                    setDeleteStudentId(row);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ),
      },
    ],
    []
  );
  function handleDeleteAll(filteredIncidents) {
    console.log("filteredIncidents on delete all", filteredIncidents);
    dispatch(DeleteAllStudent(filteredIncidents)).then((res) => {
      if (res.payload.success) {
        console.log("res.payload on delete all", res.payload.data);

        if (res.payload.data.deletedStudents.length > 0) {
          toast.success(
            res.payload.data.deletedStudents.length +
              " students deleted successfully"
          );
        }
        if (res.payload.data.failedStudents.length > 0) {
          toast.error(
            res.payload.data.failedStudents.length +
              " students failed to delete"
          );
        }
        dispatch(getAllocatedStudent()).then((res) => {
          if (res.payload.success) {
            setStudents(res.payload.data);
            setFilteredStudents(res.payload.data);
          }
        });
      } else {
        toast.error(res.payload.message);
      }
    });
  }

  useEffect(() => {
    if (selectedStudent) {
      setSexValue(selectedStudent.sex);
      setEditData({
        Fname: selectedStudent.Fname,
        Mname: selectedStudent.Mname,
        Lname: selectedStudent.Lname,
        sex: selectedStudent.sex,
        studCategory: selectedStudent.studCategory,
        blockNum: selectedStudent.blockNum,
        dormId: selectedStudent.dormId,
      });
    }
  }, [selectedStudent]);

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
console.log(selectedStudent, "selectedStudent");
  return (
    <>
      <div className="flex flex-col mt-2">
        {/* Header */}

        {/* Main Content */}
        <div className="flex-1 relative min-h-screen">
          <div className=
           "p-4 pt-0 md:w-[90%] flex flex-wrap items-center justify-between transition-all duration-300 ml-2 gap-4 left-64 w-[calc(100%-17rem)]"
          >
            {/* Back Button */}
            <button
              className="flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition duration-300 mr-4"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft className="mr-2 text-lg" /> Back
            </button>

            <div />

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
            ></button>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Student List
              </h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  onClick={() => downloadStudentInfo(filteredIncidents)}
                >
                  <FaFilePdf className="h-4 w-4" />
                  Download All PDF
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2 text-green-600 hover:text-green-700"
                  onClick={() => generateExcel(filteredIncidents)}
                >
                  <FaFileExcel className="h-4 w-4" />
                  Download All Excel
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
                  onClick={() => window.print()}
                >
                  <FaPrint className="h-4 w-4" />
                  Print All
                </Button>
              </div>
            </div>

            {/* Filter Buttons placed above the table */}
            <div className="flex justify-end space-x-2 mb-4 w-[95%]">
              <button
                className={`${
                  filterButtonText === "All" ? "bg-blue-600" : " bg-gray-600"
                } px-3 py-1 text-white rounded-md hover:opacity-50`}
                onClick={() => {
                  resetFilters();
                  setFilterButtonText("All");
                }}
              >
                All
              </button>
              <button
                className={`${
                  filterButtonText === "Remedial" ? "bg-blue-600" : "bg-red-600"
                } px-3 py-1  text-white rounded-md hover:opacity-50 `}
                onClick={() => {
                  filterByButton("Remedial");
                  setFilterButtonText("Remedial");
                }}
              >
                Remedial
              </button>
              <button
                className={`${
                  filterButtonText === "Fresh" ? "bg-blue-600" : "bg-yellow-600"
                } px-3 py-1 text-white rounded-md hover:opacity-50`}
                onClick={() => {
                  filterByButton("Fresh");
                  setFilterButtonText("Fresh");
                }}
              >
                Fresh
              </button>
              <button
                className={`${
                  filterButtonText === "Senior"
                    ? "bg-blue-600"
                    : " bg-green-600"
                } px-3 py-1 text-white rounded-md hover:opacity-50`}
                onClick={() => {
                  filterByButton("Senior");
                  setFilterButtonText("Senior");
                }}
              >
                Senior
              </button>
            </div>

            {loading ? (
              <div className="text-center text-gray-600">
                Loading Students...
              </div>
            ) : (
              <div  >
                <DataTable className="max-w-4xl flex mx-auto"
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
        <DialogContent className="max-w-3xl rounded-lg h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex justify-between items-center">
              <span>Student Details</span>
              {selectedStudent && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    onClick={() => downloadStudentInfo(selectedStudent)}
                  >
                    <FaFilePdf className="h-4 w-4" />
                    PDF
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2 text-green-600 hover:text-green-700"
                    onClick={() => generateExcel([selectedStudent])}
                  >
                    <FaFileExcel className="h-4 w-4" />
                    Excel
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
                    onClick={() => window.print()}
                  >
                    <FaPrint className="h-4 w-4" />
                    Print
                  </Button>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedStudent && (
            <dl className="mt-4 border-t border-gray-200 divide-y divide-gray-200">
              {/* Student ID */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">
                  Student ID
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {selectedStudent.userName}
                </dd>
              </div>

              {/* Full Name */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {`${selectedStudent.Fname} ${selectedStudent.Mname} ${selectedStudent.Lname}`}
                </dd>
              </div>

              {/* Email */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {selectedStudent.email}
                </dd>
              </div>

              {/* Phone Number */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {selectedStudent.phoneNum}
                </dd>
              </div>

              {/* Batch */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">Batch</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {selectedStudent.batch}
                </dd>
              </div>

              {/* College */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">College</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {selectedStudent.collage}
                </dd>
              </div>

              {/* Department */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">
                  Department
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {selectedStudent.department}
                </dd>
              </div>

              {/* Stream */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">Stream</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {selectedStudent.stream}
                </dd>
              </div>

              {/* Student Type */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">
                  Student Type
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {selectedStudent.studCategory}
                </dd>
              </div>

              {/* Block Number */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">Block #</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {selectedStudent.blockNum}
                </dd>
              </div>

              {/* Dorm Number */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">Dorm #</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {selectedStudent.dormId}
                </dd>
              </div>

              {/* Address (full width) */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">Country</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {selectedStudent.address.country}
                </dd>
              </div>

              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">City</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {selectedStudent.address.city}
                </dd>
              </div>

              {/* Disability Status */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">
                  Disability Status
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {selectedStudent.disabilityStatus}
                </dd>
              </div>

              {/* Special Needs */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">
                  Special Needs
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {selectedStudent.isSpecial}
                </dd>
              </div>

              {/* Sex */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">Sex</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {selectedStudent.sex}
                </dd>
              </div>

              {/* Role */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {selectedStudent.role}
                </dd>
              </div>

              {/* Created At */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">
                  Created At
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {new Date(selectedStudent.createdAt).toLocaleString()}
                </dd>
              </div>

              {/* Updated At */}
              <div className="py-2 grid grid-cols-1 sm:grid-cols-2">
                <dt className="text-sm font-medium text-gray-500">
                  Updated At
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:pl-4">
                  {new Date(selectedStudent.updatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
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
                    defaultValue={selectedStudent.Fname}
                    onChange={(e) =>
                      setEditData({ ...editData, Fname: e.target.value })
                    }
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
                    defaultValue={selectedStudent.Mname}
                    onChange={(e) =>
                      setEditData({ ...editData, Mname: e.target.value })
                    }
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
                    defaultValue={selectedStudent.Lname}
                    onChange={(e) =>
                      setEditData({ ...editData, Lname: e.target.value })
                    }
                    className="border p-2 rounded col-span-2"
                    placeholder="Last Name"
                  />
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="sex" className="font-medium text-right">
                    Gender:
                  </label>
                  <Select
                    value={selectedStudent.sex}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,

                        sex: value,
                      });
                    }}
                  >
                    <SelectTrigger placeholder="Select gender" />
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
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
      {deleteUserConfirmation && deleteStudentId && (
        <AlertDialog
          open={deleteUserConfirmation}
          onOpenChange={() => setDeleteUserConfirmation(false)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Are you sure you want to delete student with ID{" "}
              {deleteStudentId.userName}?
            </AlertDialogDescription>
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteUserConfirmation(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  HandleDeleteStudent(
                    deleteStudentId
                  )
                }
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {deleteAllConfirmation && filteredIncidents.length > 0 && (
        <AlertDialog
          open={deleteAllConfirmation}
          onOpenChange={() => setDeleteAllConfirmation(false)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete all {filterButtonText} students?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              This action will delete all {filterButtonText} students from the
              system.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteAllConfirmation(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteAll(filteredIncidents)}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="flex justify-end m-3">
        <Button
          variant="destructive"
          disabled={filteredIncidents.length === 0}
          onClick={() => setDeleteAllConfirmation(true)}
        >
          Delete {filterButtonText}
        </Button>
      </div>
    </>
  );
};

export default StudentInfo; // Changed to match component name
