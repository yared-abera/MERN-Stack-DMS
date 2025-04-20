import { SidebarTrigger } from "../ui/sidebar";
import DarkMode from "@/components/common/darkMode";
import AvatarComponent from "@/components/common/avatar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser } from "@/store/user-slice/userSlice";
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
        <nav
          className={`fixed top-0 left-0 h-20 shadow-md flex items-center px-4 md:px-6 dark:bg-black bg-white justify-between transition-all duration-300 ${
            isSidebarOpen ? "w-[calc(100%-16rem)] md:left-64" : " left-16 md:w-[calc(100%-4rem)]"
          }`}
        >
          {/* Sidebar Trigger */}
          <div className="flex items-center">
            <SidebarTrigger onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          </div>
    
          <div className="flex items-center gap-4 ml-auto">
            <DarkMode />
            {ThisUser&&ThisUser!==''&& <AvatarComponent ThisUser={ThisUser}/>}
          </div>
        </nav>
      );
    }

