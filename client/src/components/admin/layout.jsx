import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import Header from "./header";
import SideBarComponent from "./sideBar";
 

export default function AdminLayout() {
  return (
    <SidebarProvider  >
      <SideBarComponent />
      <main className=" w-full flex ">
        
        <div className=" flex-1 flex flex-col gap-0.5 ml-4  w-full   ">
        <div className=" fixed mt-8 z-20  h-7   mr-0">   
         
        </div>
        
        <div className=" flex-1 flex flex-col gap-0.5 ml-4  w-full relative ">
          <Header />
          <Outlet className="flex-1 " />
        </div>
        </div>
      </main>
    </SidebarProvider>
    
  );
}
