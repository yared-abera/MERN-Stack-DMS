// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { useEffect, useState } from "react";
// import { CalendarX, LogOut, Search, UserCog } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";
// import { Avatar, AvatarFallback } from "../ui/avatar";
// import { useNavigate } from "react-router-dom";
// import { SidebarTrigger } from "../ui/sidebar";
// import AvatarComponent from "../common/avatar";

// export default function Header() {
//   const NowDate = new Date();
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);
//   const [time, setTime] = useState("");

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = new Date();
//       setTime(now.toLocaleTimeString());
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const toggleCalendar = () => {
//     setShowCalendar(!showCalendar);
//   };

//   const navigate = useNavigate();
  
//   function handleSearch() {
//     setShowSearch(!showSearch);
//   }

//   return (
//     <header className="sticky top-0 w-full z-10 h-auto py-3 border-b bg-background shadow-md">
//       <div className="flex items-center justify-between px-4">
//         {/* Left section with sidebar trigger */}
//         <div className="flex items-center">
//           <SidebarTrigger />
//         </div>

//         {/* Middle section with search and calendar */}
//         <div className="flex-1 flex items-center justify-center mx-4 max-w-2xl">
//           <div className="relative w-full flex items-center">
//             {/* Search button for mobile */}
           
            
//             {/* Search input - visible on desktop or when search is active on mobile */}
//             <div className={`${showSearch ? 'block' : 'hidden md:block'} w-full`}>
//               <Input
//                 type="text"
//                 placeholder="Search user by username"
//                 className="w-full transition-all duration-300 ease-in-out dark:text-white"
//               />
//                <Button 
//               className="md:hidden ml-[-50px]" 
//               size="sm" 
//               onClick={handleSearch}
//               variant="outline"
//             >
//               <Search className="h-4 w-4" />
//             </Button>
//             </div>
            
//             {/* Calendar toggle - only visible when search is not active on mobile */}
//             <div className={`${showSearch ? 'hidden' : 'flex'} items-center ml-2`}>
//               <Button
//                 className="border-none cursor-pointer"
//                 onClick={toggleCalendar}
//                 variant="ghost"
//                 size="sm"
//               >
//                 <CalendarX className="h-4 w-4" />
//               </Button>
//               {showCalendar && (
//                 <div
//                   className="bg-none cursor-pointer font-medium text-sm ml-2"
//                   onClick={toggleCalendar}
//                 >
//                   {NowDate.toLocaleDateString()}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Right section with time and avatar */}
//         <div className="flex items-center space-x-4">
//           <span className="font-medium text-sm hidden sm:block">
//             {time}
//           </span>
//           <AvatarComponent />
//         </div>
//       </div>
//     </header>
//   );
// }
 

import { SidebarTrigger } from "../ui/sidebar";
import { CalendarX, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import DarkMode from "../common/darkMode";
import AvatarComponent from "../common/avatar";
import { useDispatch } from "react-redux";
import { SearchedUsers } from "@/store/common/data";
 
export default function Header() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const NowDate = new Date();
  const [error, setError] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleCalendar = () => setShowCalendar((prev) => !prev);
  const dispatch = useDispatch();
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
        </div>

        {/* Right Section: Dark Mode & Avatar */}
        <div className="flex items-center justify-evenly gap-4">
          <DarkMode />
          <AvatarComponent />
        </div>
      </div>
    </header>
  );
}
