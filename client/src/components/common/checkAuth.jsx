import { useLocation, Navigate } from "react-router-dom";

const roleRoutes = {
  admin: "/admin/home",
  studentDean: "/dean/home",
  Student:"/student/home",
  proctorManager: "/proctor-manager/home",
  proctor: "/proctor/home",
};

const roleBasePaths = {
  admin: "/admin",
  studentDean: "/dean",
  Student: "/student",
  proctorManager:"/proctor-manager",
  proctor: "/proctor",
};

 
 
export default function CheckAuthComponent({ isAuthenticated, user, children }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Public paths that don't require authentication
  const isPublicPath = ["/", "/auth/logIn"].includes(currentPath);
  console.log(user,"checkAuthComponent");
  

  // 1. Handle unauthenticated users
  if (!isAuthenticated) {
    return isPublicPath ? children : <Navigate to="/auth/logIn" replace />;
  }

  // 2. Handle authenticated users
 const correctRole=user?.role.split('').join('')
  
  let userRole =correctRole||user?.role  
   
  const allowedBasePath = roleBasePaths[userRole];

  // Redirect to unauth-page if user role is not recognized
  if (!allowedBasePath) {
    return <Navigate to="/auth/logIn" replace />;
  }

  const isAllowedPath = currentPath.startsWith(allowedBasePath);

  // Redirect to role dashboard if trying to access unauthorized routes
  if (!isAllowedPath) {
    return <Navigate to={roleRoutes[userRole]} replace />;
  }

  // 3. Prevent access to login page when authenticated
  if (currentPath === "/auth/logIn") {
    return <Navigate to={roleRoutes[userRole]} replace />;
  }

  return children;
}
