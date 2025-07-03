import { useAuth } from "@/context/AuthContext";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

const RedirectToDashboard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

export default RedirectToDashboard;
