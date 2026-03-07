import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const user = useContext(AuthContext);

  // If no user or user doesn't have required role
  if (!user || user.role !== role) {
    return (
      <div className="p-8 text-red-500 font-semibold">
        Access Denied — {role}s only.
      </div>
    );
  }

  return children;
}
