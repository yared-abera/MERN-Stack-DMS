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

export default function ProctorControleComponent({ students }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // State to manage the UI selection of radio buttons
  const [attendance, setAttendance] = useState({});
  // State to manage the data to be submitted
  const [formData, setFormData] = useState([]);

  // Initialize attendance and formData when students prop changes
  useEffect(() => {
    console.log("Students prop received:", students);
    if (students && students.length > 0) {
      const initialAttendanceUI = {};
      const initialFormData = [];
      const proctorId = user?.id; // Use optional chaining just in case user is null

      students.forEach((student) => {
        const studentId = student._id; // Prefer _id
        const Block = student.blockNum;
        if (studentId && proctorId) {
          // Set default UI selection to "present"
          initialAttendanceUI[studentId] = "present";

          // Add entry to formData, default isPresent to true
          initialFormData.push({
            student: studentId,
            proctor: proctorId,
            block: Block,
            isPresent: true, // Default data state to true (present)
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

      // --- FIX: Update state with the initialized values ---
      setAttendance(initialAttendanceUI);
      setFormData(initialFormData);
      // --- END FIX ---

    } else if (students && students.length === 0) {
       // If students becomes empty, reset the states
       setAttendance({});
       setFormData([]);
    }
  }, [students, user]); // Added user to dependencies as proctorId comes from there

  const handleAttendanceChange = (studentId, status) => {
    // 1. Update the UI state for radio buttons
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [studentId]: status, // status is "present" or "absent"
    }));

    // 2. Update the formData state with the boolean isPresent value
    setFormData((prevFormData) => {
      const isPresentValue = status === "present"; // Convert "present"/"absent" to true/false
      return prevFormData.map((item) =>
        item.student === studentId
          ? { ...item, isPresent: isPresentValue } // Update the specific student's record
          : item
      );
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    // Filter formData to ONLY include absent students
    // The backend only needs to know who was NOT present.
    const finalAttendanceData = formData.filter(
      (item) => item.isPresent === false
    );

    console.log("Submitting Absent Students Data:", finalAttendanceData);

    // Dispatch the filtered list (only absent students) to the backend action
    // Only dispatch if there are actually absent students to report,
    // unless your backend requires an empty array submission if everyone is present.
    if (finalAttendanceData.length > 0) {
      dispatch(addAttendance(finalAttendanceData)).then((data) => {
        if (data?.payload?.success) {
          toast.success(`${data?.payload?.message || 'Attendance submitted successfully!'}`);
        } else {
           // Handle potential backend errors even if payload.success is false
           toast.error(`Failed to submit attendance: ${data?.payload?.message || 'An error occurred.'}`);
        }
         // Optional: Reset form or provide further feedback after submission attempt
      });
    } else {
      // Optional: Inform the user that everyone was present and nothing needs to be submitted
      toast.info(
        "All students are marked as present. No absence data submitted."
      );
       // If your backend requires an empty array when all are present, uncomment the next line:
       // dispatch(addAttendance([])); // Dispatch empty array if required
    }
 
  };

  return (
    <div>
      <Table>
        <TableCaption>
          Fill the attendance for assigned students. Default is Present.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Middle Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Block</TableHead>
            <TableHead>Dorm Number</TableHead>
            <TableHead className="text-center">Present</TableHead>
            <TableHead className="text-center">Absent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(!students || students.length === 0) && (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No students assigned or loading...
              </TableCell>
            </TableRow>
          )}
          {students && students.map((stud) => {
            const studentId = stud._id; // Use _id consistently
             // Ensure attendance state for this student is initialized before rendering
             // This is primarily handled by the useEffect, but a fallback check can be added
            const currentAttendanceStatus = attendance[studentId] || 'present'; // Default to 'present' for rendering if state is not yet set

            if (!studentId) {
                 console.warn("Student object missing ID, skipping row:", stud);
                 return null; // Skip rendering if no ID
            }

            return (
              <TableRow key={studentId}>
                <TableCell className="font-medium">{stud.userName}</TableCell>
                <TableCell>{stud.Fname || "N/A"}</TableCell>
                <TableCell>{stud.Mname || "N/A"}</TableCell>
                <TableCell>{stud.Lname || "N/A"}</TableCell>
                <TableCell>{stud.blockNum || "N/A"}</TableCell>
                <TableCell>{stud.dormId || "N/A"}</TableCell>
                <TableCell className="text-center">
                  <input
                    type="radio"
                    name={`attendance-${studentId}`} // Group radios per student
                    value="present"
                    // Checked based on the 'attendance' UI state
                    checked={currentAttendanceStatus === "present"}
                    onChange={() =>
                      handleAttendanceChange(studentId, "present")
                    }
                    aria-label={`Mark ${stud.Fname || "student"} present`}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <input
                    type="radio"
                    name={`attendance-${studentId}`} // Group radios per student
                    value="absent"
                    // Checked based on the 'attendance' UI state
                    checked={currentAttendanceStatus === "absent"}
                    onChange={() => handleAttendanceChange(studentId, "absent")}
                    aria-label={`Mark ${stud.Fname || "student"} absent`}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {students && students.length > 0 && ( // Only show submit button if there are students
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSubmit}>Submit Attendance</Button>
        </div>
      )}
    </div>
  );
}