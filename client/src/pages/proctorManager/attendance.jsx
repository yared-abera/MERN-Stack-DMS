import AttendanceCard from "@/components/proctor-manager/MAnagerAttendanceCard";
import { getAttendanceNotification } from "@/store/attendance/attendance-Slice";
import { getAllocatedStudent } from "@/store/studentAllocation/allocateSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ManagerAttendance() {
  const { absentStudent } = useSelector((state) => state.attendance);
  const { AllocatedStudent } = useSelector((state) => state.student);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [categoryAbsentStudent, setCategoryAbsentStudent] = useState([]);
  const [students, setStudents] = useState([]);
  const userGender = user.sex;
  useEffect(() => {
    dispatch(getAttendanceNotification()).then((data) => {
      console.log(data.payload, "from components");
    });
  }, [dispatch]);

  

  useEffect(() => {
    if (
      absentStudent &&
      absentStudent.success &&
      absentStudent.data.length > 0
    ) {
      const ThisGroup = absentStudent.data.filter(
        (stud) => stud.student.sex.toUpperCase() === userGender.toUpperCase()
      );

      setCategoryAbsentStudent(ThisGroup);
    }
  }, [absentStudent]);
  
  console.log(categoryAbsentStudent,'categoryAbsentStudent');
  
  return (
    <div className="w-full h-full overflow-hidden bg-sky-100/35 p-3 ">
      <AttendanceCard
        absentStudent={categoryAbsentStudent}
       
      />
    </div>
  );
}
