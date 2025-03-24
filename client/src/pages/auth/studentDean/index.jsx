import { useDispatch } from "react-redux";
import logo from "../../assets/img/University_logo.png"; // Using 'logo' consistently
import img2 from "../../assets/img/gibi.jpg";
import img3 from "../../assets/img/gibi4.jpg";
import img4 from "../../assets/img/gibi6.jpg";
import img5 from "../../assets/img/stud.jpg";
import img6 from "../../assets/img/graugate.jpg";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { getAllBlock } from "@/store/blockSlice";
import StudentInfoChart from "@/components/studentDean/indexGraph";
import { getAllocatedStudent } from "@/store/studentAllocation/allocateSlice";

export default function StudentDeanHome() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBlock());
    dispatch(getAllocatedStudent());
  }, [dispatch]);

  const Images = [img2, img3, img4, img5, img6];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatic slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Images.length);
    }, 10000);

    return () => clearInterval(interval);
  },);
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % Images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + Images.length) % Images.length);
  };

  return (
    <div className="w-full min-h-screen flex flex-col mt-20">
      {/* Header with background image covering 30% of viewport height */}
      <div
        className="w-full h-[60vh] flex justify-center mt-3"
        style={{
          backgroundImage: `url(${Images[currentIndex]})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/75 p-2 rounded-full hover:bg-white/50"
        >
          <ChevronLeft className="w-5 h-5 md:w-8 md:h-8" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/75 p-2 rounded-full hover:bg-white/50"
        >
          <ChevronRight className="w-5 h-5 md:w-8 md:h-8" />
        </button>
        <div>
          <img src={logo} alt="University Logo" className="max-h-full z-20" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          
          <div className="bg-white p-4 rounded shadow">
            <div className="text-center">
              <h1 className="text-lg md:text-xl font-bold ">
                Student Information{" "}
              </h1>
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
      <div className="w-full bg-orange-500 text-center p-4">Footer</div>
    </div>
  );
}