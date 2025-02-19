import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "../ui/sidebar";
  import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
 
  import { Bug, Home, LogOut, MessageSquareShare, UserCog, View } from "lucide-react";
  const headerComponent = [
    {
      label: "home",
      url: "/student/home",
      icon: Home,
    },
    {
      label: "viewDorm",
      url: "/student/dorm",
      icon: View,
    },
    {
      label: "Maintenance Issue",
      url: "/student/issue",
      icon: Bug,
    },
    {
      label: "Comment",
      url: "/student/comment",
      icon: MessageSquareShare ,
    },
  ];

export default function StudentSideBar(){
  const location =useLocation()

    return(<Sidebar>
        <SidebarContent>
                   <SidebarGroup>
                     <SidebarGroupLabel className="sm:text-lg sm:font-semibold md:text-2xl font-bold mb-4">
                       Student Dean
                     </SidebarGroupLabel>
                     <SidebarGroupContent className='mt-4'>
                       <SidebarMenu>
                         {headerComponent.map((item,index) => (
                           <SidebarMenuItem key={item.label}>
                             <SidebarMenuButton asChild>
                               <Link
                                 to={item.url}
                                  
                                 className={`text-lg font-semibold hover:bg-slate-400 dark:hover:bg-blue-400 ${
                                   location.pathname === item.url ? "bg-blue-500 text-white" : ""
                                 }`}
                               >
                                 <item.icon />
                                 <span>{item.label}</span>
                               </Link>
                             </SidebarMenuButton>
                           </SidebarMenuItem>
                         ))}
                       </SidebarMenu>
                     </SidebarGroupContent>
                   </SidebarGroup>
        </SidebarContent>
    </Sidebar>)
}