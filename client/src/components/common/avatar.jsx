import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
 
import { Avatar, AvatarFallback } from "../ui/avatar";
import { LogOut,  UserCog } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { LogOutUser } from '@/store/auth-slice';
export default function AvatarComponent() {

  const {user}=useSelector(state=>state.auth)
  const dispatch=useDispatch()
  
  function handleLogOut(){
    console.log("logOut button");
    
  dispatch(LogOutUser())
  }

  return (
    
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="bg-black cursor-pointer dark:bg-white">
          <AvatarFallback className="bg-black dark:bg-white dark:text-black text-white font-extrabold">
            YA
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="w-56">
        <DropdownMenuLabel>Logged in as <span className='text-violet-600 text-sm md:text-base'>{user?.username}</span> </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserCog
            className="m-2 w-4 h-4"
            onClick={() => navigate("/proctor/account")}
          />
          Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogOut}>
          <LogOut className="w-4 h-4 m-2" />
           LogOut
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu> 
  )
}
