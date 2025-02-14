import { Outlet } from "react-router-dom";
import React from 'react'

function StudentLayout() {
  return (
    <div className="overflow-hidden">
      <SidebarProvider  >
            <SideBarComponent />
            <main className=" w-full flex ">
              <div className=" fixed mt-8 z-20  h-7  mr-0">
                <SidebarTrigger />
              </div>
              <div className=" flex-1 flex flex-col gap-0.5 ml-4  w-full relative ">
                <Header />
                <Outlet className="flex-1 " />
              </div>
            </main>
          </SidebarProvider>
    </div>
  )
}


export default StudentLayout