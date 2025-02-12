import { Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import LogIn from "./pages/auth/login";
import LogInLayout from "./components/auth/layout";
import Admin from "./pages/Admin/dashbord";
import AdminLayout from "./components/admin/layout";
import ProctorManagerLayout  from './components/proctor-manager/Layout';
import ManageAccount from "./pages/Admin/manageAccount";
 
function App() {
 
  const theme = useSelector((state) => state.theme.mode);
      useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

  return (

     <div className= {`dark:bg-gray-800  ${theme === 'dark' ? 'dark' : ''}`}>
     {/* common header  */}
 
     <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/auth" element={<LogInLayout />}>
          <Route path="logIn" element={<LogIn />}/> 
        </Route>

        <Route path="/admin" element ={<AdminLayout/>}>
         <Route path="dashbord" element={<Admin/>}/>
         <Route path="manage" element={<ManageAccount/>}/>
         <Route path="account" element/>
        </Route>
        <Route path="/proctor-manager" element={<ProctorManagerLayout/>} />
      </Routes>
 
 
 
     
     </div>
  )
}

export default App
