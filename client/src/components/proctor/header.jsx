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
      const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar default state
    
      return (
        <header className="sticky top-0 w-full overflow-auto px-4 py-6 z-10 border-b shadow-md dark:bg-black bg-white mb-2">
          <div className="flex items-center justify-between w-full">
            {/* Left Section: Sidebar */}
            <div className="flex items-center">
              <SidebarTrigger />
            </div>

            {/* Center Section: Search, Calendar, and Time */}
            <div className="flex items-center flex-grow mx-4 gap-4">
              <div>
                <ChatIcon userRole="proctor" />
              </div>
            </div>

            {/* Right Section: Dark Mode & Avatar */}
            <div className="flex items-center justify-evenly gap-4">
              <DarkMode />
              {ThisUser && ThisUser !== '' ? <AvatarComponent ThisUser={ThisUser} /> : null}
            </div>
          </div>
        </header>
      );
    }

