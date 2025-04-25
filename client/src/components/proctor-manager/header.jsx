import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, UserCircle, Menu, LucideHome, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import DarkMode from "@/components/common/darkMode";
import AvatarComponent from "../common/avatar";
import { SidebarTrigger } from "../ui/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser } from "@/store/user-slice/userSlice";
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

  return (
    <header className="w-full bg-white  dark:bg-gray-900 shadow-md px-3 py-5 flex justify-between items-center">
      {/* Logo & Name */}
      <div className="flex gap-3 items-center    w-1/3">
        <SidebarTrigger size="icon" className="p-4" />
        <div className="flex mx-auto">
        <div>
            <Link to={'/proctor-manager/chat'}>
            <MessageCircle/>
            </Link>
            
          </div>
        </div>
       
      </div>

      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={24} />
        </button>
        {/* <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Proctor Manager
        </h1> */}
      </div>

      {/* Navigation Links */}

      {/* Right Section: Dark Mode & Profile */}
      <div className="flex items-center gap-4">
        {/* dark mode component */}
        <DarkMode />

        {/* User Profile Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            {ThisUser && ThisUser !== "" && (
              <AvatarComponent ThisUser={ThisUser} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
