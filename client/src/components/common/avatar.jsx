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
export default function AvatarComponent() {
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
  )
}
