import { SidebarTrigger } from "../ui/sidebar";
import { CalendarX, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import DarkMode from "../common/darkMode";
import AvatarComponent from "../common/avatar";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser } from "@/store/user-slice/userSlice";
import ChatIcon from "../common/ChatIcon";

export default function Header() {

  const [ThisUser, setThisUser] = useState('');
  const {user}=useSelector(state=>state.auth)

   // Initial fetch
   const dispatch=useDispatch()
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
          <ChatIcon userRole="proctor" />
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

