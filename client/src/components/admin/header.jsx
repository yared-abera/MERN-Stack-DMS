import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { CalendarX, LogOut, Search, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "../ui/sidebar";
import AvatarComponent from "../common/avatar";
import ChatButton from "../common/ChatButton";

export default function Header() {
  const NowDate = new Date();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
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

  const navigate = useNavigate();
  function handleSearch() {
    setShowSearch(!showSearch);
  }

  return (
    <header className="sticky overflow-x-hidden top-0  w-full z-0 h-auto flex  p-4  border-b bg-background shadow-lg lg:gap-4">
      <div className="text-left flex items-start justify-start">
        <SidebarTrigger />
      </div>

    
 <div className="flex-1 flex   gap-4  ">
  <div className="flex  justify-between gap-3 sm:ml-1 w-full  ">
    <Button className="hidden md:inline-flex  ">Search</Button>
    <Button className="inline-flex md:hidden  " size="sm" onClick={handleSearch}>
      <Search />
    </Button>
    <Input
      type="text"
      placeholder="Search user by Using User Name"
      className="hidden md:inline-flex transition-all duration-300 ease-in-out dark:text-white flex-1"
    />
    {showSearch ? (
      <Input
        type="text"
        placeholder="Search user by Using User Name"
        className="md:hidden transition-all duration-300 ease-in-out dark:text-white flex-1"
      />
    ) : (
      <div className="flex items-center justify-center flex-1 ">
        <Button
          className={showCalendar ? "hidden" : "border-none cursor-pointer "}
          onClick={toggleCalendar}
        >
          <CalendarX />
        </Button>
        {showCalendar && (
          <div
            className="bg-none border-spacing-0 cursor-pointer font-semibold  flex-1"
            onClick={toggleCalendar}
          >
            <h3>Date: {NowDate.toLocaleDateString()}</h3>
          </div>
        )}
      </div>
    )}
    <div className="flex-1">
      <span className="font-sans md:text-lg md:font-bold sm:text-sm sm:font-semibold">
        {time}
      </span>
    </div>
    <div className="flex items-center gap-4 md:mr-20 sm:ml-2 flex-1">
      <ChatButton />
      <AvatarComponent/>
    </div>
  </div>
</div>

    </header>
   
  );
}
 