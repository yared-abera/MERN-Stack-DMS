import { Outlet } from "react-router-dom";
import Header from "./header";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import  ProctorSideBar from "./SideBar";
 

export default function ProctorLayout() {
   
  return (
    <SidebarProvider>
  <div className="flex w-full h-screen">
   
    <ProctorSideBar className="w-64 flex-shrink-0" />
    
    
    <div className="flex flex-col flex-1">
 
      <div className="w-full sticky top-0 z-20 bg-white shadow-2xl p-4">
        <div className="flex items-center">
          <SidebarTrigger size="icon" />
          <Header />
        </div>
      </div>
      
     
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  </div>
</SidebarProvider>

  );
} 
