import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import LogIn from "./pages/auth/login";
import LogInLayout from "./components/auth/layout";
import Admin from "./pages/Admin/dashbord";
import AdminLayout from "./components/admin/layout";
import ProctorManagerLayout  from './components/proctor-manager/Layout';
import ManageAccount from "./pages/Admin/manageAccount";
import Account from "./pages/Admin/account";
import ProfileManagement from "./pages/proctorManager/ProfileManagementPage";
import RegisterBlock from "./pages/proctorManager/RegisterBlockPage";
import RegisterStudent from "./pages/proctorManager/RegisterStudentPage";
import ViewFeedback from "./pages/proctorManager/ViewFeedbackPage";
import ViewMaintenance from "./pages/proctorManager/ViewMaintenancePage";
import GenerateReport from "./pages/proctorManager/GenerateReportPage";
import StudentDashboard from "./components/proctor/layout"
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
        <Route path="/proctorManager" element={<ProctorManagerLayout/>}  >
          <Route path="generateReport" element={ <GenerateReport/>}/>
          <Route path="profile" element={<ProfileManagement/>}/>
          <Route path="viewFeedback"element={<ViewFeedback/>}/>
          <Route path="viewMaintenance"element={<ViewMaintenance/>}/>
          <Route path="registerStudent"element={<RegisterStudent/>}/>
          <Route path="registerBlock"element={<RegisterBlock/>}/>
        </Route>
      
  
        <Route path="/student" element={<StudentDashboard/>}>

         </Route>
     </Routes>
     </div>
  )
}

export default App;
