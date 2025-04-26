import { SidebarTrigger } from "../ui/sidebar";
import { CalendarX, MessageCircle, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import DarkMode from "../common/darkMode";
import AvatarComponent from "../common/avatar";
import { useDispatch, useSelector } from "react-redux";
import { SearchedUsers } from "@/store/common/data";
import { getSingleUser } from "@/store/user-slice/userSlice";
import { Link } from "react-router-dom";
import ChatIcon from "../common/ChatIcon";

export default function Header() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const NowDate = new Date();
  const [error, setError] = useState("");
  const [time, setTime] = useState("");

  const [ThisUser, setThisUser] = useState('');
  const {user}=useSelector(state=>state.auth)

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

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleCalendar = () => setShowCalendar((prev) => !prev);
  
  const handleSearch = () => {
    if (searchValue !== "") {
      const regex = /^[a-zA-Z]/; // Regex to check if it starts with a letter
      
      if (regex.test(searchValue)) {
        setError("");
          dispatch(SearchedUsers(searchValue));
        
      } else {
        setError("Invalid Student Id");
      }
    }
  };

  

  return (
    <header className="sticky top-0 w-full overflow-auto px-4 py-6 z-10 border-b shadow-md dark:bg-black bg-white mb-2">
      <div className="flex items-center justify-between w-full">
        {/* Left Section: Sidebar */}
        <div className="flex items-center">
          <SidebarTrigger />
        </div>

        {/* Center Section: Search, Calendar, and Time */}
        <div className="flex items-center flex-grow mx-4 gap-4">
          {/* Desktop Search */}
          <div className="hidden md:flex flex-col gap-0.5 items-center relative w-1/3">
            <div className="flex items-center relative w-full">
              <Input
                type="text"
                placeholder="Search User by username"
                className="w-full pr-10"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />

              <Button
                className="absolute right-0.5 top-1/2 transform -translate-y-1/2 p-1"
                onClick={handleSearch}
                variant="outline"
              >
                <Search />
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          {/* Mobile Search */}

          <div className="flex flex-col gap-0.5 items-center relative w-1/3 md:hidden">
            <div className="flex items-center relative w-full">
              <Input
                type="text"
                placeholder="Search User by Id"
                className="w-full pr-10"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />

              <Button
                className="absolute right-0.5 top-1/2 transform -translate-y-1/2 p-1"
                onClick={handleSearch}
                variant="outline"
              >
                <Search />
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm ">{error}</p>}
          </div>

          {/* Calendar and Time */}
          <div className="flex items-center gap-4 w-1/3  justify-evenly">
            <div className="flex items-center">
              <Button
                onClick={toggleCalendar}
                className={
                  showCalendar ? "hidden" : "border-none cursor-pointer"
                }
              >
                <CalendarX />
              </Button>
              {showCalendar && (
                <div
                  onClick={toggleCalendar}
                  className="cursor-pointer ml-2 font-semibold"
                >
                  <h3>Date: {NowDate.toLocaleDateString()}</h3>
                </div>
              )}
            </div>
            <span className="font-sans text-lg font-bold">{time}</span>
          </div>

          <div>
            <ChatIcon userRole="admin" />
          </div>
        </div>

        {/* Right Section: Dark Mode & Avatar */}
        <div className="flex items-center justify-evenly gap-4">
          <DarkMode />
         {ThisUser&&ThisUser!==''&& <AvatarComponent ThisUser={ThisUser}/>}
        </div>
      </div>
    </header>
  );
}
