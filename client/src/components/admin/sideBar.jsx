import {   ChevronUp, Home, Inbox, Search, Settings, User2 } from "lucide-react"

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

// Menu items.
const items = [
  {
    title: "Dashbord",
    url: "/admin/dashbord",
    icon: Home,
  },
  {
    title: "Manage Account",
    url: "/admin/manage",
    icon: Inbox,
  },
  {
    title: "Settings",
    url: "/admin/setting",
    icon: Settings,
  },
  
  {
    title: "Search",
    url: "#",
    icon: Search,
  },

]

export default function SideBarComponent() {
  return (
    <Sidebar variant='floating' collapsible='icon'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='font-bold  font-serif text-2xl'>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className='mt-4'>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}  className=' pl-0 ml-0 my-2'>
                  <SidebarMenuButton asChild>
                    <a href={item.url}  >
                    <item.icon className="text-2xl font-extrabold " style={{ width: '40px', height: '25px' }} />
                      <span className="font-bold text-lg text-muted-foreground ">{item.title}</span>
                    </a>
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
                <SidebarMenuButton className="flex items-center">
                  <User2 /> 
                  <span className="ml-2">Username</span> 
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
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