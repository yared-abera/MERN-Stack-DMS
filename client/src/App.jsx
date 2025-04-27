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
import RegisterStudent from "./pages/proctorManager/UpdateAllocation";
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
import ProctorHomePage from "./pages/proctor/homePage";
import RegisterDormComp from "./pages/proctor/registerDorm";
import RegisterStudentPage from "./pages/proctor/RegisterStudentPage";
import ProctorViewInfo from "./pages/proctor/viewStudentInfo";
import ProctorGenerateReport from "./pages/proctor/generateReport";
import MaintenanceIssuePage from "./pages/proctor/MaintenanceIssuePage";
import BlockInfo from "./pages/studentDean/BlockInfo";
import { GetAvaiableBlocks } from "./store/blockSlice";
import { getAllocatedStudent } from "./store/studentAllocation/allocateSlice";
import { getAllUser } from "./store/user-slice/userSlice";
import DeanMaintenanceIssue from "./pages/studentDean/DeanMaintenanceIssue";
import ProfileManagement from "./pages/proctorManager/ProfileManagementPage";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
 
import CommentHover from "./pages/student/myCommnt";
import ProctorAccount from "./pages/proctor/account";
import ProctorControleComponent from "./components/proctor/attendanceControl";
import ProctorAttendance from "./pages/proctor/Attendance";
import ManagerAttendance from "./pages/proctorManager/attendance";
import ProctorControl from "./pages/proctor/control";
import ManagerControl from "./pages/proctorManager/control";
import DeanIssueContol from "./pages/studentDean/viewControlIssues";
import ManagerDashBoard from "./pages/proctorManager/dashborad";
 
import AdminChat from "./pages/Admin/adminChat";
import ProctorManagerChat from "./pages/proctorManager/ProctorManagerChat";
import ProctorChat from "./pages/proctor/proctorChat/ProctorChat";
import StudentDeanChat from "./pages/studentDean/StudentDeanChat";
import StudentDeanGenerateReport from "./pages/studentDean/generateReport";

import { SocketProvider } from "./context/SocketContext";


import { motion } from "framer-motion";
import { Atom, Orbit, Sparkles } from "lucide-react";

function App() {
  const theme = useSelector((state) => state.theme.mode);
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  //  const user={
  //   role:'Admin',
  //   userName:'abdi'
  //  }
  //  const isAuthenticated=true
  //  const isLoading=true

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuthorization());
    // dispatch(GetAvaiableBlocks())
    // dispatch(getAllocatedStudent())
    // dispatch(getAllUser())
  }, [dispatch]);

  {
    /**
  this part is sensitive part so ,don't change any functional or structural thing just the layout modify the tailwind css and framer motion  */
  }
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);



  if (isLoading) {
    return (
      <motion.div
        className="fixed inset-0 bg-background/90 backdrop-blur-lg flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="relative flex flex-col items-center gap-6">
          {/* Animated atom icon with orbiting electrons */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-primary"
          >
            <Atom size={64} strokeWidth={1.5} />
          </motion.div>
  
          {/* Orbiting sparkles */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <motion.div
              className="absolute top-4 left-1/2"
              animate={{
                y: [-10, 10, -10],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Sparkles size={20} className="text-amber-400" />
            </motion.div>
          </motion.div>
  
          {/* Pulsating text with staggered dots */}
          <motion.div
            className="flex items-center gap-1 text-lg font-medium text-primary"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.5,
                },
              },
            }}
          >
            {"Loading".split('').map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      y: { stiffness: 1000, velocity: -100 },
                    },
                  },
                }}
              >
                {char}
              </motion.span>
            ))}
            <motion.div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    y: ["0%", "-50%", "0%"],
                    opacity: [0.2, 1, 0.2],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  .
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }
 


  return (
    <SocketProvider>
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
            <Route path="chat" element={<AdminChat/>} />
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
            <Route path="Attendance" element={<ManagerAttendance />} />
            <Route path="Control" element={<ManagerControl />} />
            <Route path="home" element={<ManagerDashBoard/>} />
            <Route path="Account" element={<ProfileManagement />} />
            <Route path="chat" element={<ProctorManagerChat/>} />
          </Route>

          <Route
            path="/proctor"
            element={
              <CheckAuthComponent isAuthenticated={isAuthenticated} user={user}>
                <ProctorLayout />
              </CheckAuthComponent>
            }
          >
            <Route path="home" element={<ProctorHomePage />} />
            <Route path="dorm" element={<RegisterDormComp />} />
            <Route path="register" element={<RegisterStudentPage />} />
            <Route path="info" element={<ProctorViewInfo />} />
            <Route path="report" element={<ProctorGenerateReport />} />
            <Route path="issue" element={<MaintenanceIssuePage />} />
            <Route path="account" element={<ProctorAccount />} />
            <Route path="attendance" element={<ProctorAttendance />} />
            <Route path="control" element={<ProctorControl />} />
            <Route path="chat" element={<ProctorChat/>} />
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
          <Route path="block" element={<BlockInfo />} />
          <Route path="account" element={<StudDeanAccount />} />
          <Route path="report" element={<StudentDeanGenerateReport />} />
          <Route path="issue" element={<DeanMaintenanceIssue />} />
          <Route path="control" element={<DeanIssueContol />} />
          <Route path="chat" element={<StudentDeanChat/>} />
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
            <Route path="block" element={<BlockInfo />} />
            <Route path="account" element={<StudDeanAccount />} />
           
            <Route path="issue" element={<DeanMaintenanceIssue />} />
            <Route path="control" element={<DeanIssueContol />} />
            <Route path="chat" element={<StudentDeanChat/>} />
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
            <Route path="commentHover" element={<CommentHover />} />
          </Route>
          <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </div>
    </SocketProvider>
  );
}

export default App;
