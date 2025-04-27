import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, UserCircle, Menu, LucideHome, MessageCircle, CalendarX, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import DarkMode from "@/components/common/darkMode";
import AvatarComponent from "../common/avatar";
import { SidebarTrigger } from "../ui/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser } from "@/store/user-slice/userSlice";
import ChatIcon from "../common/ChatIcon";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  // Initial fetch
  const [ThisUser, setThisUser] = useState("");
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user?.id) {
      console.log("Fetching user data for ID (StudDean):", user.id);
      dispatch(getSingleUser(user.id)).then((data) => {
        console.log("User data response (StudDean):", data);
        if (data.payload?.success) {
          setThisUser(data.payload.user);
        }
      });
    } else {
      console.log("No user ID available (StudDean)");
    }
  }, [user]);

  // return (
  //   <header className="sticky top-0 w-full overflow-auto px-4 py-6 z-10 border-b shadow-md dark:bg-black bg-white mb-2">
  //     <div className="flex items-center justify-between w-full">
  //       {/* Left Section: Sidebar */}
  //       <div className="flex items-center">
  //         <SidebarTrigger />
  //       </div>

  //       {/* Center Section: Search, Calendar, and Time */}
  //       <div className="flex items-center flex-grow mx-4 gap-4">
  //         {/* ... existing code ... */}

  //         <div>
  //           <ChatIcon userRole="proctorManager" />
  //         </div>
  //       </div>

  //       {/* Right Section: Dark Mode & Avatar */}
  //       <div className="flex items-center justify-evenly gap-4">
  //         <DarkMode />
  //         {ThisUser && ThisUser !== '' ? <AvatarComponent ThisUser={ThisUser} /> : null}
  //       </div>
  //     </div>
  //   </header>
  // );

   return (
          <header className="sticky top-0 w-full overflow-hidden px-4 py-6 z-10 border-b shadow-md dark:bg-black bg-slate-50 mb-2">
            <div className="flex items-center  w-full  ">
              {/* Left Section: Sidebar */}
              <div className="flex items-center   ">
              <SidebarTrigger />
  
               
              </div>
  
              {/* Center Section: Search, Calendar, and Time */}
  
              <div className="flex justify-evenly w-full ">
  
              <div className="pt-2">
            <ChatIcon userRole="proctorManager" />
            </div>
  
              {/* Right Section: Dark Mode & Avatar */}
  
              <div>
              <DarkMode />
              </div>
             
  
              </div>
  
              <div className="flex items-center justify-evenly gap-4">
                
                {ThisUser && ThisUser !== '' ? <AvatarComponent ThisUser={ThisUser} /> : null}
              </div>
           
            </div>
          </header>
        );
}
