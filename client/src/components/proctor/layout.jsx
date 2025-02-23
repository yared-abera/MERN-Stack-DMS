import { Outlet } from "react-router-dom";
import Header from "./header";
import { SidebarProvider} from "../ui/sidebar";
import  ProctorSideBar from "./SideBar";
 

export default function ProctorLayout() {
   
  return (
    <SidebarProvider>
  <div className="flex w-full h-screen overflow-hidden">
   
    <ProctorSideBar className="w-64 flex-shrink-0 hidden md:block" />
    
    
    <div className="flex flex-col flex-1 min-w-0">
 
      <div className="w-full sticky top-0 z-20 bg-white shadow-2xl p-4">
        <div className="flex items-center">
          <Header />
        </div>
      </div>
      
     
      <main className="flex-1 p-4  mt-16 md:w-[calc(100%-1rem)] mx-auto overflow-y-scroll transition-all duration-300">
        <Outlet />
      </main>
    </div>
  </div>
</SidebarProvider>

  );
} 
