import { SidebarTrigger } from "../ui/sidebar";

import { LogOut, Search, UserCog } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import DarkMode from "../common/darkMode";
import AvatarComponent from "../common/avatar";

export default function Header() {
  const [showSearch, setShowSearch] = useState();
  function handleSearch() {
    setShowSearch(!showSearch);
  }
  const [time, setTime] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <header className="overflow-hidden sticky w-full h-20 top-0   md:p-4   border-solid shadow-md  flex gap-4  dark:bg-black bg-white ">
      <div className="flex text-left ">
        <SidebarTrigger />
      </div>
      <div className="flex-1 flex gap-3 ">
        <div className="flex   gap-2 w-1/4">
          <Button>
             
            <span className=" hidden md:inline-flex ">Search</span>{" "}
            <Search className="inline-flex md:hidden " size="sm" />
          </Button>

          <Input
            type="text"
            placeholder="Search user by Using User Name"
            className="hidden md:inline-flex  dark:text-white  text-sm md:text-base"
          />
        </div>
        <div className="flex w-1/2  gap-6">
          {showSearch ? (
            <Input
              type="text"
              placeholder="Search user "
              className="md:hidden transition-all duration-300 ease-in-out dark:text-white w-[120px]"
            />
          ) : (
            <div className="flex pl-2 w-[85%] justify-around gap-1   ">
              <DarkMode />

              <div>
                <span className="font-sans md:text-lg md:font-bold sm:text-sm sm:font-semibold">
                  {time}
                </span>
              </div>
            </div>
          )}

          <div className="ml-4 sm:ml-8 ">
            <AvatarComponent />
          </div>
        </div>
      </div>
    </header>
  );
}

// import { SidebarTrigger } from "../ui/sidebar";
// import { AvatarComponent } from "../common/avatar";
// import { LogOut, Search, UserCog } from "lucide-react";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { useEffect, useState } from "react";
// import DarkMode from "../common/darkMode";

// export default function Header() {
//   const [showSearch, setShowSearch] = useState(false);
//   const [time, setTime] = useState("");

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTime(new Date().toLocaleTimeString());
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <header className="fixed top-0 w-full h-20 flex items-center px-4 border-b shadow-sm dark:bg-black bg-white z-50">
//       <div className="flex items-center gap-4 w-full">
//         <SidebarTrigger />

//         {/* Search Container */}
//         <div className="flex-1 flex items-center gap-2">
//           <div className="relative flex-1 flex items-center gap-2">
//             {/* Combined Search Input */}
//             <Input
//               type="text"
//               placeholder="Search user..."
//               className={`transition-all duration-300 ${
//                 showSearch ? "w-full" : "w-0 md:w-full"
//               } text-sm md:text-base`}
//               onBlur={() => setShowSearch(false)}
//             />
            
//             {/* Adaptive Search Button */}
//             <Button
//               variant="outline"
//               className="md:hidden shrink-0"
//               size="sm"
//               onClick={() => setShowSearch(!showSearch)}
//             >
//               <Search className="h-4 w-4" />
//             </Button>
//           </div>

//           {/* Right Side Controls */}
//           <div className={`flex items-center gap-4 ${showSearch ? 'hidden md:flex' : ''}`}>
//             <div className="hidden sm:flex items-center gap-2">
//               <DarkMode />
//               <span className="text-sm md:text-base font-medium">
//                 {time}
//               </span>
//             </div>
//             <AvatarComponent />
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }