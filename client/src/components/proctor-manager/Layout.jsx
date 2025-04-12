import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Header from "@/components/proctor-manager/header";
import SideBarComponent from "@/components/proctor-manager/sidebar";
 
export default function ProctorManagerLayout() {
  
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <SideBarComponent /> 
     <main className="flex-1 flex flex-col">
        <div className="sticky top-0  z-20">
            <div className="flex">
             
            <Header />
            </div>
          </div>  
          <Outlet className="flex-1 p-4 m-4  " />
        </main>
      </div>
    </SidebarProvider>
  );
}
