import { useLocation, Navigate } from "react-router-dom";

const roleRoutes = {
  admin: "/admin/home",
  studentDean: "/dean/home",
  student: "/student/home",
  proctorManager: "/proctor-manager/RegisterBlock",
  proctor: "/proctor/RegisterBlock",
};

const roleBasePaths = {
  admin: "/admin",
  studentDean: "/dean",
  student: "/student",
  proctorManager: "/proctor-manager",
  proctor: "/proctor",
};

export default function CheckAuthComponent({ isAuthenticated, user, children }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Public paths that don't require authentication
  const isPublicPath = ["/", "/auth/logIn"].includes(currentPath);

  // 1. Handle unauthenticated users
  if (!isAuthenticated) {
    return isPublicPath ? children : <Navigate to="/auth/logIn" replace />;
  }

  // 2. Handle authenticated users
  const userRole = user?.role;
  const allowedBasePath = roleBasePaths[userRole];
  const isAllowedPath = allowedBasePath ? currentPath.startsWith(allowedBasePath) : <Navigate to={'/unauth-page'}/>;
   
  

  // Redirect to role dashboard if trying to access unauthorized routes
  if (!isAllowedPath) {
    return <Navigate to={roleRoutes[userRole]   } replace />;
  }

  // 3. Prevent access to login page when authenticated
  if (currentPath === "/auth/logIn") {
    return <Navigate to={roleRoutes[userRole]  } replace />;
  }

  return children;
}