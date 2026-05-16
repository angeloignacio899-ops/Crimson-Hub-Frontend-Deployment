import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const role_id = Number(localStorage.getItem("role_id"));

  // allowedRoles is an array of IDs e.g. [2,3]
  if (!role_id || !allowedRoles.includes(role_id)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
