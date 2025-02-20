import { Navigate, useLocation } from "react-router-dom";

const roleRoutes = {
  admin: "/admin/dashboard",
  studentDean: "/dean/home",
  student: "/student/home",
  proctorManager: "/proctor-manager/register-block",
  proctor: "/proctor/register-block",
};

export default function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
 console.log(isAuthenticated,"checkout");
 
  
if (!isAuthenticated) {
     
  if (location.pathname === "/" || location.pathname.includes("logIn")) {
    return children;  
  }
    
  return <Navigate to="/" />;
}
  // Get the user's role
  const userRole = user?.role;
  console.log(roleRoutes[userRole]);
  

  // location.pathname === "/" || location.pathname.includes("logIn")
  if (isAuthenticated) {
   
    if (location.pathname === "/" || location.pathname.includes("logIn")) {
      return <Navigate to={roleRoutes[userRole]} />;
    }

    // Check if the current path matches the user's role's path
    const allowedPath = roleRoutes[userRole];

    // If the current path does not match the user's allowed path, redirect them
    if (location.pathname !== allowedPath) {
      return <Navigate to={allowedPath} />;
    }
  }

  return children;
}

 