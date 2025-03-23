import img from "../../assets/img/University_logo.png";
import img2 from "../../assets/img/gibi.jpg";
import img3 from "../../assets/img/gibi4.jpg";
import img4 from "../../assets/img/gibi6.jpg";
import img5 from "../../assets/img/stud.jpg";
import img6 from "../../assets/img/graugate.jpg";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllocatedStudent } from "@/store/studentAllocation/allocateSlice";

export default function StudentHome() {
  const Images = [img2, img3, img4, img5, img6];
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const { AllocatedStudent, isLoading } = useSelector((state) => state.student);
  const dispatch = useDispatch();
  const [hasFetched, setHasFetched] = useState(false); // Track if fetched for current user
const[AllStudent,setAllStudent]=useState([])
  if (user && !hasFetched) {
    setHasFetched(true); // Mark as fetched for the current user
    dispatch(getAllocatedStudent()).then(data=>{
      if(data?.payload?.success){
        setAllStudent(data?.payload?.data)
      }
    }) 
  }
  // Automatic slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % Images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + Images.length) % Images.length);
  };

  if (isLoading) {
    return <div>please Wait ,Loading...</div>;
  }

  // Calculate ThisStudent inside the render function
  const ThisStudent = AllStudent?.find(
    (stud) => stud.userName === user?.username
  );

  return (
    <div className="mt-20 flex flex-col gap-3 w-full h-screen overflow-hidden">
      <div className="flex items-center justify-center flex-col z-10">
        <div>
          <img src={img} alt="campus Logo" />
        </div>
        <h2 className="font-semibold sm:text-lg md:text-xl text-white rounded-lg px-3 py-2 bg-slate-200 mt-3">
          Hey Student{" "}
          <span className="text-green-600">
            {ThisStudent ? `${ThisStudent.Fname} ${ThisStudent.Lname}` : null}
          </span>
        </h2>
      </div>
      <div className="absolute flex shadow-sky-500 shadow-xl rounded-lg border-solid w-[95%] m-1 md:ml-6 h-[80%]">
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
        <img
          src={Images[currentIndex]}
          alt="slideshow"
          className="w-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
}