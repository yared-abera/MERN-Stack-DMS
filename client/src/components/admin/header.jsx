import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { CalendarX, LogOut, UserCog } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const NowDate = new Date();
  const [showCalendar, setShowCalendar] = useState(false);
  const [time, setTime] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const navigate=useNavigate()
  //
  return (
    <header className="fixed top-0 ml-3   w-full z-50 flex h-20 items-center justify-between px-4 border-b bg-background shadow-lg md:px-8 lg:justify-around lg:gap-4">
    
        <div className="flex items-start justify-between gap-3 ">
          <Button className='sm:ml-3'>Search</Button>
          <Input type="text" placeholder="Search user by Using User Name " className='transition-all duration-300 ease-in-out  dark:text-white ' />
       
        </div>
        <div className="flex justify-between items-center gap-6">
          <div>
            <Button
              className="  border-none cursor-pointer   mt-2  "
              onClick={toggleCalendar}
            >
              <CalendarX size='25' />
            </Button>
            {showCalendar && (
              <div className="bg-none border-spacing-0 cursor-pointer font-semibold m-2">
                <h3> Date: {NowDate.toLocaleDateString()}</h3>
              </div>
            )}
          </div>
          <div>
            {" "}
            <span className="font-sans text-lg font-bold">{time}</span>
          </div>
        </div>

        <div className="mr-8">
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer dark:bg-white ">
            <AvatarFallback className="bg-black dark:bg-white dark:text-black  text-white font-extrabold  ">
              xu
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as  </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem  >
            <UserCog className="m-2 w-4 h-4" onClick={()=>navigate('/admin/account')} />
             Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem  >
            <LogOut className="w-4 h-4 m-2 " />
            LogOut
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
        </div>

        <div></div>
    
    </header>
  );
}
