import { Outlet } from "react-router-dom";
import StudentHeader from "./header";
 

export default function StudentLayout() {
  return (
    <div className="overflow-hidden w-full ">
    
      <StudentHeader />
       
   
      <Outlet />
    </div>
  );
}
