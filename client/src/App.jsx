import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import LogIn from "./pages/auth/login";
import LogInLayout from "./components/auth/layout";
import Admin from "./pages/Admin/dashbord";
import AdminLayout from "./components/admin/layout";
import { ProctorManagerLayout } from './pages/proctorManager/index'
import ManageAccount from "./pages/Admin/manageAccount";
import Account from "./pages/Admin/account";
import StudentDeanLayout from "./components/studentDean/layout";
import StudentDeanHome from "./pages/studentDean";
import DormAllocation from './pages/studentDean/allocation';
import StudDeanAccount from "./pages/studentDean/account";
import StudentInfo from "./pages/studentDean/viewStudentInfo";
 

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
    <div className={`dark:bg-gray-800  ${theme === "dark" ? "dark" : ""}`}>
      {/* common header  */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<LogInLayout />}>
          <Route path="logIn" element={<LogIn />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashbord" element={<Admin />} />
          <Route path="manage" element={<ManageAccount />} />
          <Route path="account" element={<Account />} />
        </Route>
        <Route path="/proctor-manager" element={<ProctorManagerLayout/>} />

        
        <Route path="/dean" element={<StudentDeanLayout/>}>
        <Route path="home" element={<StudentDeanHome/>}/>
        <Route path="allocate" element={<DormAllocation/>}/>
        <Route path="account" element={<StudDeanAccount/>}/>
        <Route path="info" element={<StudentInfo/>}/>

        </Route>
      </Routes>
    </div>
  );
}

export default App;
