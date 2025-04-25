import { getStudentForProctor } from "@/store/studentAllocation/allocateSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addAttendance } from "@/store/attendance/attendance-Slice";

export default function ProctorAttendanceControleComponent({ students }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [attendance, setAttendance] = useState({}); // State for UI radio selection
  const [formData, setFormData] = useState([]); // State for data to be submitted

  // Initialize attendance and formData when students prop changes
  useEffect(() => {
    console.log("Students prop received:", students);
    if (students && students.length > 0) {
      const initialAttendanceUI = {};
      const initialFormData = [];
      const proctorId = user?.id;

      students.forEach((student) => {
        const studentId = student._id; // Use _id
        const Block = student.blockNum;
        if (studentId && proctorId) {
          initialAttendanceUI[studentId] = "present"; // Default UI selection

          initialFormData.push({ // Default data state
            student: studentId,
            proctor: proctorId,
            block: Block,
            isPresent: true,
          });
        } else {
          console.warn(
            "Student object or Proctor ID missing. Student:",
            student,
            "Proctor ID:",
            proctorId
          );
        }
      });

      setAttendance(initialAttendanceUI);
      setFormData(initialFormData);

    } else if (students && students.length === 0) {
        setAttendance({});
        setFormData([]);
    }
  }, [students, user]); // Added user to dependencies

  const handleAttendanceChange = (studentId, status) => {
    // Update UI state
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [studentId]: status,
    }));

    // Update formData state
    setFormData((prevFormData) => {
      const isPresentValue = status === "present";
      return prevFormData.map((item) =>
        item.student === studentId
          ? { ...item, isPresent: isPresentValue }
          : item
      );
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    // Filter for ONLY absent students
    const finalAttendanceData = formData.filter(
      (item) => item.isPresent === false
    );

    console.log("Submitting Absent Students Data:", finalAttendanceData);

    // Dispatch if there are absent students
    if (finalAttendanceData.length > 0) {
      dispatch(addAttendance(finalAttendanceData)).then((data) => {
        if (data?.payload?.success) {
          toast.success(`${data?.payload?.message || 'Attendance submitted successfully!'}`);
        } else {
           toast.error(`Failed to submit attendance: ${data?.payload?.message || 'An error occurred.'}`);
        }
      });
    } else {
      toast.info(
        "All students are marked as present. No absence data submitted."
      );
    }
  };

  return (
    // Added padding, background, and rounded corners to the main container
    <div className="p-4 md:p-6 bg-card rounded-lg shadow-lg max-w-screen-lg mx-auto my-4 md:my-8 border border-border/50"> {/* Adjusted padding/margin for mobile */}
      {/* Added styling to the Table component */}
      <Table className="w-full border-collapse border border-border rounded-md overflow-hidden">
        {/* Added margin top and text color to the Caption */}
        <TableCaption className="mt-4 md:mt-6 text-muted-foreground text-sm md:text-base"> {/* Adjusted margin/text size */}
          Fill the attendance for assigned students. Default is Present.
        </TableCaption>
        {/* Added styling to the TableHeader */}
        <TableHeader className="bg-muted/80">
          <TableRow>
            {/* ID (userName) - Always visible */}
            <TableHead className="px-4 py-3 text-left font-semibold text-muted-foreground">ID</TableHead>
            {/* First Name - Hidden on small, visible on medium+ */}
            <TableHead className="hidden md:table-cell px-4 py-3 text-left font-semibold text-muted-foreground">First Name</TableHead>
            {/* Middle Name - Hidden on small, visible on medium+ */}
            <TableHead className="hidden md:table-cell px-4 py-3 text-left font-semibold text-muted-foreground">Middle Name</TableHead>
            {/* Last Name - Hidden on small, visible on medium+ */}
            <TableHead className="hidden md:table-cell px-4 py-3 text-left font-semibold text-muted-foreground">Last Name</TableHead>
            {/* Block - Always visible */}
            <TableHead className="px-4 py-3 text-left font-semibold text-muted-foreground">Block</TableHead>
            {/* Dorm Number - Always visible */}
            <TableHead className="px-4 py-3 text-left font-semibold text-muted-foreground">Dorm Number</TableHead>
            {/* Present (Action) - Always visible, centered */}
            <TableHead className="px-4 py-3 text-center font-semibold text-muted-foreground">Present</TableHead>
            {/* Absent (Action) - Always visible, centered */}
            <TableHead className="px-4 py-3 text-center font-semibold text-muted-foreground">Absent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Styled the 'no students' row */}
          {(!students || students.length === 0) && (
            <TableRow>
              {/* Adjusted colspan for small screens (4 visible columns + 4 hidden = 8) */}
              <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                No students assigned or loading...
              </TableCell>
            </TableRow>
          )}
          {/* Styled the student rows and cells */}
          {students && students.map((stud) => {
            const studentId = stud._id;
            const currentAttendanceStatus = attendance[studentId] || 'present'; // Default for rendering

            if (!studentId) {
                console.warn("Student object missing ID, skipping row:", stud);
                return null;
            }

            return (
              // Added hover effect and subtle alternating row background
              <TableRow key={studentId} className="border-b border-border/70 hover:bg-muted/30 even:bg-muted/10">
                {/* ID (userName) Cell - Always visible */}
                <TableCell className="px-4 py-3 font-medium text-foreground">{stud.userName}</TableCell>
                {/* First Name Cell - Hidden on small, visible on medium+ */}
                <TableCell className="hidden md:table-cell px-4 py-3 text-muted-foreground">{stud.Fname || "N/A"}</TableCell>
                {/* Middle Name Cell - Hidden on small, visible on medium+ */}
                <TableCell className="hidden md:table-cell px-4 py-3 text-muted-foreground">{stud.Mname || "N/A"}</TableCell>
                {/* Last Name Cell - Hidden on small, visible on medium+ */}
                <TableCell className="hidden md:table-cell px-4 py-3 text-muted-foreground">{stud.Lname || "N/A"}</TableCell>
                {/* Block Cell - Always visible */}
                <TableCell className="px-4 py-3 text-muted-foreground">{stud.blockNum || "N/A"}</TableCell>
                {/* Dorm Number Cell - Always visible */}
                <TableCell className="px-4 py-3 text-muted-foreground">{stud.dormId || "N/A"}</TableCell>
                {/* Present (Action) Cell - Always visible, centered */}
                <TableCell className="px-4 py-3 text-center">
                  <input
                    type="radio"
                    name={`attendance-${studentId}`}
                    value="present"
                    checked={currentAttendanceStatus === "present"}
                    onChange={() => handleAttendanceChange(studentId, "present")}
                    aria-label={`Mark ${stud.Fname || "student"} present`}
                    className="form-radio h-4 w-4 text-primary border-border focus:ring-primary"
                  />
                </TableCell>
                {/* Absent (Action) Cell - Always visible, centered */}
                <TableCell className="px-4 py-3 text-center">
                  <input
                    type="radio"
                    name={`attendance-${studentId}`}
                    value="absent"
                    checked={currentAttendanceStatus === "absent"}
                    onChange={() => handleAttendanceChange(studentId, "absent")}
                    aria-label={`Mark ${stud.Fname || "student"} absent`}
                    className="form-radio h-4 w-4 text-red-500 border-border focus:ring-red-500"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {/* Styled the button container */}
      {students && students.length > 0 && (
        <div className="mt-4 md:mt-6 flex justify-end"> {/* Adjusted margin top */}
          <Button onClick={handleSubmit}>Submit Attendance</Button>
        </div>
      )}
    </div>
  );
}