import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../ui/sidebar";
import Header from "./header";
import SideBarComponent from "./sideBar";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <SideBarComponent />
      <main className="w-full flex">
        <div className="flex-1 flex flex-col w-full">
          <Header />
          <div className="flex-1 p-4 overflow-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
