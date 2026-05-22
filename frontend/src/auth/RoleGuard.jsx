import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleGuard = ({ allowedRoles }) => {
  const userRole = useSelector((state) => state.user.role);

  if (!allowedRoles.includes(userRole)) {
    // If not allowed, redirect to dashboard
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleGuard;
