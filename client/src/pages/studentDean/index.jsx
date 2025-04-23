import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/img/University_logo.png"; // Using 'logo' consistently
import img2 from "../../assets/img/gibi.jpg";
import img3 from "../../assets/img/gibi4.jpg";
import img4 from "../../assets/img/gibi6.jpg";
import img5 from "../../assets/img/stud.jpg";
import img6 from "../../assets/img/graugate.jpg";
import { Badge, ChevronLeft, ChevronRight, User2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Mail, User, Calendar } from "lucide-react"; // or any icon lib you like

import { getAllBlock } from "@/store/blockSlice";
import StudentInfoChart from "@/components/studentDean/indexGraph";
import { getAllocatedStudent } from "@/store/studentAllocation/allocateSlice";
import {
  AddRecentlySearchedUser,
  getRecentlySearchedUser,
  SearchStudents,
} from "@/store/common/data";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import FooterPage from "@/components/common/FooterPage";

export default function StudentDeanHome() {
  const dispatch = useDispatch();
  const { searchStudent } = useSelector((state) => state.Data);
const{user}=useSelector((state)=>state.auth)
  const Images = [img2, img3, img4, img5, img6];
  const [currentIndex, setCurrentIndex] = useState(0);

  const [recentlySearchedUser, setRecentlySearchedUser] = useState("");
  const [recentUserFound, setRecentUserFound] = useState(false);
  const { AllRecentlySearchedUser } = useSelector((state) => state.Data);
  useEffect(() => {
    dispatch(getAllBlock());
    dispatch(getAllocatedStudent());
    const role = "Student";
    const id=user.id
    dispatch(getRecentlySearchedUser({role,id}));
  }, [dispatch]);

  // Automatic slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Images.length);
    }, 10000);

    return () => clearInterval(interval);
  });
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % Images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + Images.length) % Images.length);
  };
  useEffect(() => {
    if (searchStudent) {
      let foundStudent = "";

      // If there's any recently searched entry, try to find one matching the searchStudent value.
      if (AllRecentlySearchedUser.length > 0) {
        foundStudent = AddRecentlySearchedUser.find(
          (student) => student.userId.userName === searchStudent
        );
      }

      // If the student is found in the local state, set it and mark as found.
      if (foundStudent !== "") {
        console.log(foundStudent, "foundStudent on if");
        setRecentlySearchedUser(foundStudent);
        setRecentUserFound(true);
      } else {
        console.log(foundStudent, "foundStudent on else");
        // Otherwise, prepare to add the new search entry.
        const role = "Student";
        const userName = searchStudent;

        // Dispatch the action to add the recently searched user.
        const id=user.id
 
        dispatch(AddRecentlySearchedUser({ userName, role,id })).then((res) => {
          if (res.payload.success) {
            // Once added, dispatch to fetch the latest search history.
            setRecentlySearchedUser(res.payload.data);
            setRecentUserFound(true);
          
            dispatch(getRecentlySearchedUser({role,id}));
          } else {
            toast.error(res.payload.message);
          }
        });

        dispatch(SearchStudents(""));
      }
    }
  },[searchStudent]);
  function HandleRecentUserDialog() {
    setRecentUserFound(false);
    setRecentlySearchedUser("");
    dispatch(SearchStudents(""));
  }

  console.log(AllRecentlySearchedUser, "AllRecentlySearchedUser");
  return (
    <div className="w-full min-h-screen flex flex-col ">
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
          {AllRecentlySearchedUser?.success && AllRecentlySearchedUser.data.length>0 && (
            <div className="text-center w-full md:w-1/2 mx-auto">
              <h1 className="text-neutral-950 text-xl md:text-2xl font-bold text-muted-foreground font-mono">
                Recently Searched Student Info
              </h1>
            </div>
          )}

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 z-[-3px]">
            {AllRecentlySearchedUser&&AllRecentlySearchedUser?.success && AllRecentlySearchedUser.data.length>0 &&
              AllRecentlySearchedUser.data.map((student) => {
                const { Fname, Mname, Lname, userName, email } = student.userId;
                const fullName = `${Fname} ${Mname} ${Lname}`;

                return (
                  <div
                    key={student._id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-300"
                  >
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-semibold">
                        {Fname.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-white text-lg font-semibold leading-tight">
                          {fullName}
                        </h3>
                        <p className="text-indigo-200 text-sm">@{userName}</p>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{email}</span>
                      </div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {new Date(student.timestamp).toLocaleDateString()}{" "}
                          {new Date(student.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className="px-4 pb-4 flex gap-3">
                      <button
                        onClick={() => {
                          setRecentlySearchedUser(student);
                          setRecentUserFound(true);
                        }}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <div className="text-center">
              <h1 className="text-lg md:text-xl font-bold ">
                Student Information{" "}
              </h1>
            </div>

            <StudentInfoChart />
          </div>
        </div>
      </div>

      {recentlySearchedUser &&
        recentlySearchedUser != "" &&
        recentUserFound && (
          <Dialog
            open={recentUserFound}
            onOpenChange={() => HandleRecentUserDialog()}
          >
            <DialogContent className="sm:max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <DialogHeader className="flex items-center justify-between bg-gradient-to-br from-indigo-600 to-purple-600 p-4">
                <DialogTitle className="text-white text-lg font-semibold">
                  Recently Searched Student
                </DialogTitle>
              </DialogHeader>

              {/* Avatar & Name */}
              <div className="flex flex-col items-center -mt-8">
                <div
                  className="
    h-16 w-16 rounded-full
    bg-indigo-200 dark:bg-indigo-700
    flex items-center justify-center
    text-indigo-700 dark:text-indigo-200
    font-bold text-xl shadow-lg
  "
                >
                  {recentlySearchedUser.userId.Fname?.charAt(0) || "?"}
                </div>
                <h3 className="mt-3 text-xl font-medium text-gray-900 dark:text-gray-100">
                  {recentlySearchedUser.userId.Fname}{" "}
                  {recentlySearchedUser.userId.Mname}{" "}
                  {recentlySearchedUser.userId.Lname}
                </h3>
              </div>

              {/* Body */}
              <DialogDescription className="px-6 py-4 space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <User2 className="h-5 w-5" />
                  <span>
                    {recentlySearchedUser.userId.Fname}{" "}
                    {recentlySearchedUser.userId.Mname}{" "}
                    {recentlySearchedUser.userId.Lname}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>@{recentlySearchedUser.userId.userName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  <span>{recentlySearchedUser.userId.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="h-5 w-5" />
                  <span>{recentlySearchedUser.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>
                    {new Date(
                      recentlySearchedUser.timestamp
                    ).toLocaleDateString()}{" "}
                    {new Date(
                      recentlySearchedUser.timestamp
                    ).toLocaleTimeString()}
                  </span>
                </div>
              </DialogDescription>

              {/* Footer */}
              <DialogFooter className="px-6 pb-6 flex justify-end gap-3">
                <DialogClose asChild>
                  <button
                    className="
      px-4 py-2 bg-gray-200 dark:bg-gray-700
      text-gray-800 dark:text-gray-200
      rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600
      transition
    "
                    onClick={() => HandleRecentUserDialog()}
                  >
                    Close
                  </button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

      {/* Footer */}

      <FooterPage />
    </div>
  );
}
