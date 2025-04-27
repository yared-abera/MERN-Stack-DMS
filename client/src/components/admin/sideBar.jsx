import { ChevronUp, Home, Inbox, LogOut, Settings, User2, Database } from "lucide-react"
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
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useDispatch } from "react-redux"
import { LogOutUser } from "@/store/auth-slice"
import { toast } from "sonner"

// Menu items with improved structure
const items = [
  {
    title: "Dashboard",
    url: "/admin/home",
    icon: Home,
  },
  {
    title: "Manage Account",
    url: "/admin/manage",
    icon: Inbox,
  },
  {
    title: "Database Backup",
    url: "/admin/backup",
    icon: Database,
  },
  {
    title: "My Account",
    url: "/admin/account",
    icon: Settings,
  },

]

export default function SideBarComponent() {
  const dispatch = useDispatch();
  function HandleLogout(){
    console.log("logout");
    dispatch(LogOutUser()).then((data) => {
      if(data.payload.success){

        toast.success(data.payload.message);
      }

    })}

  return (
    <Sidebar 
      variant="floating" 
      collapsible="icon"
      className="border-r shadow-sm"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold font-serif text-2xl hidden md:block">
            Admin
          </SidebarGroupLabel>
          <SidebarGroupLabel className="font-bold font-serif text-xl md:hidden">
            A
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className={cn(
                        "text-sm font-medium transition-all duration-200",
                        "opacity-0 md:opacity-100", // Hide text on mobile, show on desktop
                        "absolute md:relative", // Position text for accessibility
                        "invisible md:visible" // Hide from layout on mobile
                      )}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
                  <div className="flex items-center gap-2" >
                    <LogOut className="h-5 w-5 shrink-0"  />
                    <span className={cn(
                      "text-sm font-medium transition-all duration-200",
                      "opacity-0 md:opacity-100",
                      "absolute md:relative",
                      "invisible md:visible"
                    )}>
                      Profile
                    </span>
                    <ChevronUp className="h-4 w-4 ml-auto shrink-0" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                side="top" 
                className="w-48"
                align="start"
              >
                
                <DropdownMenuItem onClick={()=>HandleLogout()}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}


{/* */}