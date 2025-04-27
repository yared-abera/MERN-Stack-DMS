import { Outlet } from "react-router-dom";
import Header from "./header";
import { SidebarProvider } from "../ui/sidebar";
import ProctorSideBar from "./SideBar";

export default function ProctorLayout() {
  return (
    <SidebarProvider>
      <ProctorSideBar />

      <main className="w-full">
        <Header />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
