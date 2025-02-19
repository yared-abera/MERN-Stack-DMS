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
    <nav className="overflow-hidden fixed w-full h-20 top-0   md:p-4   border-solid shadow-md  flex gap-4  dark:bg-black bg-white ">
      <div className="flxe text-left ">
        <SidebarTrigger />
      </div>
      <div className="flex-1 flex gap-3 ">
        <div className="flex   gap-2 w-1/4">
         
            </div>
            <div className="flex w-1/2  gap-6">
      
        <div className="ml-4 sm:ml-8 ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="bg-black cursor-pointer dark:bg-white">
                    <AvatarFallback className="bg-black dark:bg-white dark:text-black text-white font-extrabold">
                      YA
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-56">
                  <DropdownMenuLabel>Logged in as</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserCog
                      className="m-2 w-4 h-4"
                      onClick={() => navigate("/proctor/account")}
                    />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="w-4 h-4 m-2" />
                     LogOut
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            </div>     
      </div>
    </nav>
  );
}
