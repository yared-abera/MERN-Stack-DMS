import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Bug,
  ChevronUp,
  Home,
  LogOut,
  MessageCircleReply,
  MessageSquareShare,
  User2Icon,
  UserCog,
  View,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
const headerComponent = [
  { label: "home", url: "/student/home", icon: Home },
  { label: "viewDorm", url: "/student/dorm", icon: View },
  { label: "Maintenance Issue", url: "/student/issue", icon: Bug },

  {
    label: "CommentHover",
    url: "/student/commentHover",
    icon: MessageSquareShare,
  },

  
 {label: "Account",
  url: "/student/account",
  icon:User2Icon,
},
];
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import Comment from "@/pages/student/comment";
import MyCommnt from "@/pages/student/myCommnt";
import { LogOutUser } from "@/store/auth-slice";
import { toast } from "sonner";

export default function StudentSideBar() {
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch=useDispatch()
  const [selectedNavigation, setNavigation] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigete=useNavigate()
  function HandleRemoveDialog() {
    setIsDialogOpen(false);
    setNavigation("");
    navigete("/student/home");
  }

  function HandleLogOut(){
    dispatch(LogOutUser()).then(data=>{
      if(data.payload.success){
        toast.success("LogOut Successfully")
      }
    })

  }

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="sm:text-lg sm:font-semibold md:text-2xl font-bold mb-4">
              Student Dean
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-4">
              <SidebarMenu>
                {headerComponent.map((item, index) =>
                  item.label === "CommentHover" ? (
                    <DropdownMenu
                      key={index}
                      open={menuOpen}
                      onOpenChange={setMenuOpen}
                    >
                      <DropdownMenuTrigger asChild>
                        <button
                          onMouseEnter={() => setMenuOpen(true)}
                          onMouseLeave={() => setMenuOpen(false)}
                          className={`flex items-center p-2 rounded-md transition ${
                            location.pathname === item.url
                              ? "bg-blue-500 text-white"
                              : "bg-sky-50 text-gray-700 hover:bg-sky-500"
                          }`}
                        >
                          <item.icon className="mr-2" />
                          {item.label}
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        side="bottom"
                        align="start"
                        className="w-12"
                        onMouseEnter={() => setMenuOpen(true)}
                        onMouseLeave={() => setMenuOpen(false)}
                      >
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='bg-blue-600'
                          onClick={() => {
                            setNavigation("submit");
                            setIsDialogOpen(true);
                          }}
                        >
                          <span className="text-sm"> SubmitComment</span>
                         
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className=' bg-green-600 text-white'
                          onClick={() => {
                            setNavigation("see");
                            setIsDialogOpen(true);
                          }}
                        >
                          <span className="text-sm text-white">Mycomment</span>
                         
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.url}
                          className={`text-lg font-semibold hover:bg-slate-400 dark:hover:bg-blue-400 ${
                            location.pathname === item.url
                              ? "bg-blue-500 text-white"
                              : ""
                          }`}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <div className="flex items-center gap-2 text-center " >
                    <LogOut className="h-5 w-5 text-center ml-5"  />
                     
                    <ChevronUp className="h-4 w-4 ml-auto shrink-0" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                side="top" 
                className="w-48"
                align="start"
              >
                
                <DropdownMenuItem onClick={()=>HandleLogOut()}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      </Sidebar>

      {selectedNavigation === "submit" && (
        <Comment
          isDialogOpen={isDialogOpen}
          HandleRemoveDialog={HandleRemoveDialog}
        />
      )}

      {selectedNavigation === "see" && (
        <MyCommnt
          isDialogOpen={isDialogOpen}
          HandleRemoveDialog={HandleRemoveDialog}
          id={user.id}
        />
      )}
    </>
  );
}
