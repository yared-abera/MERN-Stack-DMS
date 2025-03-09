import { Outlet } from "react-router-dom";
import Header from "./header";
import { SidebarProvider } from "../ui/sidebar";
import StudetDeanSideBar from "./SideBar";
 

export default function StudentDeanLayout() {
   
  return (
    <SidebarProvider > 
      <StudetDeanSideBar />
      <main className="w-full">
        <Header />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
