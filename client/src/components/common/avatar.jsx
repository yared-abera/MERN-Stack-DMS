import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";  // <-- import AvatarImage
import { LogOut } from "lucide-react";
import { useDispatch } from 'react-redux';
import { LogOutUser } from '@/store/auth-slice';
import { toast } from 'sonner';

export default function AvatarComponent({ ThisUser }) {
  const dispatch = useDispatch();

  function handleLogOut() {
    dispatch(LogOutUser()).then(({ payload }) => {
      if (payload.success) {
        // also fixed your template literal here (use `${…}`, not `&{…}`)
        toast.success(`${payload.message}`);
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="bg-black cursor-pointer dark:bg-white">
          {/* This is the actual image element: */}
          <AvatarImage
            src={ThisUser.profileImage}
            alt={`${ThisUser.fName || ThisUser.userName}'s avatar`}
          />
          {/* Fallback to initials or name if the image URL is missing/broken: */}
          <AvatarFallback>
            { ThisUser.fName.charAt(0)||'' }
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="w-56">
        <DropdownMenuLabel>
          Logged in as{" "}
          <span className="text-violet-600 text-sm md:text-base">
            {ThisUser.userName}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogOut}>
          <LogOut className="w-4 h-4 m-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
