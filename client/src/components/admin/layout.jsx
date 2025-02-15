import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import Header from "./header";
import SideBarComponent from "./sideBar";
 

export default function AdminLayout() {
  return (
    <div className="overflow-hidden"> 
    <SidebarProvider  >
      <SideBarComponent />
      <main className=" w-full flex ">
        
    
          
       

        <div className=" flex-1 flex flex-col gap-0.5 ml-4  w-full   ">
          <Header />
          <Outlet className="flex-1 " />
        </div>
      </main>
    </SidebarProvider>
    </div>
  );
}
