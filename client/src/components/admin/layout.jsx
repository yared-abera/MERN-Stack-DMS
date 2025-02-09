import { Outlet } from "react-router-dom";
import Header from "./header";
import SideBar from "./sideBar";

export default function AdminLayout(){
    return(<div className="flex flex-col w-full h-[100vh] overflow-hidden bg-green-500"> 
      <Header/>

  <div className="grid grid-cols-2 gap-3 ">
    <SideBar />

  <Outlet/> 
  </div>
       
    </div>)
}