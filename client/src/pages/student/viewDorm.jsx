import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
 
import { getAllocatedStudent, getSingleStudent } from "@/store/studentAllocation/allocateSlice";

export default function ViewDorm() {
  const { user } = useSelector((state) => state.auth);
  const { AllocatedStudent } = useSelector((state) => state.student);

  const dispatch = useDispatch();

  const [ThisStudent, setThisStudent] = useState("");

  useEffect(() => {
    const id = user.id;

    dispatch(getAllocatedStudent())

    dispatch(getSingleStudent({ id })).then((data) => {
      if (data?.payload?.success) {
        setThisStudent(data?.payload?.data);
      }
    });
  },[dispatch]);

  let DormMate;
  if (AllocatedStudent.length > 0) {
    DormMate = AllocatedStudent.filter(
      (student) =>
        student.blockNum === ThisStudent.blockNum &&
        student.dormId === ThisStudent.dormId
    );
  }



  return (
    <div className="mt-28 mx-4 min-h-screen space-y-12">
      {/* ── Student Header ─────────────────────────────────────────── */}
      <div className="  bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Student:{" "}
          <span className="text-green-300">
            {ThisStudent
              ? `${ThisStudent.Fname} ${ThisStudent.Lname}`
              : "Loading..."}
          </span>
        </h2>
        <div className="flex justify-center space-x-12 text-lg">
          <div>
            <p className="uppercase text-sm font-medium opacity-80">Block</p>
            <p className="mt-1 text-2xl font-semibold">
              {ThisStudent?.blockNum ?? "—"}
            </p>
          </div>
          <div>
            <p className="uppercase text-sm font-medium opacity-80">Dorm</p>
            <p className="mt-1 text-2xl font-semibold">
              {ThisStudent?.dormId ?? "—"}
            </p>
          </div>
        </div>
      </div>
  
      {/* ── Dorm‑mates Grid ───────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-semibold mb-6">Dorm Mates</h1>
        {DormMate && DormMate.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DormMate.map((dorm) => (
              <div
                key={dorm.userName}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
              >
                <p className="text-lg font-medium">
                  {dorm.Fname} {dorm.Mname} {dorm.Lname}
                </p>
                <p className="mt-1 text-sm text-gray-500">@{dorm.userName}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No dorm mates found.</p>
        )}
      </div>
    </div>
  );
  
  
}
