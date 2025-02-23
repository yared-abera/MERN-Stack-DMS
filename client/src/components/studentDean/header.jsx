import { SidebarTrigger } from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
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
    <header className="overflow-hidden fixed w-full h-20 top-0   md:p-4   border-solid shadow-md  flex gap-4  dark:bg-black bg-white ">
      <div className="flex text-left ">
        <SidebarTrigger />
      </div>
      <div className="flex-1 flex gap-3 ">
        <div className="flex   gap-2 w-1/4">
          <Button className="hidden md:inline-flex  ">Search</Button>
          <Button
            className="inline-flex md:hidden  "
            size="sm"
            onClick={handleSearch}
          >
            <Search />
          </Button>
          <Input
            type="text"
            placeholder="Search user by Using User Name"
            className="hidden md:inline-flex transition-all duration-300  ease-in-out dark:text-white flex-1"
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
             
              <DarkMode/>
  
              <div>
                <span className="font-sans md:text-lg md:font-bold sm:text-sm sm:font-semibold">
                  {time} 
                </span>
              </div>
             
          
  
           
          </div>
          )}
      
        <div className="ml-4 sm:ml-8 ">
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="bg-black cursor-pointer dark:bg-white">
                    <AvatarFallback className="bg-black dark:bg-white dark:text-black text-white font-extrabold">
                      xu
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-56">
                  <DropdownMenuLabel>Logged in as</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserCog
                      className="m-2 w-4 h-4"
                      onClick={() => navigate("/admin/account")}
                    />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="w-4 h-4 m-2" />
                    LogOut
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
              <AvatarComponent/>
            </div>

            </div>
      
      </div>
    </header>
  );
}
