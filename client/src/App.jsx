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
import StudentDeanLayout from "./components/studentDean/layout";
import StudentDeanHome from "./pages/studentDean";
import DormAllocation from "./pages/studentDean/allocation";
import StudentInfo from "./pages/studentDean/viewStudentInfo";
import StudDeanAccount from "./pages/studentDean/account";
import StudentLayout from "./components/student/studentLayout";
import StudentHome from "./pages/student/home";
import ViewDorm from "./pages/student/viewDorm";
import ReportMaintenace from "./pages/student/maintenanceIssue";
import StudentAccount from "./pages/student/account";
import RegisterBlock from "./pages/proctorManager/RegisterBlockPage";
import RegisterStudent from "./pages/proctorManager/RegisterStudentPage";
import ViewFeedback from "./pages/proctorManager/ViewFeedbackPage";
import ViewMaintenance from "./pages/proctorManager/ViewMaintenancePage";
import GenerateReport from "./pages/proctorManager/GenerateReportPage";
import ProctorLayout from "./components/proctor/layout";
import Comment from "./pages/student/comment";
 

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
        
        <Route path="/proctor-manager" element={<ProctorManagerLayout/>}>
          <Route path="RegisterBlock" element={<RegisterBlock/>} />
          <Route path="RegisterStudent" element={<RegisterStudent/>} />
          <Route path="ViewFeedback" element={<ViewFeedback/>} />
          <Route path="ViewMaintenance" element={<ViewMaintenance />} />
          <Route path="GenerateReport" element={<GenerateReport/>} />
        </Route>

        <Route path="/proctor" element={<ProctorLayout/>}>
          {/* <Route path="RegisterBlock" element={<RegisterBlock/>} />
          <Route path="RegisterStudent" element={<RegisterStudent/>} />
          <Route path="ViewFeedback" element={<ViewFeedback/>} />
          <Route path="ViewMaintenance" element={<ViewMaintenance />} />
          <Route path="GenerateReport" element={<GenerateReport/>} /> */}
        </Route>

      <Route path="/dean" element={<StudentDeanLayout/>}>
          <Route path="home" element={<StudentDeanHome/>} />
          <Route path="dorm" element={<DormAllocation/>} />
          <Route path="info" element={<StudentInfo/>} />
          <Route path="account" element={<StudDeanAccount/>} />
        </Route>

      <Route path="/student" element={<StudentLayout/>}>
          <Route path="home" element={<StudentHome/>} />
          <Route path="dorm" element={<ViewDorm/>} />
          <Route path="issue" element={<ReportMaintenace/>} />
          <Route path="account" element={<StudentAccount/>} />
          <Route path="comment" element={<Comment/>} />
        </Route>
      
      </Routes>
 
 
 
     
     </div>
  )
}

export default App;
