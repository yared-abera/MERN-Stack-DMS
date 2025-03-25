import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import LogIn from "./pages/auth/login";
import LogInLayout from "./components/auth/layout";
import AdminLayout from "./components/admin/layout";
import ProctorManagerLayout from "./components/proctor-manager/Layout";
import ManageAccount from "./pages/Admin/manageAccount";
import AdminAccount from "./pages/Admin/account";
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
import RegisterBlockComp from "./pages/proctorManager/RegisterBlockPage";
import RegisterStudent from "./pages/proctorManager/RegisterStudentPage";
import ViewFeedback from "./pages/proctorManager/ViewFeedbackPage";
import ViewMaintenance from "./pages/proctorManager/ViewMaintenancePage";
import GenerateReport from "./pages/proctorManager/GenerateReportPage";
import ProctorLayout from "./components/proctor/layout";
import Comment from "./pages/student/comment";
import CheckAuthComponent from "./components/common/checkAuth";
import AdminDashboard from "./pages/Admin/dashbord";
import { checkAuthorization } from "./store/auth-slice";
import Notfound from "./components/common/notFound";
import UnauthPage from "./components/common/unAuth-page";
import ProctorHomePage from "./pages/proctor/homePage"
import RegisterDormComp from "./pages/proctor/registerDorm"
import RegisterStudentPage from "./pages/proctor/RegisterStudentPage"
import ProctorViewInfo from "./pages/proctor/viewStudentInfo"
import ProctorGenerateReport from "./pages/proctor/generateReport"
import MaintenanceIssuePage from "./pages/proctor/MaintenanceIssuePage"
import BlockInfo from "./pages/studentDean/BlockInfo";
import { GetAvaiableBlocks } from "./store/blockSlice";
import { getAllocatedStudent } from "./store/studentAllocation/allocateSlice";
import { getAllUser } from "./store/user-slice/userSlice";
function App() {
  
  const theme = useSelector((state) => state.theme.mode);
  const  { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
 
 
    
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuthorization());
    // dispatch(GetAvaiableBlocks())
    // dispatch(getAllocatedStudent())
    // dispatch(getAllUser())
  }, [dispatch]);



  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  if (isLoading){
    console.log(isLoading,"isLoading");
    
    return (
      <div>
        <h1 className="w-[100px] h-[20px] rounded-full text-center bg-black">Loading...</h1>
      </div>
    );

  } 

  return (
    <div className={`dark:bg-gray-800  ${theme === "dark" ? "dark" : ""}`}>
      {/* common header  */}

      <Routes>
        <Route
          path="/"
          element={
            <CheckAuthComponent isAuthenticated={isAuthenticated} user={user}>
              <Home />
            </CheckAuthComponent>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuthComponent isAuthenticated={isAuthenticated} user={user}>
              <LogInLayout />
            </CheckAuthComponent>
          }
        >
          <Route path="logIn" element={<LogIn />} />
        </Route>

        <Route
          path="/admin"
          element={  
           
           <CheckAuthComponent isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
              </CheckAuthComponent>
            
          }
        >
          <Route path="home" element={<AdminDashboard />} />
          <Route path="manage" element={<ManageAccount />} />
          <Route path="account" element={<AdminAccount />} />
        </Route>

        <Route
          path="/proctor-manager"
          element={
            <CheckAuthComponent isAuthenticated={isAuthenticated} user={user}>
              <ProctorManagerLayout />
            </CheckAuthComponent>
          }
        >
          <Route path="RegisterBlock" element={<RegisterBlockComp />} />
          <Route path="RegisterStudent" element={<RegisterStudent />} />
          <Route path="ViewFeedback" element={<ViewFeedback />} />
          <Route path="ViewMaintenance" element={<ViewMaintenance />} />
          <Route path="GenerateReport" element={<GenerateReport />} />
        </Route>

        <Route path="/proctor" 
        element={
          <CheckAuthComponent isAuthenticated={isAuthenticated} user={user}>
              <ProctorLayout />
            </CheckAuthComponent>}>
           <Route path="home" element={<ProctorHomePage/>} />
          <Route path="dorm" element={<RegisterDormComp/>} />
          <Route path="register" element={<RegisterStudentPage/>} />
          <Route path="info" element={<ProctorViewInfo/>} />
          <Route path="report" element={<ProctorGenerateReport/>} />  
          <Route path="issue" element={<MaintenanceIssuePage/>} /> 
        </Route>

        <Route
          path="/dean"
          element={
            <CheckAuthComponent isAuthenticated={isAuthenticated} user={user}>
              <StudentDeanLayout />
            </CheckAuthComponent>
          }
        >
          <Route path="home" element={<StudentDeanHome />} />
          <Route path="dorm" element={<DormAllocation />} />
          <Route path="info" element={<StudentInfo />} />
          <Route path="block" element={<BlockInfo/>} />
          <Route path="account" element={<StudDeanAccount />} />
        </Route>

        <Route
          path="/student"
          element={
            <CheckAuthComponent isAuthenticated={isAuthenticated} user={user}>
              <StudentLayout />
            </CheckAuthComponent>
          }
        >
          <Route path="home" element={<StudentHome />} />
          <Route path="dorm" element={<ViewDorm />} />
          <Route path="issue" element={<ReportMaintenace />} />
          <Route path="account" element={<StudentAccount />} />
          <Route path="comment" element={<Comment />} />
        </Route>
        <Route path="/unauth-page" element={<UnauthPage/>} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  );
}

export default App;
