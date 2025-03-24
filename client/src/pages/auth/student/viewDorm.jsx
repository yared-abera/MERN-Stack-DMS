import { useRef } from "react";
import { useSelector } from "react-redux";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ViewDorm() {
  const { user } = useSelector((state) => state.auth);
  const { AllocatedStudent } = useSelector((state) => state.student);

  const ThisStudent = AllocatedStudent.find(
    (stud) => stud.userName === user.username
  );
  const DormMate = AllocatedStudent.filter(
    (student) =>
      student.blockNum === ThisStudent.blockNum &&
      student.dormId === ThisStudent.dormId
  );
  const refElemnt = useRef();

  const { scrollYProgress } = useScroll({
    target: refElemnt,
    offset: ["start 20px", "start 0px"], // Animation starts when top of element reaches 20px, ends at 0px
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.5]); // Scale from 1 to 0.5
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]); // Opacity from 1 to 0.5

  return (
    <motion.div
      ref={refElemnt}
      style={{
        scaleY: scale, // Apply scale to the Y-axis
        opacity: opacity,
        originY: 0, // Set the origin for scaling to the top
      }}
      className="mt-20 overflow-hidden flex flex-col w-full min-h-screen m-4 shadow-md shadow-sky-500 border-solid"
    >
      <div className="w-full h-[40%]   flex flex-col text-center   ">
        <h2 className="sm:text-xl md:text-2xl m-4">
          {" "}
          Student:{" "}
          <span className="text-green-600">
          {ThisStudent ? `${ThisStudent.Fname} ${ThisStudent.Lname}` :null}
          </span>
        </h2>
        <p>
          <span className="text-lg font-bold text-blue-600">Block</span>:
          {ThisStudent?ThisStudent.blockNum:"please Refreash it"}
        </p>
        <p>
          <span className="text-lg font-bold text-blue-600">Dorm</span>:
          {ThisStudent?ThisStudent.dormId:"please Refreash it"}
        </p>
      </div>
      <div>
        <h1 className="text-xl font-semibold   ml-4 ">Dorm mates</h1>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 m-4 ">
          {DormMate && DormMate.length > 0 ? (
            DormMate.map((dorm) => (
              <div
                key={dorm.userName}
                className="w-[300px] bg-zinc-600/5 rounded-md border-solid border-2 px-7 py-3"
              >
                <p>First Name :{dorm.Fname}</p>
                <p>Middle Name :{dorm.Mname}</p>
                <p>Last Name :{dorm.Lname}</p>
                <p>User Name : {dorm.userName}</p>
              </div>
            ))
          ) : (
            <p>No Dorm Mate is Found </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}