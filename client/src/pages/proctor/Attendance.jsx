 
 

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
 
import AbsentStudentOnProctor from "@/components/proctor/viewAbsentStudents";
import { useDispatch, useSelector } from "react-redux";
import { getStudentForProctor } from "@/store/studentAllocation/allocateSlice";
import ProctorAttendanceControleComponent from "../../components/proctor/attendanceControl";

export default function ProctorAttendance() {
  const { user } = useSelector((state) => state.auth);
  const [students, setStudents] = useState([]);
 
  const [absentStudents, setAbsentStudents] = useState([]); 
  const dispatch = useDispatch();

  // Effect 1: Fetch students when the component mounts or user changes
  useEffect(() => {
    const proctorId = user?.id;
    if (proctorId) {
      dispatch(getStudentForProctor(proctorId)).then((action) => {
        const { payload } = action;
        if (payload?.success && Array.isArray(payload?.data)) {
          const fetchedStudents = payload.data;
          setStudents(fetchedStudents);
       
        }
      });
    }
    // Add user?.id to dependencies to refetch if the user changes
  }, [dispatch, user?.id]);

  // Effect 2: Filter absent students whenever the 'students' state changes
  useEffect(() => {
    // Only filter if students array is populated
    if (students.length > 0) {
      // Add a check if absenceDates exists before checking length
      const filteredAbsentStudents = students.filter(
        (stud) => stud.absenceDates && stud.absenceDates.length > 0
      );
      setAbsentStudents(filteredAbsentStudents);
    } else {
        // Optional: clear absent students if the students array becomes empty
        setAbsentStudents([]);
    }
  }, [students]); // This effect runs *after* students state is updated and component re-renders

  
  // State to control which view is active
  const [selectedOption, setSelectedOption] = useState("takeAttendance"); // Default view

  return (
    <div className="">
      {" "}
      {/* Outer container */}
      <div className="flex w-full justify-end gap-3  p-4">
        <Button onClick={() => setSelectedOption("viewAbsentStudent")}>
          View Absent Students
        </Button>
        <Button onClick={() => setSelectedOption("takeAttendance")}>
          Take Attendance
        </Button>
      </div>
      {/* Conditional Rendering Area based on selectedOption */}
      <div className="mt-4 p-4">
        {" "}
        {/* Add margin/padding as needed */}
        {selectedOption === "takeAttendance" && (
          // Render your attendance taking component here
          <ProctorAttendanceControleComponent students={students} />
        )}
        {selectedOption === "viewAbsentStudent" && (
          
          <AbsentStudentOnProctor absentStudent={absentStudents} />
        )}
      </div>
    </div>
  );
}