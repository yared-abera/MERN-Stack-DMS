import { useDispatch } from "react-redux";
import img from "../../assets/img/gibi.jpg";
import logo from "../../assets/img/University_logo.png";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { getAllBlock } from "@/store/blockSlice";
import StudentInfoChart from "@/components/studentDean/indexGraph";
import { getAllocatedStudent } from "@/store/studentAllocation/allocateSlice";

export default function StudentDeanHome() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getAllBlock());
    dispatch(getAllocatedStudent());
  }, [dispatch]);

  return (
    <div className="w-full min-h-screen flex flex-col mt-20">
      
      {/* Header with background image covering 30% of viewport height */}
      <div 
        className="w-full h-[50vh] flex justify-center mt-3"
        style={{
          backgroundImage: `url(${img})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div >
        <img src={logo} alt="University Logo" className="max-h-full z-20" />
        </div>
        
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-center">
          <h1 className="text-lg md:text-xl font-bold ">Student Information </h1>
            </div>
            <StudentInfoChart />
          </div>

          <div className="text-center w-full md:w-1/2 mx-auto">
            <h1 className="text-neutral-950 text-xl md:text-3xl font-bold">
              Recently Searched Student Info
            </h1>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Example Card */}
            <div className="flex flex-col justify-around bg-white dark:bg-gradient-to-tr from-orange-500 to-blue-700 p-4 text-black shadow-2xl rounded h-56">
              <p>First Name :</p>
              <p>Last Name :</p>
              <p>User Name :</p>
              <p>Email:</p>
              <p>Role :</p>
              <div className="flex items-center justify-between mt-4 gap-4">
                <Button className="w-full">Remove</Button>
                <Button className="w-full">View Detail</Button>
              </div>
            </div>

            {/* Duplicate cards */}
            <div className="flex flex-col justify-around bg-white dark:bg-gradient-to-tr from-green-500 to-blue-700 p-4 text-black shadow-2xl rounded h-56">
              <p>First Name :</p>
              <p>Last Name :</p>
              <p>User Name :</p>
              <p>Email:</p>
              <p>Role :</p>
              <div className="flex items-end justify-center mt-4">
                <Button className="w-full">Remove</Button>
              </div>
            </div>
            <div className="flex flex-col justify-around bg-white dark:bg-gradient-to-tr from-green-500 to-blue-700 p-4 text-black shadow-2xl rounded h-56">
              <p>First Name :</p>
              <p>Last Name :</p>
              <p>User Name :</p>
              <p>Email:</p>
              <p>Role :</p>
              <div className="flex items-end justify-center mt-4">
                <Button className="w-full">Remove</Button>
              </div>
            </div>
            <div className="flex flex-col justify-around bg-white dark:bg-gradient-to-tr from-green-500 to-blue-700 p-4 text-black shadow-2xl rounded h-56">
              <p>First Name :</p>
              <p>Last Name :</p>
              <p>User Name :</p>
              <p>Email:</p>
              <p>Role :</p>
              <div className="flex items-end justify-center mt-4">
                <Button className="w-full">Remove</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full bg-orange-500 text-center p-4">
        Footer
      </div>
    </div>
  );
}
